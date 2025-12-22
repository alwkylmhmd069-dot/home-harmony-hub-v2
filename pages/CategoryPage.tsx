import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CATEGORIES, getProductsByCategory } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const category = CATEGORIES.find(c => c.id === categoryId);
  const products = categoryId ? getProductsByCategory(categoryId) : [];

  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {isRTL ? 'الفئة غير موجودة' : 'Category Not Found'}
          </h1>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">
              {category.name[language]}
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div 
          className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64"
          style={{ 
            background: `linear-gradient(135deg, ${category.color}40, ${category.borderColor}40)` 
          }}
        >
          {category.image && (
            <img 
              src={category.image} 
              alt={category.name[language]}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-lg">
              {category.name[language]}
            </h1>
          </div>
        </div>

        {/* Products Count */}
        <p className="text-muted-foreground mb-6">
          {isRTL 
            ? `${products.length} منتج في هذه الفئة`
            : `${products.length} products in this category`
          }
        </p>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {isRTL ? 'لا توجد منتجات في هذه الفئة حالياً' : 'No products in this category yet'}
            </p>
          </div>
        )}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default CategoryPage;
