'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useCustomerOrder } from './CustomerOrderContext';

const SocketCtx = createContext(null);

export function CustomerSocketProvider({ children }) {
  const socketRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { orders, setOrders } = useCustomerOrder();

  //Connect once when the provider first mounts
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;                       // unauthenticated area

    if (!socketRef.current) {
      const token = localStorage.getItem('access_token');
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
      socketRef.current.on('orderStatusUpdated', (order) => {
        setOrders(prevOrders => {
          return prevOrders.map(o => 
            o.id === order.id ? { ...o, status: order.status } : o
          );
        });
      });
      
      socketRef.current.on('orderReady', (order) => {
          console.log('Your order is ready to pick up----------------------', order);
          toast.success(`Order #${order.id} is ready to pick up!`,{
            duration: 5000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          });
          //update order status in the list
          setOrders(prevOrders => {
            return prevOrders.map(o => 
              o.id === order.id ? { ...o, status: order.status } : o
            );
          });         
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