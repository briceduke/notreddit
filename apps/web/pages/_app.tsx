import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <html data-theme="synthwave">
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <div className="app">
        <header className="flex">
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </html>
  );
}

export default CustomApp;
