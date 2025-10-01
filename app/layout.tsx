import './globals.css';
import Providers from './providers'; // 👈 importar

const BRAND_NAME = process.env.BRAND_NAME || 'stock tca';

export const metadata = { title: BRAND_NAME, description: 'Catálogo con pedidos y admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="brandbar">
          <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <a href="/" className="logo">
              <img src="/logo.png" alt="logo"/>
              <strong>{BRAND_NAME}</strong>
            </a>
            <nav style={{display:'flex', gap:12}}>
              <a href="/cart">Carrito</a>
              <a href="/auth/sign-in">Ingresar</a>
              <a href="/admin">Admin</a>
            </nav>
          </div>
        </div>

        {/* 👇 envolver TODAS las páginas con el provider */}
        <div className="container" style={{paddingTop:16}}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
