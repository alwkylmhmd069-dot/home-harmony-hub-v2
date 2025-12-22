import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <FeaturedProducts />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;