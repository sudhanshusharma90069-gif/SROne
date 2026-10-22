import Header from './components/Header';
import FestivalBanner from './components/FestivalBanner';
import Hero from './sections/Hero';
import AIPredictions from './sections/AIPredictions';
import SmartReorder from './sections/SmartReorder';
import Deals from './sections/Deals';
import CartOptimizer from './components/CartOptimizer';
import About from './sections/About';
import Footer from './sections/Footer';
import ChatWidget from './components/ChatWidget';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <FestivalBanner />
        <Hero />
        <AIPredictions />
        <SmartReorder />
        <Deals />
        <CartOptimizer />
        <About />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
