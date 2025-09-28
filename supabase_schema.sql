-- Categorías
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null
);

-- Productos
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  image_url text,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  is_active boolean not null default true,
  category_id bigint references public.categories(id) on delete set null,
  inserted_at timestamptz not null default now()
);

-- Pedidos
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  customer_email text,
  customer_name text,
  status text not null default 'requested' check (status in ('requested','confirmed','cancelled','fulfilled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id),
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

-- Movimientos de stock
create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id),
  qty integer not null,
  reason text not null check (reason in ('initial','adjustment','order')),
  created_at timestamptz not null default now()
);

-- Admins
create table if not exists public.admins ( email text primary key );

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.admins enable row level security;
alter table public.categories enable row level security;

-- Policies básicas (admins via tabla admins)
create policy "leer productos activos (public)" on public.products for select using ( is_active = true );
create policy "leer productos todo (admin)" on public.products for select to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) );
create policy "escribir productos (admin)" on public.products for all to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) ) with check ( exists(select 1 from admins a where a.email = auth.email()) );

create policy "leer categorias (admin)" on public.categories for select to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) );
create policy "escribir categorias (admin)" on public.categories for all to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) ) with check ( exists(select 1 from admins a where a.email = auth.email()) );

create policy "leer orders (admin)" on public.orders for select to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) );
create policy "actualizar orders (admin)" on public.orders for update to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) ) with check ( exists(select 1 from admins a where a.email = auth.email()) );

create policy "leer order_items (admin)" on public.order_items for select to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) );

create policy "leer stock_movements (admin)" on public.stock_movements for select to authenticated using ( exists(select 1 from admins a where a.email = auth.email()) );

-- STORAGE POLICIES (drop + create limpio)
drop policy if exists "public read product-images" on storage.objects;
drop policy if exists "admins write product-images" on storage.objects;
drop policy if exists "admins update product-images" on storage.objects;
drop policy if exists "admins delete product-images" on storage.objects;

create policy "public read product-images"
on storage.objects
for select
to public
using ( bucket_id = 'product-images' );

create policy "admins write product-images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists(select 1 from public.admins a where a.email = auth.email())
);

create policy "admins update product-images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and exists(select 1 from public.admins a where a.email = auth.email())
)
with check (
  bucket_id = 'product-images'
  and exists(select 1 from public.admins a where a.email = auth.email())
);

create policy "admins delete product-images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and exists(select 1 from public.admins a where a.email = auth.email())
);
