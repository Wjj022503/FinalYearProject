'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useMerchantOrder } from './MerchantOrderContext';

const SocketCtx = createContext(null);

export function MerchantSocketProvider({ children }) {
  const socketRef = useRef(null);
  const [ready, setReady] = useState(false);
  const {orders, setOrders} = useMerchantOrder();

  //Connect once when the provider first mounts
  useEffect(() => {
    if (!socketRef.current) {
      const token = localStorage.getItem('merchant_access_token');
      socketRef.current = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`, {
        transports: ['websocket'],
        auth: {
          token,
        },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('[WebSocket] Connected:', socketRef.current.id);
        setReady(true);
      });

      socketRef.current.on('disconnect', () => {
        console.warn('[WebSocket] Disconnected');
        setReady(false);
      });

      /* === Global listeners that should work on *every* page === */
      socketRef.current.on('newOrder', (order) => {
        toast.success(`New order #${order.id} received!`,{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        });
      });

      socketRef.current.on('orderStatusUpdated', (order) => {
          toast.success(`Order #${order.id} status updated to ${order.status}`,{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          });
          //update order status in the list
          setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
        }
      );
    }
    return () => {
      //DO NOT disconnect on unmount — keep alive globally
    };
  }, []);

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current, ready }}>
      {children}
    </SocketCtx.Provider>
  );
}

export const useSocket = () => useContext(SocketCtx);