'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseBrowser';
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/": ["./"] }
  },
  "include": ["next-env.d.ts","*/.ts","*/.tsx"],
  "exclude": ["node_modules"]
}

type User = { email?: string | null };
function useSession(){
  const supabase = supabaseBrowser();
  const [user, setUser] = useState<User | null>(null);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUser(data.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => { sub.subscription.unsubscribe(); };
  }, []);
  return user;
}

export default function AdminHome(){
  const supabase = supabaseBrowser();
  const user = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(()=>{
    (async ()=>{
      if(!user?.email) return;
      const { data } = await supabase.from('admins').select('email').eq('email', user.email).maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user?.email]);

  if(!user){
    return <p>Necesitás ingresar. <a href="/auth/sign-in">Ir a Ingresar</a></p>
  }
  if(!isAdmin){
    return <p>Tu usuario no es administrador. Agregá tu email a la tabla <code>admins</code>.</p>
  }
  return (
    <div style={{display:'grid', gap:8}}>
      <h2>Panel Admin</h2>
      <ul>
        <li><a href="/admin/products">Productos</a></li>
        <li><a href="/admin/categories">Categorías</a></li>
        <li><a href="/admin/orders">Pedidos</a></li>
      </ul>
    </div>
  )
}
