'use client';
import { supabaseBrowser } from '../../lib/supabaseBrowser';
import { useState } from 'react';

export default function SignInPage(){
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'in'|'up'>('in');
  const [msg, setMsg] = useState<string | null>(null);

  async function handle(){
    setMsg(null);
    try{
      if(mode==='in'){
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) throw error;
        location.href = '/admin';
      }else{
        const { error } = await supabase.auth.signUp({ email, password });
        if(error) throw error;
        setMsg('Cuenta creada. Ahora podés ingresar.');
        setMode('in');
      }
    }catch(e:any){
      setMsg(e.message);
    }
  }

  return (
    <div style={{maxWidth:420}}>
      <h2>{mode==='in' ? 'Ingresar' : 'Crear cuenta'}</h2>
      <div style={{display:'grid', gap:8}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" onClick={handle}>{mode==='in' ? 'Ingresar' : 'Registrarme'}</button>
        <button className="btn" onClick={()=>setMode(mode==='in'?'up':'in')} style={{textDecoration:'underline', width:'fit-content'}}>
          {mode==='in' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
        </button>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  )
}
