'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMerchantMe } from '@/services/auth';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSidebar } from '@/context/SideBarContext';

const navItems = [
  { label: 'Menu', image:'/images/common/menu.png' , href: '/merchant/menu' },
  { label: 'Order List', image:'/images/common/order.png',href: '/merchant/orders' },
  { label: 'History', image:'/images/common/history.png', href: '/merchant/history' },
  { label: 'Bills', image:'/images/common/bill.png', href: '/merchant/bills' },
  { label: 'Setting', image:'/images/common/setting1.png', href: '/merchant/setting' },
];
export default function MerchantSidebar() {
  const pathname = usePathname();
  const [merchantName, setMerchantName] = useState("");
  const [defaultAvatar, setDefaultAvatar] = useState("");
  const { collapsed, setCollapsed, setMerchant } = useSidebar();

  useEffect(() => {
    async function fetchMerchantName() {
      try {
        const merchant = await getMerchantMe();
        setMerchant(merchant);
        setMerchantName(merchant.merchantName);
        setDefaultAvatar(merchant.merchantName.charAt(0).toUpperCase());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Session expired. Please log in again.');
          setTimeout(async () => {
            window.location.href = '/merchant/login';
          }, 1000); 
          return;
        }
        console.error('Error fetching merchant data:', error);
        toast.error('Failed to fetch merchant data. Please try again later.');
      }
    }
    fetchMerchantName();
  }, []);

  return (
    <>
      {/* Full Sidebar */}
      {!collapsed ? (
        <div className={`fixed top-0 left-0 h-screen bg-[var(--muted)] shadow-md p-4 flex flex-col 
          ${collapsed ? '!w-8 md:!w-16' : '!w-20 md:!w-64'} 
          transition-all duration-300`}>
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-[var(--foreground)] font-bold border-2 border-orange-400 shadow-md">
            {defaultAvatar}
          </div>
          <span className="hidden md:inline font-semibold text-center text-[var(--foreground)] text-sm md:text-base">
            {merchantName}
          </span>
        </div>
        {/* Nav Items */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, image, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium ${
                pathname === href
                  ? 'bg-[var(--accent)] text-[var(--foreground)]'
                  : 'hover:bg-[var(--border)] text-[var(--foreground)]'
              }`}
            >
              <div className="relative w-6 h-6 md:w-5 md:h-5">
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="hidden md:inline !text-black">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-[var(--accent)] text-[var(--foreground)] !p-4 !rounded-full hover:bg-orange-400 absolute !bottom-4 !right-4"
        >
          <Image
            src="/images/common/collapse.png"
            alt="Collapse"
            width={20}
            height={20}
          />
        </button>
      </div>
      ) : (
        /* Collapsed Round Button */
        <div className="fixed top-4 left-4 bg-[var(--accent)] text-[var(--foreground)] w-14 h-14 flex items-center justify-center rounded-full shadow-lg z-50 cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <Image
            src="/images/common/sidebar.png"
            alt="Side Bar"
            width={20}
            height={20}>
          </Image>
        </div>
      )}
    </>
  );
}