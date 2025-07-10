'use client';

import { toast } from 'react-hot-toast';
import { updateStatus } from '@/services/merchant';
import { useSidebar } from '@/context/SideBarContext';
import { use } from 'react';

export default function MerchantSettings() {
  const { collapsed, merchant, setMerchant } = useSidebar();

  const handleToggle = async () => {
    try {
        const newStatus = !merchant.status;
        // Call backend API to update the status
        const response = await updateStatus(merchant.merchantID, newStatus);
        if (response === 200) {
            toast.success(`Shop is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
        }
        else{
            toast.error('Failed to update shop status');
            return;
        }
        setMerchant(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            toast.error('Session expired. Please log in again.');
            window.location.href = '/merchant/login';
            return;
        }
        console.error('Update Status Error:', error.response);
        toast.error('Failed to update shop status. Please try again later.');
    }
  };

  return (
    <div className={`p-6 ${collapsed ? '!pl-6 md:!pl-16' : '!pl-18 md:!pl-64'} transition-all duration-300`}>
      <h1 className="text-2xl font-bold mb-6">Merchant Settings</h1>
      <div className="flex items-center justify-between bg-white p-4 shadow rounded-lg">
        <div>
          <p className="text-lg font-medium">Shop Status</p>
          <p className="text-sm text-gray-500">
            Toggle to open or close your store
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`!px-4 !py-2 rounded-md font-semibold transition ${
            merchant?.status ? '!bg-green-500' : '!bg-red-500'
          } !text-white disabled:opacity-50`}
        >
          {merchant?.status ? 'OPEN' : 'CLOSED'}
        </button>
      </div>
    </div>
  );
}