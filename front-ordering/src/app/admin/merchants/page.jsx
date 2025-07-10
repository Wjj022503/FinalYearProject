'use client';

import { useState, useEffect } from 'react';
import CreateForm from './components/createForm';
import UpdateForm from './components/updateForm';
import { addMerchant, getMerchants, deleteMerchant, updateMerchant } from '@/services/admin';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { getAdminMe } from '@/services/auth';

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);
  const [idToDelete, setIdToDelete] = useState(-1);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    getAdmin();
    fetchMerchants();
  }, []);

  async function fetchMerchants() {
    try {
      const data = await getMerchants();
      if (!data || data.length === 0) {
        console.log('No merchants found');
        return;
      }
      console.log('Fetched merchants:', data);
      setMerchants(data);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  }
  
  async function getAdmin(){
    try {
      const data = await getAdminMe();
      if (data.status === 401 || data.status === 403 || data.status === 400) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
      }
      console.error('Error fetching admin:', error);
    }
  }

  const handleSubmit = async (form) => {
    try {
      const status = await addMerchant(form);
      if (status == 201) {
        toast.success('Create merchant successful',{
          duration: 1500,
        });
      }
      else{
        toast.error('Create merchant failed. Server Error: ' + status);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
        return;
      } else if (error.response && error.response.status === 413) {
        toast.error('Image size too large. Please upload a smaller image.');
        return;
      }
      console.error('Unexpected error in handleSubmit:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const handleDelete = async (id) => {  
    try {
      const status = await deleteMerchant(id); // implement in services/admin
      if (status === 200) {
        toast.success('Merchant Deleted!');
        fetchMerchants(); // refresh list
      } else {
        toast.error('Delete failed. Server Error: ' + res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error during delete');
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      // Assume you have this API function:
      const status = await updateMerchant(id, form); // implement in services/admin
      if (status === 200) {
        toast.success('Merchant Updated!');
        fetchMerchants(); // refresh list
      }
      else {
        toast.error('Update failed. Server Error: ' + res.status);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/admin/login';
        return;
      }
      else if (err.response && err.response.status === 413) {
        toast.error('Image size too large. Please upload a smaller image.');
        return;
      }
      console.error(err);
      toast.error('Unexpected error during delete');
    }
  };
 
  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 gap-2 sm:gap-5 flex-nowrap">
        <h2 className="text-base sm:text-xl font-bold text-[var(--foreground)] whitespace-nowrap">
          Merchants
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-[var(--foreground)] !text-black rounded-md hover:bg-orange-400 transition !font-semibold text-xs sm:text-sm px-2.5 py-1.5 sm:px-4 sm:py-2 shadow"
        >
          <span className="whitespace-nowrap">Create</span>
          <Image src="/images/common/add.png" alt="Add" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Merchant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {merchants.map((merchant) => (
          <div
            key={merchant.id}
            className="rounded-xl p-4 shadow border border-[var(--accent)] bg-cover bg-center relative !text-white"
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${merchant.image})`,
              minHeight: '200px',
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 !text-white">{merchant.merchantName}</h3>
              <p className="text-sm">Owner: {merchant.ownerName}</p>
              <p className="text-sm">Email: {merchant.email}</p>
              <p className="text-sm">Phone: {merchant.phone}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingMerchant(merchant);
                    setShowUpdateModal(true);
                  }}
                  className='!bg-white !border-[var(--accent)] p-1 rounded'
                >
                  <Image src="/images/common/edit.png" alt="Edit" width={20} height={20} />
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDelete(true);
                    setIdToDelete(merchant.id);
                  }}
                  className='!bg-white !border-[var(--accent)] p-1 rounded'
                >
                  <Image src="/images/common/delete.png" alt="Delete" width={20} height={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <CreateForm
          onSubmit={handleSubmit}
          onCancel={() => setShowAddModal(false)}
          refreshMerchants={fetchMerchants}
        />)
      }

      {showUpdateModal && (
        <UpdateForm
          merchant={editingMerchant}
          onSubmit={handleUpdate}
          onCancel={() => setShowUpdateModal(false)}
          refreshMerchants={fetchMerchants}
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
                Are you sure you want to delete this merchant?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 border rounded-md text-sm">
                  Cancel
                </button>
                <button onClick={() => {handleDelete(idToDelete); setShowConfirmDelete(false);}} className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-md font-semibold">
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