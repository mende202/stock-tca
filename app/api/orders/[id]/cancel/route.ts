import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }){
  const orderId = Number(params.id);
  try{
    const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single();
    if(!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    if(order.status === 'cancelled') return NextResponse.json({ ok: true });
    const { data: items } = await supabaseAdmin.from('order_items').select('*').eq('order_id', orderId);
    if(!items) return NextResponse.json({ error: 'Pedido sin items' }, { status: 400 });

    if(order.status === 'confirmed'){
      for(const it of items){
        const { data: p } = await supabaseAdmin.from('products').select('id,stock').eq('id', it.product_id).single();
        const newStock = (p?.stock || 0) + it.qty;
        await supabaseAdmin.from('products').update({ stock: newStock }).eq('id', it.product_id);
        await supabaseAdmin.from('stock_movements').insert({ product_id: it.product_id, qty: it.qty, reason: 'adjustment' });
      }
    }
    await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
