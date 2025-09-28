'use client';
import React from 'react';

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  category_id?: number | null;
  categories?: { name: string } | null;
};

export default function ProductCard({ p, onAdd }:{ p: Product, onAdd:(p:Product)=>void }) {
  return (
    <div className="card">
      {p.image_url ? <img src={p.image_url} alt={p.name} style={{width:'100%', height:160, objectFit:'cover', borderRadius:6}}/> : null}
      <strong>{p.name}</strong>
      {p.categories?.name && <div className="badge">Categoría: {p.categories.name}</div>}
      <div style={{color:'#666', fontSize:14}}>{p.description}</div>
      <div><b>${p.price.toFixed(2)}</b></div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontSize:12, color: p.stock>0?'#0a0':'#a00'}}>
          {p.stock>0 ? `Stock: ${p.stock}` : 'Sin stock'}
        </span>
        <button className="btn" disabled={p.stock<=0} onClick={() => onAdd(p)}>Agregar</button>
      </div>
    </div>
  )
}
