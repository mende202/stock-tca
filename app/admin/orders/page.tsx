'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseBrowser';

type Order = { id:number; customer_email:string|null; customer_name:string|null; status:'requested'|'confirmed'|'cancelled'|'fulfilled'; created_at:string };
type OrderItem = { id:number; order_id:number; product_id:number; qty:number; name?:string };

export default function OrdersAdmin(){
  const supabase = supabaseBrowser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, OrderItem[]>>({});
  const [msg, setMsg] = useState<string | null>(null);

  async function load(){
    const { data: os, error } = await supabase.from('orders').select('*').order('id', {ascending:false});
    if(error){ setMsg(error.message); return; }
    setOrders(os as Order[]);
    const ids = (os||[]).map((o:any)=>o.id);
    if(ids.length){
      const { data: it } = await supabase.from('order_items').select('id,order_id,product_id,qty, products(name)').in('order_id', ids);
      const map: Record<number, OrderItem[]> = {};
      (it||[]).forEach((row:any)=>{
        const k = row.order_id;
        if(!map[k]) map[k]=[];
        map[k].push({ id:row.id, order_id:row.order_id, product_id:row.product_id, qty:row.qty, name: row.products?.name });
      });
      setItemsByOrder(map);
    } else {
      setItemsByOrder({});
    }
  }
  useEffect(()=>{ load(); }, []);

  async function call(path:string){
    setMsg(null);
    const res = await fetch(path, { method: 'POST' });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){ setMsg(data.error || 'Error'); return; }
    load();
  }

  return (
    <div style={{display:'grid', gap:16}}>
      <h3>Pedidos</h3>
      {msg && <p>{msg}</p>}
      {orders.map(o => (
        <div key={o.id} className="card">
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <strong>Pedido #{o.id}</strong>
            <span>{new Date(o.created_at).toLocaleString()}</span>
          </div>
          <div>Cliente: {o.customer_name} &lt;{o.customer_email}&gt;</div>
          <div>Estado: <b>{o.status}</b></div>
          <div style={{marginTop:8}}>
            <table style={{width:'100%'}}>
              <thead><tr><th>Producto</th><th>Cant.</th></tr></thead>
              <tbody>
                {(itemsByOrder[o.id]||[]).map(it => (
                  <tr key={it.id}>
                    <td>{it.name || `#${it.product_id}`}</td>
                    <td>{it.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn btn-primary" onClick={()=>call(`/api/orders/${o.id}/confirm`)}>Confirmar</button>
            <button className="btn" onClick={()=>call(`/api/orders/${o.id}/cancel`)}>Cancelar</button>
            <button className="btn" onClick={async ()=>{
              const { error } = await supabase.from('orders').update({ status: 'fulfilled' }).eq('id', o.id);
              if(error){ setMsg(error.message); return; }
              load();
            }}>Entregar</button>
          </div>
        </div>
      ))}
      {orders.length===0 && <p>No hay pedidos todavía.</p>}
    </div>
  )
}
