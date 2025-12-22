import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, Shield, Headphones, RotateCcw } from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      titleKey: 'features.freeShipping',
      descKey: 'features.freeShippingDesc',
      color: 'primary',
    },
    {
      icon: Shield,
      titleKey: 'features.securePayment',
      descKey: 'features.securePaymentDesc',
      color: 'secondary',
    },
    {
      icon: Headphones,
      titleKey: 'features.support',
      descKey: 'features.supportDesc',
      color: 'primary',
    },
    {
      icon: RotateCcw,
      titleKey: 'features.returns',
      descKey: 'features.returnsDesc',
      color: 'secondary',
    },
  ];

  return (
    <section className="py-16 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                className="card-neon p-6 flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  feature.color === 'primary' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary/20 text-secondary'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
