import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCustomerOrder } from '@/context/CustomerOrderContext';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [ numberOfItems, setNumberOfItems ] = useState(0);
  const [ numberOfOrders, setNumberOfOrders ] = useState(0);
  const { itemCount } = useCart();
  const { orderNotCompleted } = useCustomerOrder();

  useEffect(() => {
    setNumberOfItems(itemCount);
    setNumberOfOrders(orderNotCompleted);
  }, [itemCount, orderNotCompleted]);

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-[var(--accent)] shadow-md sticky top-0 z-50">
      
      {/* User Icon */}
      <Link href="/customer/options" className="flex items-center justify-center">
        <div className="w-10 h-10 rounded-full !border-none bg-[var(--background)] flex items-center justify-center cursor-pointer">
            <span className="text-[var(--foreground)] font-bold">U</span>
            {numberOfOrders > 0 && (
              <span className="absolute top-2 left-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {numberOfOrders}
              </span>
            )}         
        </div>
      </Link>

      {/* App Title (Logo) */}
      <Link href="/customer/merchants" className="flex items-center justify-center">
        <div className="relative w-36 h-8"> {/* <- Control the logo size here */}
          <Image
            src="/images/common/apfood.png"
            alt="APFood Logo"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </Link>

      {/* Cart Icon */}
      <div className="w-10 h-10 rounded-md !border-none bg-[var(--background)] flex items-center justify-center cursor-pointer">
        <Link href="/customer/cart" className="relative w-10 h-10 rounded-md flex items-center justify-center">
          <Image src="/images/common/cart.png" alt="Cart" width={22} height={22} />
          {numberOfItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {numberOfItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}