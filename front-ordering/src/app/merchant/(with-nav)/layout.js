'use client';
import { setupMerchantAxiosInterceptors } from '@/services/axiosSetup';
import { SidebarProvider } from '@/context/SideBarContext';
import { MerchantSocketProvider } from '@/context/MerchantSocketProvider';
import { MerchantOrderProvider } from '@/context/MerchantOrderContext';

export default function MerchantWithNavLayout({ children }) { 

  return (
      <SidebarProvider>
          <MerchantOrderProvider>
            <MerchantSocketProvider>
              {children}
            </MerchantSocketProvider>
          </MerchantOrderProvider>
      </SidebarProvider>
  );
}