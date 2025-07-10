'use client';
import { useSidebar } from "@/context/SideBarContext";

export default function MerchantSettings() {
    const { collapsed } = useSidebar();

    //future enhancement
    return (
        <div className={`p-6 ${collapsed ? '!pl-6 md:!pl-16' : '!pl-18 md:!pl-64'} transition-all duration-300`}>
            <h1>Merchant Bills</h1>
            <p>Here you can manage your bills.</p>
            <p>Future enhancement: Add bill management features.</p>
            {/* Add your bill management components here */}
            <div className="mt-4 p-4 bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold">Bill History</h2>
                {/* Example bill item */}
                <div className="flex justify-between items-center border-b py-2">
                    <span>Bill #12345</span>
                    <span>$100.00</span>
                </div>
                {/* Add more bill items as needed */}
                <div className="flex justify-between items-center border-b py-2">
                    <span>Bill #12346</span>
                    <span>$150.00</span>
                </div>
            </div>
        </div>
    );
}