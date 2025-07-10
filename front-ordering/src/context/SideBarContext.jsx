'use client';
import { createContext, useState, useContext, useEffect } from 'react';
import MerchantSidebar from '@/app/merchant/components/MerchantSidebar';
import { getMerchantMe } from '@/services/auth';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await getMerchantMe();
        setMerchant(data);
      } catch (error) {
        console.error('Error fetching merchant:', error);
      }
    };

    fetchMerchant();
  }, []);
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, merchant, setMerchant }}>
      <div className="flex min-h-screen">
        <MerchantSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}