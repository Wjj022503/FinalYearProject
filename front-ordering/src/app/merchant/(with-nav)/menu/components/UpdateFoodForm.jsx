'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function UpdateFoodForm({ onSubmit, onCancel, refreshFoods, food, merchantID }) {
  const [form, setForm] = useState({
    name: food.name,
    price: food.price,
    type: food.type,
    merchantID: food.merchantID,
  });
  const [file, setFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    const formData = new FormData();
    try {
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('type', form.type);
      formData.append('merchantID', merchantID);
      formData.append('image', file);
      await onSubmit(formData);
      refreshFoods();
      setForm({ image: null, name: '', price: '', type: '' });
      onCancel();
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal Form */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        >
          <h3 className="text-xl font-bold mb-4 text-[var(--foreground)]">Update </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="w-full">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer w-full border border-[var(--border)] rounded-md p-2 text-center hover:bg-[var(--accent)] hover:text-white transition"
                >
                  {file ? file.name : food.image.split('/').pop()}
                </label>

                <input
                  id="imageUpload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <input type="number" name="price" placeholder="Price" required value={form.price} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <select 
              name="type" 
              required
              value={form.type} 
              onChange={handleChange}
              className="w-full border border-[var(--border)] rounded-md p-2"
            >
              <option value="">Select Type</option>
              <option value="Food">Food</option>
              <option value="Drink">Beverage</option>
            </select>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md text-sm">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
                {isSubmitting ? 'Update...' : 'Update'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
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
                Are you sure you want to update this item in your menu?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded-md text-sm">
                  Cancel
                </button>
                <button onClick={confirmSubmit} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}