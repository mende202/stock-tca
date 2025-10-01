import './globals.css';
import Providers from './providers';

const BRAND_NAME = process.env.BRAND_NAME || 'stock tca';

export const metadata = { title: BRAND_NAME, description: 'Catálogo con pedidos y admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* ...tu header/nav... */}
        <div className="container" style={{ paddingTop: 16 }}>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
