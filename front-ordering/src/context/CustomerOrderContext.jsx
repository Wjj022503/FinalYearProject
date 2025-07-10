'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getCustomerOrders } from '@/services/customer';
import { useCustomer } from './CustomerContext';

const CustomerOrderContext = createContext({
    orders: [],
    setOrders: () => {},
    orderLoading: true,
  });

export function CustomerOrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [ orderLoading, setOrderLoading ] = useState(true);
  const { customer } = useCustomer();
  const [ orderNotCompleted, setOrderNotCompleted ] = useState(0);

  useEffect(() => {
    if (!customer) return;
    fetchOrders();
  }, [customer]);

  async function fetchOrders() {
    try {
      if(!customer) return;
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in again.');
        setTimeout(() => {
          window.location.href = '/customer/login';
        }, 1000);
        return;
      }
      const ordersData = await getCustomerOrders(customer.id);
      //calculate not completed orders
      const notCompletedOrders = ordersData.filter((order) => order.status !== 'Completed' && order.status !== 'Cancelled');
      setOrderNotCompleted(notCompletedOrders.length);
      //set orders
      setOrders(ordersData);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session Expired. Please log in again.');
        console.log('Session Expired. Log in again.');
        setTimeout(() => {
          window.location.href = '/customer/login';
        }, 1000);
      }
      console.log(error);
    }
    finally {
      setOrderLoading(false);
    }
  }  

  return (
    <CustomerOrderContext.Provider value={{ orders, setOrders, orderLoading, orderNotCompleted, setOrderNotCompleted }}>
      {children}
    </CustomerOrderContext.Provider>
  );
}

export function useCustomerOrder() {
  return useContext(CustomerOrderContext);
}