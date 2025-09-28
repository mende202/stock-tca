'use client';
import ProductCard, { type Product } from '@/components/ProductCard';
import { useCart } from '@/components/CartContext';
import { useMemo, useState } from 'react';
type Cat = { id:number; name:string };
export default function ProductsClient({ products, categories }:{products: Product[], categories: Cat[]}){
  const { add } = useCart();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<number | 0>(0);
  const filtered = useMemo(()=>{
    return products.filter(p => {
      const okCat = cat===0 || p.category_id === cat;
      const okQ = !q || (p.name?.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase()));
      return okCat && okQ;
    });
  }, [q, cat, products]);
  return (
    <div>
      <div className="card" style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={cat} onChange={e=>setCat(Number(e.target.value))}>
          <option value={0}>Todas las categorías</option>
          {categories.map((c:Cat)=>(<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="grid">
        {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={add} />)}
        {filtered.length===0 && <p>No hay productos que coincidan.</p>}
      </div>
    </div>
  )
}
