import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata = {
  title: 'APFood',
  description: 'Hungry? Order your food now!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#FFE5B4',
              color: '#5D3A00',
              border: '1px solid #FFB347',
              fontWeight: 'bold',
            },
            success: {
              style: {
                background: '#FFB347',
                color: '#5D3A00',
              },
            },
            error: {
              style: {
                background: '#FF6961',
                color: '#fff',
              },
            },
            loading: {
              style: {
                background: '#FFFACD',
                color: '#5D3A00',
              },
            },
          }}
      />
      </body>
    </html>
  );
}