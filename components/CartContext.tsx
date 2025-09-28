'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from './ProductCard';
export type CartItem = { product: Product; qty: number; };
type CartCtx = { items: CartItem[]; add:(p:Product)=>void; remove:(id:number)=>void; setQty:(id:number, qty:number)=>void; clear:()=>void; };
const C = createContext<CartCtx | null>(null);
export function CartProvider({children}:{children:React.ReactNode}){
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { const raw = localStorage.getItem('cart'); if(raw) setItems(JSON.parse(raw)); }, []);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);
  const add = (p:Product) => setItems(prev => { const i=prev.findIndex(x=>x.product.id===p.id); if(i>=0){const c=[...prev]; c[i]={...c[i], qty:c[i].qty+1}; return c;} return [...prev, {product:p, qty:1}] });
  const remove = (id:number) => setItems(prev => prev.filter(i => i.product.id !== id));
  const setQty = (id:number, qty:number) => setItems(prev => prev.map(i => i.product.id===id ? {...i, qty} : i));
  const clear = () => setItems([]);
  return <C.Provider value={{items, add, remove, setQty, clear}}>{children}</C.Provider>
}
export function useCart(){ const ctx = useContext(C); if(!ctx) throw new Error('useCart must be used inside CartProvider'); return ctx; }
