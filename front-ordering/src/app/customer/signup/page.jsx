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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const evaluatePassword = (pwd) => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    const medium = /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (strong.test(pwd)) return 'Strong';
    if (medium.test(pwd)) return 'Medium';
    return 'Weak';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(evaluatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength === 'Weak') {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }

    try {
      const userData = { email, password, name };
      const status = await signup(userData);
      if (status === 201) {
        toast.success('Signup successful');
        setTimeout(() => {
          router.push('/customer/login');
        }, 1000);
      } else if (status === 403) {
        toast.error('Email has already been registered');
      } else if (status === 503) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('Signup failed');
      }
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 'Strong') return 'bg-green-500 w-full';
    if (passwordStrength === 'Medium') return 'bg-yellow-400 w-2/3';
    return 'bg-red-500 w-1/3';
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

          <div className="!relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full !p-3 !pr-20 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="!absolute !right-2 !top-1/2 transform -translate-y-1/2 text-white !px-3 !py-1 rounded"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {password && (
            <div>
              <div className="w-full h-2 rounded bg-gray-200 mt-1">
                <div className={`h-2 rounded ${getStrengthColor()}`} />
              </div>
              <p className={`text-sm mt-1 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                Password Strength: {passwordStrength}
              </p>
              {passwordStrength === 'Weak' && (
                <ul className="text-xs text-red-500 list-disc ml-5 mt-1">
                  <li>At least 8 characters</li>
                  <li>Use uppercase and lowercase letters</li>
                  <li>Include numbers and special characters</li>
                </ul>
              )}
            </div>
          )}

          <button type="submit" className="mt-4">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-[var(--foreground)] mt-6">
          Already have an account?{' '}
          <Link href="/customer/login">
            <span className="text-[#ff7f50] hover:underline">Log In</span>
          </Link>
        </p>
      </div>
    </div>
  );
}