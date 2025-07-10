'use client';
import CustomerLayoutWrapper from '@/app/customer/components/CustomerLayoutWrapper';
import { CustomerProvider } from '@/context/CustomerContext';
import { CartProvider } from '@/context/CartContext';
import { CustomerSocketProvider } from '@/context/CustomerSocketProvider';
import { CustomerOrderProvider } from '@/context/CustomerOrderContext';

export default function WithNavLayout({ children }) {

  return <CustomerProvider>
            <CartProvider>
              <CustomerOrderProvider>
                <CustomerLayoutWrapper>
                  <CustomerSocketProvider>
                    {children}
                  </CustomerSocketProvider>
                </CustomerLayoutWrapper>
              </CustomerOrderProvider>
            </CartProvider>
          </CustomerProvider>;
}