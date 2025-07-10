'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSidebar } from '@/context/SideBarContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useSocket } from '@/context/MerchantSocketProvider';
import { useMerchantOrder } from '@/context/MerchantOrderContext';

export default function MerchantOrdersPage() {
  const [search, setSearch] = useState('');
  const [showConfirmReady, setShowConfirmReady] = useState(false);
  const [orderToMarkReady, setOrderToMarkReady] = useState(null);
  const { collapsed } = useSidebar();
  const { socket, ready } = useSocket();
  const { orders, setOrders } = useMerchantOrder();

  useEffect(() => {
    if (!ready) return;
    const handler = (o) => setOrders((prev) => [o, ...prev]);
    socket.on('newOrder', handler);
    return () => socket.off('newOrder', handler);
  }, [ready, socket]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      console.log('Updating order status for order ID:', orderId, 'to:', status);
      socket.emit('updateOrderStatus', { orderId: orderId, data: { status: status } });
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('Unexpected error updating order.');
    }  
  };

  const filteredOrders = orders
  .filter(order => order.status !== 'Completed' && order.status !== 'Cancelled')
  .filter(order =>
    order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`p-6 ${collapsed ? '!pl-6 md:!pl-16' : '!pl-18 md:!pl-64'} transition-all duration-300`}>
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search customer or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-[var(--border)] p-2 rounded-md"
        />
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-4 shadow rounded-xl border border-[var(--border)] flex flex-col justify-between">
            <div>
              <p className="font-semibold mb-2">Order #{order.id}</p>
              <p className="text-sm text-gray-500">Customer: {order.user?.UserName || 'Unknown'}</p>
              <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold">{order.status}</span></p>
              <p className="text-sm text-gray-500 mt-1">Total: RM {order.totalPrice.toFixed(2)}</p>
              <div className="mt-2">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {order.orderItems?.map(item => (
                    <li key={item.id}>
                      {item.food?.name || 'Unknown'} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {order.status === 'Pending' && (
                <button
                    onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                    className="!mt-4 !p-2 text-white !border-none !rounded-md font-semibold"
                >
                    Accept Order
                </button>
                )}

                {order.status === 'Preparing' && (
                <button
                    onClick={() => {setShowConfirmReady(true); setOrderToMarkReady(order)}}
                    className="!mt-4 !p-2 !bg-green-400 !hover:bg-blue-500 text-white !border-none !rounded-md font-semibold"
                >
                    Mark as Done
                </button>
                )}

                {order.status === 'Wait for Pickup' && (
                <button
                    onClick={() => handleUpdateStatus(order.id, 'Completed')}
                    className="!mt-4 !p-2 !bg-green-500 !hover:bg-green-500 !border-none !rounded-md font-semibold"
                >
                    Complete Order
                </button>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Ready Modal */}
      <AnimatePresence>
        {showConfirmReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-center"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Mark this order as Ready?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirmReady(false)} className="!px-4 !py-2 !border-none rounded-md text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={() => { handleUpdateStatus(orderToMarkReady.id,'Wait for Pickup'); setShowConfirmReady(false); }} className="!bg-green-500 !text-black !border-none !px-4 !py-2 rounded-md font-semibold">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}