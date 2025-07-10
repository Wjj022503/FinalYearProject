'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { getAvailableMerchants } from '@/services/customer';
import { useCustomer } from '@/context/CustomerContext';

export default function MerchantPage() {
  const [merchants, setMerchants] = useState([]);
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {customer , loading} = useCustomer();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for customer data to load
    if (!customer) return; // Wait for customer data to load
    async function fetchMerchants() {
      try {
        const data = await getAvailableMerchants();
        setMerchants(data);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
        toast.error('Failed to fetch merchants. Please try again later.');
      }
    }
    fetchMerchants();
  }, [customer, loading]);

  const filteredMerchants = merchants.filter((merchant) =>
    merchant.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestSubmit = () => {
    // Handle the request submission logic here
    toast.success('Request sent to AI Waiter!');
    setShowWaiterModal(false);
  };  

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
            type="text"
            placeholder="Search Restaurants..."
            color='#3a1f0f'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-[var(--border)] bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:font-bold"
        />
        </div>

      <h2 className="text-3xl font-extrabold text-center mb-6">
        <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          🍽️ Restaurant
        </span>
      </h2>
      <div className="w-24 h-1 bg-orange-400 rounded-full mx-auto mb-8"></div>        

      {/* Merchant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMerchants.map((merchant) => (
          <div
            key={merchant.id}
            className="relative rounded-xl overflow-hidden h-80 shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push(`/customer/merchants/${merchant.id}/menu`)}
          >
            {/* Image background */}
            <div className="absolute inset-0 z-0">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${merchant.image.startsWith('/') ? '' : '/'}${merchant.image}`}
                alt={merchant.merchantName}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Overlay for dark tint */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            {/* Text over image */}
            <div className="relative z-20 flex items-center justify-center h-full">
              <h3 className="text-center text-3xl font-semibold">
                <span className="text-[#f5f0eb]">{merchant.merchantName}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowWaiterModal(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white !text-xl !rounded-full !w-16 !h-16 shadow-lg flex items-center justify-center z-50"
      >
        🤖
      </button>
      {showWaiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setShowWaiterModal(false)}
              className="absolute top-2 right-2 !text-gray-500 !hover:text-gray-700 !text-2xl !border-none !bg-transparent"
            >
              x
            </button>
            <h2 className="text-lg font-bold mb-4">Chat with AI Waiter</h2>
            <div className="border rounded-md h-48 p-2 overflow-y-auto mb-4">
              {/* Chat content goes here */}
              <p className="text-gray-600">Hi! What kind of food are you craving?</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your request..."
                className="flex-1 border rounded-md p-2"
              />
              <button
                onClick={handleRequestSubmit}
                className="bg-[var(--accent)] !hover:bg-orange-600 !text-black !rounded-md !px-4"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}