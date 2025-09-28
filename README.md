# Tienda — Brand + PLUS + Confirm/Cancel

## Qué incluye
- Catálogo con **categorías**, **filtros** y **subida de imágenes** (Supabase Storage).
- **Marca personalizada** (colores + logo + nombre).
- Flujo de pedidos: **no descuenta stock al crear**; **descuenta al Confirmar**; **devuelve stock al Cancelar** si estaba confirmado.

## Branding rápido
- Cambiá el nombre en **variable de entorno** `BRAND_NAME` (o dejá “Mi Tienda”).
- Colores en `.env` (opcional): `BRAND_PRIMARY`, `BRAND_SECONDARY`.
- Reemplazá `/public/logo.svg` por tu logo (mismo nombre de archivo).

## Supabase (una vez)
1. Crear proyecto → **SQL Editor** → pegar **supabase_schema.sql** → **Run**.
2. **Table Editor → admins** → insertar tu email.
3. **Storage → Create bucket**: `product-images` (Public). (Después del bucket, podés correr de nuevo el bloque STORAGE POLICIES).

## Vercel / .env
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BRAND_PRIMARY` (opcional, ej `#ff6b00`)
- `BRAND_SECONDARY` (opcional)
- `BRAND_NAME` (opcional)

## Admin
- /auth/sign-in → crear usuario con el **mismo email** de `admins`.
- /admin/categories → crear categorías.
- /admin/products → crear productos (podés subir imagen).
- /admin/orders → **Confirmar** descuenta; **Cancelar** devuelve stock; **Entregar** solo marca fulfilled.

## Notas
- Si ves error 42601 en CREATE POLICY, usá el SQL de este repo (sin tildes ni IF NOT EXISTS).


---
**Brand aplicado:** stock tca
Colores: PRIMARY #1E40AF, SECONDARY #38BDF8
Logo: /public/logo.png
