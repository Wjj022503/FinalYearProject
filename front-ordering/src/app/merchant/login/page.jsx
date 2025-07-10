'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { merchant_login } from '@/services/auth';

export default function MerchantLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {email,password};

    try {
      const status = await merchant_login(payload);
      if (status == 201){
        setTimeout(() => {
          toast.success('Logged In Successfully!');
        }, 1500);
        router.push('/merchant/menu');
      }
      else if (status == 403) {
        toast.error('Invalid email or password.');
      }
      else if (status == 503) {
        toast.error('Network error. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[var(--border)]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--foreground)]">
          Login to Merchant Account
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />

          <button type="submit" className="mt-4">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}