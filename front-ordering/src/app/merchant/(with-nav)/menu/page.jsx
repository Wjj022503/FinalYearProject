'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CreateFoodForm from './components/CreateFoodForm';
import UpdateFoodForm from './components/UpdateFoodForm';
import { addFood, getAllFoods, deleteFood, updateFood } from '@/services/merchant';
import { toast } from 'react-hot-toast';
import { useSidebar } from '@/context/SideBarContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function MerchantMenuPage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const { collapsed, merchant } = useSidebar();

  useEffect(() => {
    console.log("Menu Page---------------Merchant:", merchant);
    if (merchant?.merchantID) {
      fetchFoods();
    }
  }, [merchant]);

  const fetchFoods = async () => {
    try {
      const data = await getAllFoods(merchant.merchantID);
      setFoods(data);
    } catch (err) {
      console.error('Error loading menu:', err);
    }
  };

  const  handleAddFood = async (formData) => {
    try {
      const res = await addFood(formData);
      if (res === 201) {
        toast.success('Successfully Added Item');
        fetchFoods();
      } 
      else if (res === 413) {
        toast.error('Image too large');
        fetchFoods();
      }       
      else {
        toast.error('Item Add Failed');
      }
    } catch (err) {
      console.error("-----------------Add Error--------------",err);
      toast.error('Unexpected error when adding food');
    }
  };

  const  handleUpdateFood = async (formData) => {
    try {
      const res = await updateFood(editingFood.id, formData);
      if (res === 200) {
        toast.success('Successfully Updated Item');
        fetchFoods();
      }
      else if (res === 413) {
        toast.error('Image too large');
        fetchFoods();
      } 
      else {
        toast.error('Item Update Failed');
      }
    } catch (err) {
      console.error("-----------------Update Error--------------",err);
      toast.error('Unexpected error when updating food');
    }
  };  

  const handleDelete = async (id) => {
    try {
      const res = await deleteFood(id);
      if (res === 200) {
        toast.success('Item deleted');
        fetchFoods();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`p-6 ${collapsed ? '!pl-6 md:!pl-16' : '!pl-18 md:!pl-64'} transition-all duration-300`}>
      {/* Search & Add Bar */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-[var(--border)] p-2 rounded-md"
        />
        <button
          onClick={() => {
            setShowAddModal(true);
          }}
          className="ml-4 p-3 bg-[var(--accent)] text-[var(--foreground)] rounded-md shadow hover:bg-orange-400"
        >
          <Image src="/images/common/add.png" width={20} height={20} alt="Add" />
        </button>
      </div>

      {/* Food Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredFoods.map(food => (
          <div key={food.id} className="bg-white p-4 shadow rounded-xl border border-[var(--border)] text-center">
            <div className="w-full h-40 relative mb-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${food.image}`}
                alt={food.name}
                fill
                className="object-cover rounded-md"
                unoptimized
              />
            </div>
            <p className="font-semibold">{food.name}</p>
            <p className="text-sm text-gray-500 mt-1">RM {food.price.toFixed(2)}</p>
            <div className="flex justify-end gap-3 mt-2 mr-3">
              <button
                onClick={() => {
                  setEditingFood(food);
                  setShowUpdateModal(true);
                }}
                className="!p-2 !md:p-4 rounded !bg-white"
              >
                <Image src="/images/common/edit.png" width={20} height={20} alt="Edit" />
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(true);
                  setFoodToDelete(food.id);
                }}
                className="!p-2 !md:p-4 rounded !bg-red-200"
              >
                <Image src="/images/common/delete.png" width={20} height={20} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <CreateFoodForm
          onSubmit={handleAddFood}
          onCancel={() => {
            setShowAddModal(false);
          }}
          refreshFoods={fetchFoods}
          merchantID={merchant.merchantID}
        />
      )}

      {showUpdateModal && (
        <UpdateFoodForm
          onSubmit={handleUpdateFood}
          onCancel={() => {
            setShowUpdateModal(false);
          }}
          refreshFoods={fetchFoods}
          food={editingFood}
          merchantID={merchant.merchantID}
        />
      )}      

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
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
                Are you sure you want to delete this item?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 border rounded-md text-sm">
                  Cancel
                </button>
                <button onClick={() => {handleDelete(foodToDelete); setShowConfirmDelete(false);}} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>   
    </div>    
  );
}