import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(req: NextRequest){
  try{
    const { customer_email, customer_name, items } = await req.json();
    if(!Array.isArray(items) || items.length===0){
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    // Validate stock only, do not discount here
    const ids = items.map((i:any)=> i.product_id);
    const { data: prods, error: e1 } = await supabaseAdmin
      .from('products')
      .select('id,price,stock,is_active')
      .in('id', ids);
    if(e1) throw e1;

    const stockMap = new Map(prods!.map(p => [p.id, p]));
    for(const it of items){
      const p:any = stockMap.get(it.product_id);
      if(!p) return NextResponse.json({ error: `Producto ${it.product_id} no encontrado` }, { status: 400 });
      if(!p.is_active) return NextResponse.json({ error: 'Producto inactivo' }, { status: 400 });
      if(it.qty<=0) return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
      if(p.stock < it.qty) return NextResponse.json({ error: 'Sin stock suficiente' }, { status: 400 });
    }

    const { data: order, error: e2 } = await supabaseAdmin
      .from('orders')
      .insert({ status: 'requested', customer_email, customer_name })
      .select('id')
      .single();
    if(e2) throw e2;

    const orderItems = items.map((it:any) => ({
      order_id: order!.id,
      product_id: it.product_id,
      qty: it.qty
    }));
    const { error: e3 } = await supabaseAdmin.from('order_items').insert(orderItems);
    if(e3) throw e3;

    return NextResponse.json({ ok: true, order_id: order!.id });
  }catch(e:any){
    console.error(e);
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 });
  }
}
