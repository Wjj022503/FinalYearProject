'use client';

import { useEffect, useState } from 'react';
import { useSidebar } from '@/context/SideBarContext';
import { getOrderHistory } from '@/services/merchant';
import { toast } from 'react-hot-toast';

export default function MerchantOrderHistory() {
  const { merchant } = useSidebar();
  const [orders, setOrders] = useState([]);
  const { collapsed } = useSidebar();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getOrderHistory(merchant.merchantID);
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load order history');
        console.error('Error fetching order history:', error);
      }
    };

    if (merchant?.merchantID) fetchHistory();
  }, [merchant]);

  return (
    <div className={`p-6 ${collapsed ? '!pl-6 md:!pl-16' : '!pl-18 md:!pl-64'} transition-all duration-300`}>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No past orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[var(--accent)] text-black font-semibold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.user.UserName}</td>
                  <td className="p-4">RM {order.totalPrice.toFixed(2)}</td>
                  <td className={`p-4 ${order.status == 'Cancelled' ? 'text-red-500' : ''}`}>
                    {order.status}
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString('en-MY')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}