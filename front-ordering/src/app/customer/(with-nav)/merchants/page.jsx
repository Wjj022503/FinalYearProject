'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { getAvailableMerchants } from '@/services/customer';
import { useCustomer } from '@/context/CustomerContext';

export default function MerchantPage() {
  const [merchants, setMerchants] = useState([]);
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
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.image.startsWith('/') ? '' : '/'}${merchant.image}`}
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
    </div>
  );
}