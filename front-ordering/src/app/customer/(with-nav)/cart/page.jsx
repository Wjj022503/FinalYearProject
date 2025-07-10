'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useCustomer } from '@/context/CustomerContext';
import { updateCart, removeFromCart, removeAllFromCart } from '@/services/customer';
import { useSocket } from '@/context/CustomerSocketProvider';
import { useCustomerOrder } from '@/context/CustomerOrderContext';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { customer, loading } = useCustomer();
  const { cartItems, setCartItems, getCartData, setItemCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { socket, ready } = useSocket();
  const { setOrderNotCompleted, setOrders } = useCustomerOrder();

  useEffect(() => {
    if (loading) return;
    if (!customer) return;
    if (!ready) return;
    getCartData(customer.id, cartItems);

  }, [customer]);

  // Calculate total amount
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.priceAtTime * item.quantity, 0);
  }, [cartItems]);

  // Handle Increase
  const handleIncrease = async (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.foodId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setItemCount(prev => prev + 1); // Update item count in cart
    try {
      const item = cartItems.find(item => item.foodId === id);
      if (item) {
        await updateCart(item.id, item.cartId, item.quantity + 1);
      }
    } catch (error) {
      console.error('Error updating cart quantity (increase):', error);
    }
  };

  // Handle Decrease
  const handleDecrease = async (id) => {
    const item = cartItems.find(item => item.foodId === id);

    if (!item) return; // item not found
    if (item.quantity <= 1) return; // prevent decreasing below 1
    setItemCount(prev => prev - 1); // Update item count in cart
    setCartItems(prev =>
      prev.map(item =>
        item.foodId === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );

    try {
      await updateCart(item.id, item.cartId, item.quantity - 1);
    } catch (error) {
      console.error('Error updating cart quantity (decrease):', error);
    }
  };

  // Handle Remove Item
  const handleRemove = async (id) => {
    const item = cartItems.find(item => item.foodId === id);
    if (!item) return; // item not found

    setCartItems(prev => prev.filter(item => item.foodId !== id));
    setItemCount(prev => prev - item.quantity); // Update item count in cart

    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error updating cart quantity (decrease):', error);
    }    
  };

  // Handle Remove All
  const handleRemoveAll = async () => {
    const item = cartItems[0];
    if (!item) return; // item not found
    setCartItems([]);
    setItemCount(0); // Update item count in cart
    try{
      await removeAllFromCart(item.id);
    }catch (error) {
      console.error('Error removing all items from cart:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      let item = cartItems[0];
      if (!item) return; // item not found
      const cartId = item.cartId;
  
      // Emit the 'placeOrder' event
      if (socket && socket.connected) {
        socket.emit('placeOrder', {
          userId: customer.id,
          paymentMethod: 'cash', // or dynamically let user choose
          items: cartItems.map(ci => ({
            foodId: ci.foodId,
            quantity: ci.quantity,
            cartId: ci.cartId
          })),
        });

        // Optional: wait for ACK from the server
        socket.once('orderAccepted', (newOrders) => {
          if (!Array.isArray(newOrders)) return;
          // 1. Clear cart visually and logically
          setCartItems([]);
          setItemCount(0);
          // 2. Delete all cart items (assuming they share one cartId)
          const cartId = cartItems[0]?.cartId;
          if (cartId) removeAllFromCart(cartId);
          // 3. Add all orders to the local state
          setOrders(prevOrders => [...newOrders, ...prevOrders]);
          // 4. Update UI (e.g., order status badge)
          setOrderNotCompleted(prev => prev + newOrders.length);
          // 5. Toast all merchants involved
          newOrders.forEach(order => {
            toast.success(`Order placed to ${order.merchant?.merchantName || 'a merchant'}`);
          });
        });
        
      } else {
        toast.error('Real-time connection lost, please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };
 
  
  if (loading) {
    return (
      <div>Loading customer data...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] p-4">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Your Cart</h2>
        <button
          onClick={handleRemoveAll}
          className="text-sm !bg-red-400 !text-white !px-3 !py-1 rounded-md hover:bg-red-600 transition"
        >
          Remove All
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 flex flex-col gap-4 mb-32">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.foodId} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 relative">
              
              {/* Image */}
              <div className="w-20 h-20 relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 pr-8">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  RM {item.priceAtTime.toFixed(2)} x {item.quantity} = <span className="font-bold text-[var(--foreground)]">RM {(item.priceAtTime * item.quantity).toFixed(2)}</span>
                </p>

                {/* Quantity Control */}
                <div className="flex items-center gap-2 !mt-2">
                  <button
                    onClick={() => handleDecrease(item.foodId)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 !rounded-full !border-none hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="!px-2">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.foodId)}
                    className="w-6 h-6 flex items-center justify-center bg-gray-200 !rounded-full !border-none hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove (X) */}
              <button
                onClick={() => handleRemove(item.foodId)}
                className="absolute top-2 right-2 !px-2 !py-1 !md:px-3 !md:py-2 !text-red-500 !border-orange-400 font-bold"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        )}
      </div>

      {/* Total  Checkout */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center">
          
          {/* Total Price */}
          <div className="mb-2 text-lg font-bold text-[var(--foreground)]">
            Total: RM {totalPrice.toFixed(2)}
          </div>

          {/* Checkout Button */}
          <button className="bg-[var(--accent)] text-[var(--foreground)] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-400 transition"
            onClick={() => setShowSummaryModal(true)}>
            Checkout
          </button>
        </div>
      )}

      {/* Order Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-center"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Order Summary
              </h3>

              {/* List of Items */}
              <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.foodId} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>RM {(item.priceAtTime * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Payment Method Select */}
              <div className="mb-4 text-left">
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  {/* Add more methods if needed */}
                </select>
              </div>              

              {/* Total */}
              <div className="font-bold text-lg mb-6">
                Total: RM {totalPrice.toFixed(2)}
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="!text-[var(--foreground)] !px-4 !py-2 !border-none !rounded-md !text-sm !font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handlePlaceOrder(); setShowSummaryModal(false); }}
                  className="!text-orange-600 !px-6 !py-2 !border-none !rounded-md !font-semibold"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}