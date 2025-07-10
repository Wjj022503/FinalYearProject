'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getMe } from '@/services/auth'; // Adjust the path if needed

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('Please log in again.');
          setTimeout(() => {
            window.location.href = '/customer/login';
          }, 1000);
          return;
        }
        const customerData = await getMe(token);
        if (!customerData) {
          toast.error('Please log in again.');
          setTimeout(() => {
            window.location.href = '/customer/login';
          }, 1000);
        } else {
          setCustomer(customerData);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session Expired. Please log in again.');
          console.log('Session Expired. Log in again.');
          setTimeout(() => {
            window.location.href = '/customer/login';
          }, 1000);
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, loading }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}