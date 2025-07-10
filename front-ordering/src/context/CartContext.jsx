import { createContext, useContext, useEffect, useState } from 'react';
import { useCustomer } from './CustomerContext';
import { toast } from 'react-hot-toast';
import { getCartItems } from '@/services/customer';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { customer } = useCustomer();
  const [cartItems, setCartItems] = useState([]);
  const [ itemCount, setItemCount ] = useState(0);

  useEffect(() => {
    if (!customer) return;
    getCartData();
  }, [customer]);

  const getCartData = async () => {
    try {
      const data = await getCartItems(customer.id);
      //calculate item in cart
      const itemInCart = data.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(itemInCart);
      // Loop through each item from backend
      setCartItems(data.map(item => ({
        id: item.id,
        cartId: item.cartId,
        foodId: item.foodId,
        name: item.foodName,
        image: item.image || '', // Optional, in case backend didn't send image
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
      })));
    } catch (error) {
      if (error.response === 401) {
        toast.error('Session expired. Please log in again.');
        console.log('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/customer/login';
        }, 1000);
      }
      else if (error.response) {
        console.error('Error fetching cart items:', error.response);
      }
      console.error('Error getting cart data:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, getCartData, itemCount, setItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}