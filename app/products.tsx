import { supabaseAdmin } from '../lib/supabaseAdmin';
import React from 'react';
import dynamic from 'next/dynamic';
const ClientView = dynamic(() => import('./productsClient'), { ssr: false });

async function fetchData(){
  const [prods, cats] = await Promise.all([
    supabaseAdmin.from('products').select('id,name,description,image_url,price,stock,is_active,category_id,categories(name)').order('id'),
    supabaseAdmin.from('categories').select('id,name').order('name'),
  ]);
  return { products: (prods.data || []).filter((p:any)=>p.is_active), categories: cats.data || [] };
}

// @ts-expect-error Server -> Client
export default async function Products(){
  const data = await fetchData();
  return <ClientView products={data.products as any} categories={data.categories as any} />
}
