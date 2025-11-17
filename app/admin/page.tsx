'use client';

import { useState } from 'react';

type TabKey = 'dashboard' | 'products' | 'orders' | 'stock' | 'admins';

export default function AdminPage() {
  const [tab, setTab] = useState<TabKey>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superior */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-violet-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Panel de administración
              </p>
              <p className="text-xs text-slate-500">Stock TCA 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">
              Estás viendo la versión admin interna
            </span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <nav className="mb-6 flex flex-wrap gap-2 border-b pb-2 text-sm">
          <TabButton
            label="Dashboard"
            active={tab === 'dashboard'}
            onClick={() => setTab('dashboard')}
          />
          <TabButton
            label="Productos"
            active={tab === 'products'}
            onClick={() => setTab('products')}
          />
          <TabButton
            label="Órdenes"
            active={tab === 'orders'}
            onClick={() => setTab('orders')}
          />
          <TabButton
            label="Stock"
            active={tab === 'stock'}
            onClick={() => setTab('stock')}
          />
          <TabButton
            label="Admins"
            active={tab === 'admins'}
            onClick={() => setTab('admins')}
          />
        </nav>

        {/* Vista según la pestaña */}
        {tab === 'dashboard' && <DashboardView />}
        {tab === 'products' && <ProductsView />}
        {tab === 'orders' && <OrdersView />}
        {tab === 'stock' && <StockView />}
        {tab === 'admins' && <AdminsView />}
      </main>
    </div>
  );
}

/* ------------------- Componentes auxiliares ------------------- */

type TabButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-3 py-1 text-xs font-medium transition',
        active
          ? 'bg-violet-600 text-white shadow-sm'
          : 'bg-transparent text-slate-600 hover:bg-slate-100',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

/* ------------------- Vistas ------------------- */

function DashboardView() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">
        Resumen general
      </h1>
      <p className="text-sm text-slate-500">
        Esta es la vista principal del panel tipo <strong>Shop PRO</strong>.
        Más adelante podemos conectar estos datos a Supabase. Por ahora es un
        resumen visual para que puedas trabajar y mostrar el panel.
      </p>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Productos activos" value="128" hint="Ejemplo" />
        <StatCard title="Órdenes del día" value="7" hint="Ejemplo" />
        <StatCard title="Stock bajo" value="14" hint="Ejemplo" />
        <StatCard title="Admins habilitados" value="3" hint="Ejemplo" />
      </div>
    </section>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
};

function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && (
        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function ProductsView() {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Productos</h2>
          <p className="text-xs text-slate-500">
            Acá vas a ver y administrar el catálogo (nombre, precio, categoría,
            imagen, etc.).
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          + Nuevo producto
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-700">
            <tr>
              <td className="px-4 py-2">
                Pelota tenis Pro (ejemplo)
              </td>
              <td className="px-4 py-2">$ 10.000</td>
              <td className="px-4 py-2">35</td>
              <td className="px-4 py-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Activo
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <button className="text-[11px] font-medium text-violet-600 hover:underline">
                  Editar
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                Vino Malbec Stock TCA (ejemplo)
              </td>
              <td className="px-4 py-2">$ 18.500</td>
              <td className="px-4 py-2">12</td>
              <td className="px-4 py-2">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Stock bajo
                </span>
              </td>
              <td className="px-4 py-2 text-right">
                <button className="text-[11px] font-medium text-violet-600 hover:underline">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400">
        🔧 Más adelante podemos reemplazar estas filas de ejemplo por datos
        reales desde Supabase (tabla <code>products</code>).
      </p>
    </section>
  );
}

function OrdersView() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Órdenes</h2>
        <p className="text-xs text-slate-500">
          Listado de pedidos realizados desde la tienda. Esto también se puede
          conectar a la tabla <code>orders</code>.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Nº Orden</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Solicitante</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs text-slate-700">
            <tr>
              <td className="px-4 py-2">#0001</td>
              <td className="px-4 py-2">16/11/2025</td>
              <td className="px-4 py-2">Recepción TCA</td>
              <td className="px-4 py-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Completada
                </span>
              </td>
              <td className="px-4 py-2 text-right">$ 45.000</td>
            </tr>
            <tr>
              <td className="px-4 py-2">#0002</td>
              <td className="px-4 py-2">16/11/2025</td>
              <td className="px-4 py-2">Bar TCA</td>
              <td className="px-4 py-2">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Pendiente
                </span>
              </td>
              <td className="px-4 py-2 text-right">$ 22.300</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400">
        💡 Cuando tengamos la tabla <code>orders</code>, estas filas se van a
        generar de forma automática.
      </p>
    </section>
  );
}

function StockView() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Stock</h2>
        <p className="text-xs text-slate-500">
          Resumen rápido de niveles de stock por sector (Bar, Recepción,
          Depósito, etc.).
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Bar</p>
          <p className="mt-2 text-sm text-slate-700">
            32 ítems con stock co
