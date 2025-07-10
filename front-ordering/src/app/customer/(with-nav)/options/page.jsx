'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCustomerOrder } from '@/context/CustomerOrderContext';
import { useEffect, useState } from 'react';

export default function UserOptionsPage() {
  const [ numberOfOrders, setNumberOfOrders ] = useState(0);
  const { orderNotCompleted } = useCustomerOrder();

  useEffect(() => {
    setNumberOfOrders(orderNotCompleted);
  }, [orderNotCompleted]);

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6">
      <h1 className="text-xl lg:text-2xl font-semibold text-center text-gray-800 mb-6">
        User Options
      </h1>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-2">
        {/* Option 1 - Personal Details */}
        <Link href="/customer/profile">
          <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-100 transition">
            <Image
              src="/images/common/profile.png"
              alt="User Icon"
              width={36}
              height={36}
              className="flex-shrink-0 mt-1"
            />
            <div>
              <p className="text-base lg:text-lg font-medium text-gray-800">
                Personal Details
              </p>
              <p className="text-sm text-gray-500">
                Edit your profile info and password
              </p>
            </div>
          </div>
        </Link>

        {/* Option 2 - Orders */}
        <Link href="/customer/orders">
          <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-100 transition relative">
            <div className="relative">
              <Image
                src="/images/common/order-detail.png"
                alt="Order Icon"
                width={36}
                height={36}
                className="flex-shrink-0 mt-1"
              />
              {numberOfOrders > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                  {numberOfOrders}
                </div>
              )}
            </div>
            <div>
              <p className="text-base lg:text-lg font-medium text-gray-800">
                Orders
              </p>
              <p className="text-sm text-gray-500">
                View your order status
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}