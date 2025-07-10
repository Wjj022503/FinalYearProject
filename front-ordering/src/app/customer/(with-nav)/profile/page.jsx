'use client';

import { useEffect, useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { changePassword } from '@/services/customer';

export default function EditProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { customer, loding } = useCustomer();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (loding) return;
    if (!customer) return;
    setUserEmail(customer.email);
  }, [customer]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    // call backend API here
    const res = await changePassword(customer.id, newPassword);
    if (res === 201) {
      toast.success('Password changed successfully!');
    }else{
      toast.error('Password change failed!');
    }

    setShowPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] !px-4 !py-6">
      <h1 className="text-xl lg:text-2xl font-semibold text-center text-gray-800 mb-6">
        Edit Profile
      </h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-6">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="!mt-1 w-full bg-gray-100 border border-gray-300 !rounded-md !px-3 !py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Password (masked) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value="********"
            readOnly
            className="!mt-1 w-full bg-gray-100 border border-gray-300 !rounded-md !px-3 !py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Change Password Button */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full bg-[var(--accent)] text-white !py-2 rounded-lg hover:opacity-90 transition"
        >
          Change Password
        </button>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
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
              className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl text-left"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Change Password
              </h3>

              <div className="space-y-4 mb-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Old Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="!text-[var(--foreground)] !px-4 !py-2 !border-none !rounded-md !text-sm !font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="!text-orange-600 !px-6 !py-2 !border-none !rounded-md !font-semibold"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}