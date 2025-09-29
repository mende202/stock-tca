'use client';
import { useEffect, useRef, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
// o: import { supabaseBrowser } from '../../lib/supabaseBrowser';
type Product = { id:number; name:string; description?:string|null; image_url?:string|null; price:number; stock:number; is_active:boolean; category_id:number|null };
type Category = { id:number; name:string };

export default function ProductsAdmin(){
  const supabase = supabaseBrowser();
  const [rows, setRows] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ name:'', price:0, stock:0, is_active:true, category_id: null });
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load(){
    const { data, error } = await supabase.from('products').select('*').order('id');
    if(error){ setMsg(error.message); return; }
    setRows(data as Product[]);
    const { data: c } = await supabase.from('categories').select('*').order('name');
    setCats((c||[]) as Category[]);
  }
  useEffect(()=>{ load(); }, []);

  async function uploadImage(file: File){
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false });
    if(error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl as string;
  }

  async function save(){
    setMsg(null);
    const payload:any = { name: form.name, description: form.description, image_url: form.image_url, price: form.price, stock: form.stock, is_active: form.is_active, category_id: form.category_id };
    if(form.id){
      const { error } = await supabase.from('products').update(payload).eq('id', form.id);
      if(error) return setMsg(error.message);
    }else{
      const { error } = await supabase.from('products').insert(payload);
      if(error) return setMsg(error.message);
    }
    setForm({ name:'', price:0, stock:0, is_active:true, category_id: null });
    if(fileRef.current){ fileRef.current.value=''; }
    load();
  }

  async function del(id:number){
    if(!confirm('¿Borrar producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if(error) return setMsg(error.message);
    load();
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if(!f) return;
    try{
      const url = await uploadImage(f);
      setForm(prev => ({ ...prev, image_url: url }));
      setMsg('Imagen subida.');
    }catch(err:any){
      setMsg(err.message);
    }
  }

  return (
    <div style={{display:'grid', gap:16}}>
      <h3>Productos</h3>
      <div className="card" style={{display:'grid', gap:8, maxWidth:700}}>
        <input placeholder="Nombre" value={form.name||''} onChange={e=>setForm({...form, name:e.target.value})}/>
        <textarea placeholder="Descripción" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})}/>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input placeholder="URL de imagen (opcional)" value={form.image_url||''} onChange={e=>setForm({...form, image_url:e.target.value})}/>
          <input type="file" ref={fileRef} accept="image/*" onChange={onPickFile} />
        </div>
        <div style={{display:'flex', gap:8}}>
          <input type="number" placeholder="Precio" value={form.price||0} onChange={e=>setForm({...form, price: Number(e.target.value)})}/>
          <input type="number" placeholder="Stock" value={form.stock||0} onChange={e=>setForm({...form, stock: Number(e.target.value)})}/>
          <select value={form.category_id ?? 0} onChange={e=>setForm({...form, category_id: Number(e.target.value)||null})}>
            <option value={0}>Sin categoría</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <label><input type="checkbox" checked={!!form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})}/> Activo</label>
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-primary" onClick={save}>Guardar</button>
          <button className="btn" onClick={()=>{ setForm({ name:'', price:0, stock:0, is_active:true, category_id: null }); if(fileRef.current){ fileRef.current.value=''; } }}>Limpiar</button>
        </div>
        {msg && <p>{msg}</p>}
      </div>

      <table style={{width:'100%'}}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Activo</th><th></th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{cats.find(c=>c.id===r.category_id)?.name || '-'}</td>
              <td>${r.price.toFixed(2)}</td>
              <td>{r.stock}</td>
              <td>{r.is_active ? 'Sí' : 'No'}</td>
              <td style={{display:'flex', gap:8}}>
                <button className="btn" onClick={()=>setForm(r)}>Editar</button>
                <button className="btn" onClick={()=>del(r.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
