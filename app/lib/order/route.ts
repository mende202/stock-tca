import { NextResponse } from 'next/server';
import { supabaseServer } from '../../lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json();
  const { data, error } = await supabase.from('orders').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 200 });
}
