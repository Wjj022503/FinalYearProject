'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getAllOrders } from '@/services/merchant';
import { useSidebar } from '@/context/SideBarContext';

const MerchantOrderContext = createContext(null);

export function MerchantOrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { merchant } = useSidebar();

  useEffect(() => {
    async function fetchOrders() {
      try {
        if(!merchant) return;
        const token = localStorage.getItem('merchant_access_token');
        if (!token) {
          toast.error('Please log in again.');
          setTimeout(() => {
            window.location.href = '/merchant/login';
          }, 1000);
          return;
        }
        const ordersData = await getAllOrders(merchant.merchantID);
        setOrders(ordersData.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session Expired. Please log in again.');
          console.log('Session Expired. Log in again.');
          setTimeout(() => {
            window.location.href = '/merchant/login';
          }, 1000);
        }
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [merchant]);

  return (
    <MerchantOrderContext.Provider value={{ orders, setOrders, loading}}>
      {children}
    </MerchantOrderContext.Provider>
  );
}

export function useMerchantOrder() {
  return useContext(MerchantOrderContext);
}