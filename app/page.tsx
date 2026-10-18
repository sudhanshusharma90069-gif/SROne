import Header from './components/Header';
import Hero from './sections/Hero';
import Deals from './sections/Deals';
import About from './sections/About';
import Footer from './sections/Footer';
import ChatWidget from './components/ChatWidget';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Deals />
        <About />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
