'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAvailableFoods, getCart } from '@/services/customer';
import Image from 'next/image';
import { useCustomer } from '@/context/CustomerContext';
import { useCart } from '@/context/CartContext';
import { addToCartDb } from '@/services/customer';
import { toast } from 'react-hot-toast';

export default function MenuPage() {
  const { customer , loading } = useCustomer();
  const { id: merchantId } = useParams();
  const [foods, setFoods] = useState([]);
  const { getCartData } = useCart();
  
  useEffect(() => {
    async function fetchFoods() {
      try {
        const data = await getAvailableFoods(merchantId);
        setFoods(data);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      }
    }

    if (merchantId) {
      fetchFoods();
    }
  }, [merchantId]); 

  async function handleAddToCart(food) {
    if (loading) return;
    if (!customer) return;
    try {
      const status = await addToCartDb(customer.id, food);
      await getCartData(customer.id);
      if (status === 201) {
        toast.success(`${food.name} added to cart`,{
          duration: 800,
        });  
      }
      else if (status === 503) {
        toast.error('Network error. Please try again.');
        console.error('Network error.');
      }
    } catch (error) {
      console.error('Failed to add food to cart:', error);
    }
  }

  // Split foods by type
  const foodItems = foods.filter(food => food.type.toLowerCase() === 'food');
  const beverageItems = foods.filter(food => food.type.toLowerCase() === 'drink');

  const renderFoodList = (items) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((food) => (
        <div key={food.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
          <div className="w-24 h-24 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${food.image}`}
              alt={food.name}
              fill
              className="object-cover rounded-md"
              unoptimized
            />
          </div>

          <div className="flex-1 relative">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {food.name}
            </h3>
            <p className="text-sm text-gray-500">RM {food.price.toFixed(2)}</p>

            <button className="absolute bottom-0 right-1 bg-[var(--accent)] text-[var(--foreground)] flex items-center gap-2 !px-2 !py-2 rounded-md hover:bg-orange-400 transition"
              onClick={() => handleAddToCart(food)}>
              <Image
                src="/images/common/add.png"
                alt="Add to Cart"
                width={18}
                height={18}
                className="object-cover"
                unoptimized
              />
              <span className="md:hidden">Add</span>            
              <span className="hidden md:inline">Add to Cart</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if(loading){
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <h2 className="text-3xl font-extrabold text-center mb-4">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            🍽️ Menu
          </span>
        </h2>
        <div className="w-24 h-1 bg-orange-400 rounded-full mx-auto mb-8"></div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <h2 className="text-3xl font-extrabold text-center mb-4">
        <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          🍽️ Menu
        </span>
      </h2>
      <div className="w-24 h-1 bg-orange-400 rounded-full mx-auto mb-8"></div>

      {/* Food Section */}
      {foodItems.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
            🍴 Food
          </h3>
          {renderFoodList(foodItems)}
        </div>
      )}

      {/* Beverage Section */}
      {beverageItems.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
            ☕ Beverage
          </h3>
          {renderFoodList(beverageItems)}
        </div>
      )}
    </div>
  );
}