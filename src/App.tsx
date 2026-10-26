import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}