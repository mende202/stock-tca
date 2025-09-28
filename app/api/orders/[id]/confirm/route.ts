import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }){
  const orderId = Number(params.id);
  try{
    // Get order + items
    const { data: order } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single();
    if(!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    if(order.status !== 'requested' && order.status !== 'cancelled'){
      return NextResponse.json({ error: 'No se puede confirmar este estado' }, { status: 400 });
    }
    const { data: items } = await supabaseAdmin.from('order_items').select('*').eq('order_id', orderId);
    if(!items || items.length===0) return NextResponse.json({ error: 'Pedido vacío' }, { status: 400 });

    // Validate stock again and discount
    const ids = items.map((it:any)=>it.product_id);
    const { data: prods } = await supabaseAdmin.from('products').select('id,stock,is_active').in('id', ids);
    const map = new Map(prods!.map((p:any)=>[p.id, p]));
    for(const it of items){
      const p:any = map.get(it.product_id);
      if(!p || !p.is_active) return NextResponse.json({ error: 'Producto inactivo o inexistente' }, { status: 400 });
      if(p.stock < it.qty) return NextResponse.json({ error: 'Sin stock suficiente' }, { status: 400 });
    }
    for(const it of items){
      const p:any = map.get(it.product_id);
      const newStock = p.stock - it.qty;
      const { error: eU } = await supabaseAdmin.from('products').update({ stock: newStock }).eq('id', it.product_id);
      if(eU) throw eU;
      await supabaseAdmin.from('stock_movements').insert({ product_id: it.product_id, qty: -it.qty, reason: 'order' });
    }
    await supabaseAdmin.from('orders').update({ status: 'confirmed' }).eq('id', orderId);
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
