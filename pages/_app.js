// pages/_app.js
import '../styles/globals.css';  // Changed from @/styles/globals.css
import Navigation from '../components/Navigation';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}