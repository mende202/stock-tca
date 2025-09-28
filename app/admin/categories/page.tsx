'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseBrowser';

type Category = { id:number; name:string };

export default function CategoriesAdmin(){
  const supabase = supabaseBrowser();
  const [rows, setRows] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [edit, setEdit] = useState<Category | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load(){
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if(error){ setMsg(error.message); return; }
    setRows(data as Category[]);
  }
  useEffect(()=>{ load(); }, []);

  async function save(){
    setMsg(null);
    if(edit){
      const { error } = await supabase.from('categories').update({ name }).eq('id', edit.id);
      if(error) return setMsg(error.message);
    } else {
      const { error } = await supabase.from('categories').insert({ name });
      if(error) return setMsg(error.message);
    }
    setName(''); setEdit(null); load();
  }

  async function del(id:number){
    if(!confirm('¿Borrar categoría?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if(error) return setMsg(error.message);
    load();
  }

  return (
    <div style={{display:'grid', gap:16}}>
      <h3>Categorías</h3>
      <div className="card" style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-primary" onClick={save}>{edit?'Guardar':'Crear'}</button>
          <button className="btn" onClick={()=>{setEdit(null); setName('')}}>Limpiar</button>
        </div>
        {msg && <p>{msg}</p>}
      </div>

      <table style={{width:'100%'}}>
        <thead><tr><th>ID</th><th>Nombre</th><th></th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td style={{display:'flex', gap:8}}>
                <button className="btn" onClick={()=>{setEdit(r); setName(r.name)}}>Editar</button>
                <button className="btn" onClick={()=>del(r.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
