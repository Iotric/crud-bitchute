import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Accountly',
  description: 'Your account, simply managed.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">{children}</main>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
