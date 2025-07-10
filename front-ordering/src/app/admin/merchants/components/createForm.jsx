'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CreateForm({ onSubmit, onCancel, refreshMerchants }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    merchantName: '',
    ownerName: '',
    phone: '',
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
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('merchantName', form.merchantName);
      formData.append('ownerName', form.ownerName);
      formData.append('phone', form.phone);
      if (file) formData.append('image', file); // append image if present

      await onSubmit(formData);
      refreshMerchants();
      setForm({
        email: '',
        password: '',
        merchantName: '',
        ownerName: '',
        phone: '',
      });
      setFile(null);
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
          <h3 className="text-xl font-bold mb-4 text-[var(--foreground)]">Create New Merchant</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer w-full border border-[var(--border)] rounded-md p-2 text-center hover:bg-[var(--accent)] hover:text-white transition"
              >
                {file ? file.name : 'Choose Profile Image'}
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

            <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <input type="password" name="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <input type="text" name="merchantName" placeholder="Merchant Name" required value={form.merchantName} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <input type="text" name="ownerName" placeholder="Owner Name" required value={form.ownerName} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />
            <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border border-[var(--border)] rounded-md p-2" />

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md text-sm">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
                {isSubmitting ? 'Creating...' : 'Create'}
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
                Are you sure you want to create this merchant?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded-md text-sm">
                  Cancel
                </button>
                <button onClick={confirmSubmit} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
                  Yes, Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}