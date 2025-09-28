import Products from './products';
import { CartProvider } from '@/components/CartContext';
export default async function Page(){
  return (
    <CartProvider>
      <Products />
    </CartProvider>
  )
}
