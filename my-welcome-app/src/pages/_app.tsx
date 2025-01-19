import '@/styles/globals.css';
import type { AppProps } from 'next/app';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex">
      <div className="flex-1 ml-16">
        <Component {...pageProps} />
      </div>
    </div>
  );
} 