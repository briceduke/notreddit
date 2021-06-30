import { AppProps } from 'next/app';
import { Provider, createClient } from "urql";
import Head from 'next/head';

import '../styles/globals.css'

const client = createClient({
  url: 'http://localhost:4000/graphql', fetchOptions: {
    credentials: 'include'
  }
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <div data-theme="forest">
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
      </div>
    </Provider>
  );
}

export default CustomApp;
