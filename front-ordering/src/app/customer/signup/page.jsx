'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signup } from '@/services/auth';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password, name };
      const status = await signup(userData);
      if (status == 201) {
        toast.success('Signup successful');
        setTimeout(() => {
          router.push('/customer/login');
        }, 1000);
      } else if (status == 403) {
        toast.error('Email has already been registered');
        return;
      } else if (status == 503) {
        toast.error('Network error. Please try again.');
        return;
      } else {
        toast.error('Signup failed');
        return;
      }
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      toast.error('An unexpected error occurred.');
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-[var(--border)]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--foreground)]">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            required
          />

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
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-[var(--foreground)] mt-6">
          Already have an account?{' '}
          <Link href="customer/login">
            <span className="text-[#ff7f50] hover:underline">
              Log In
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}