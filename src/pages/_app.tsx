import { Provider } from 'react-redux';
import { store } from '../redux/store';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import ErrorBoundary from './ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
      <Component {...pageProps} />
      </ErrorBoundary>
    </Provider>
  );
}

export default MyApp;
