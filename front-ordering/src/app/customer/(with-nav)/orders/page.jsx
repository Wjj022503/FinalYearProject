'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCustomerOrder } from '@/context/CustomerOrderContext';

export default function CustomerOrdersPage() {
  const [ visibleCount, setVisibleCount ] = useState(5);
  const [ orderData, setOrderData ] = useState([]);
  const { orders, orderLoading } = useCustomerOrder();

  useEffect(() => {
    if (Array.isArray(orders)) {
      setOrderData(orders);
    } else {
      setOrderData([]);
    }
  }, [orders]);

  const showMoreOrders = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (orderLoading) {
    return <p className="text-center !text-gray-600">Loading orders...</p>;
  }

  const animatedStatuses = ['Pending', 'Preparing', 'Wait for Pickup'];

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6">
      <h1 className="text-xl lg:text-2xl font-semibold text-center text-gray-800 mb-6">
        My Orders
      </h1>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {Array.isArray(orderData) && orderData.length > 0 ? (
          orderData.slice(0, visibleCount).map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow border border-gray-200">
              {/* Order Card */}
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Order #{order.id}</p>
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-800 mb-1">Items:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {order.orderItems.map((item, index) => (
                    <li key={index}>
                      {item.foodName || item.food.name || 'Unknown'} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm font-semibold text-gray-800">Status:</span>
                {animatedStatuses.includes(order.status) ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/images/common/${order.status}.gif`}
                      alt="Status Icon"
                      width={32}
                      height={32}
                    />
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-sm font-bold text-orange-400"
                    >
                      {order.status}
                    </motion.span>                    
                  </div>
                ) : (
                  <span className="text-sm font-bold text-green-600">{order.status}</span>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-semibold text-gray-800">Total:</span>
                <span className="text-sm font-bold text-green-600">
                  RM {order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>

        {Array.isArray(orderData) && visibleCount < orderData.length && (
            <div className="flex justify-center mt-6">
                <button
                onClick={showMoreOrders}
                className="bg-[var(--accent)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                >
                Show More
                </button>
            </div>
        )}
    </div>
  );
}