'use client';
import { getHello } from '../services/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function HomePage() {
  const handleClick = async () => {
    try {
      const data = await getHello();
      console.log(data);
      toast.success('Success! ' + JSON.stringify(data));
    } catch (error) {
      console.error('Error calling API:', error);
      toast.error('API call failed.');
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Home Page</h1>
      <button onClick={handleClick}>Call API</button>
      <Link href="/customer/login">Customer Login</Link>
      <Link href="/merchant/login">Merchant Login</Link>
    </main>
  );
}
