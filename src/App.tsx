import Navbar from './components/Navbar';
import IntroLoader from './components/IntroLoader';
import ScrollProgress from './components/ScrollProgress';
import Cursor from './components/Cursor';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Skills from './components/Skills';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import './styles/ui.css';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <IntroLoader />
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Skills />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
