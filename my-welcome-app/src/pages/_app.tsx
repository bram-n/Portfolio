import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';

  return (
    <main className={inter.className}>
      {!isLandingPage && <Sidebar />}
      <div className={!isLandingPage ? 'pl-16' : ''}>
        <Component {...pageProps} />
      </div>
    </main>
  );
} 