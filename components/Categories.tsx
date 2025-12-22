import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES } from '@/data/mockData';
import { 
  ChefHat, 
  Zap,
  Sparkles,
  Utensils,
  Armchair,
  LayoutGrid,
  Bed,
  Monitor
} from 'lucide-react';

const iconMap: Record<string, any> = {
  ChefHat,
  Zap,
  Sparkles,
  Utensils,
  Armchair,
  LayoutGrid,
  Bed,
  Monitor
};

const Categories = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            <span className="gradient-text">{t('categories.title')}</span>
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((category, index) => {
            const Icon = iconMap[category.icon] || ChefHat;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square block"
                >
                  {/* Background Image */}
                  <img
                    src={category.image}
                    alt={category.name[language]}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                    <motion.div
                      className={`w-12 h-12 rounded-xl glass border ${category.borderColor} flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors`}
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </motion.div>
                    <h3 className="font-bold text-foreground mb-1">{category.name[language]}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} {t('filter.productsAvailable')}</p>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 30px hsl(var(--neon-purple) / 0.3), 0 0 30px hsl(var(--neon-cyan) / 0.2)' }} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
