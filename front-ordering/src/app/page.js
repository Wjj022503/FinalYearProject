import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-green-600">Welcome to APFood</h1>
      <p className="max-w-xl text-lg text-gray-700 mb-8">
        APFood is a food ordering system built to enhance the dining experience at Asia Pacific University. 
        Skip the queue, order ahead, and enjoy seamless ordering — whether you are a student or a faculty.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/customer/login">
          <button className="!px-6 !py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md text-lg">
            Customer Login
          </button>
        </Link>

        <Link href="/merchant/login">
          <button className="!px-6 !py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md text-lg">
            Merchant Login
          </button>
        </Link>
      </div>
    </main>
  );
}
