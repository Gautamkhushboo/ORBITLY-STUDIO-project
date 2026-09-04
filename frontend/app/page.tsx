import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Services from '@/components/home/Services';
import SelectedWork from '@/components/home/SelectedWork';
import Process from '@/components/home/Process';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import ContactCTA from '@/components/home/ContactCTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <SelectedWork />
        <Process />
        <Testimonials />
        <BlogPreview />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
