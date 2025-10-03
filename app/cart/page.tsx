'use client';
import { CartProvider, useCart } from '../../components/CartContext';
import { useState } from 'react';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function InnerCartPage(){
  const { items, setQty, remove, clear } = useCart();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const total = items.reduce((acc, i) => acc + i.qty * i.product.price, 0);

  async function sendOrder(){
    setSending(true);
    setMsg(null);
    try{
      const res = await fetch('/api/order', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          items: items.map(i=>({ product_id: i.product.id, qty: i.qty }))
        })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Error');
      setMsg('¡Pedido enviado! Te vamos a contactar.');
      clear();
    }catch(e:any){
      setMsg(e.message);
    }finally{
      setSending(false);
    }
  }

  if(items.length===0){
    return <p>El carrito está vacío.</p>
  }

  return (
    <div>
      <h2>Carrito</h2>
      <table style={{width:'100%', marginBottom:12}}>
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.product.id}>
              <td>{i.product.name}</td>
              <td><input type="number" min={1} value={i.qty} onChange={e=>setQty(i.product.id, parseInt(e.target.value||'1'))} style={{width:64}}/></td>
              <td>${i.product.price.toFixed(2)}</td>
              <td>${(i.product.price * i.qty).toFixed(2)}</td>
              <td><button className="btn" onClick={()=>remove(i.product.id)}>Quitar</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><td colSpan={3} style={{textAlign:'right'}}>Total</td><td>${total.toFixed(2)}</td><td></td></tr></tfoot>
      </table>

      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Tu nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Tu email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn btn-primary" disabled={sending} onClick={sendOrder}>{sending?'Enviando...':'Enviar solicitud'}</button>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

export default function CartPage(){
  // Provider local por si el global aún no aplica durante el build
  return (
    <CartProvider>
      <InnerCartPage />
    </CartProvider>
  );
}
