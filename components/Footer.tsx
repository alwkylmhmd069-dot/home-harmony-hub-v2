import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

// Social Media Icons as SVG components
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.076-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.976-.374-1.228-.795-1.213-1.168 0-.375.301-.72.734-.839.15-.061.33-.09.509-.09.12 0 .3.015.465.104.378.18.72.3 1.034.3.199 0 .344-.044.418-.089-.007-.165-.019-.33-.031-.51l-.003-.06c-.104-1.627-.229-3.654.3-4.847 1.582-3.545 4.939-3.821 5.929-3.821z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.099-1.135 3.432-1.142 1.013-.006 1.963.14 2.855.431-.057-1.14-.238-2.122-.654-2.678-.483-.646-1.283-.972-2.378-.972h-.03c-.817.01-1.46.195-1.91.547l-1.33-1.572c.832-.705 1.965-1.081 3.28-1.092h.035c1.696 0 3.022.53 3.94 1.577.682.777 1.098 1.79 1.248 3.067.244.085.483.18.715.288 1.182.554 2.097 1.368 2.645 2.357.705 1.273.852 2.9.415 4.58-.643 2.473-2.476 4.2-5.16 4.862-1.052.259-2.22.378-3.488.378zm-.091-9.472c-.91 0-1.63.243-2.087.705-.414.42-.614.953-.586 1.547.032.692.355 1.239.937 1.583.537.318 1.235.47 2.02.44.967-.052 1.726-.424 2.26-1.106.513-.653.786-1.61.81-2.842-.826-.281-1.768-.327-3.354-.327z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Footer = () => {
  const { t, isRTL } = useLanguage();

  const quickLinks = [
    { key: 'header.home', href: '/' },
    { key: 'header.products', href: '/products' },
    { key: 'header.categories', href: '/categories' },
    { key: 'header.offers', href: '/offers' },
  ];

  const supportLinks = [
    { key: 'footer.about', href: '/about' },
    { key: 'footer.contact', href: '/contact' },
    { key: 'footer.privacy', href: '/privacy' },
    { key: 'footer.terms', href: '/terms' },
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: 'https://www.facebook.com/profile.php?id=61584901946388', label: 'Facebook', color: '#1877F2' },
    { icon: InstagramIcon, href: 'https://www.instagram.com/tajermohammedal', label: 'Instagram', color: '#E4405F' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@mohamed.eltager4', label: 'TikTok', color: '#000000' },
    { icon: TwitterIcon, href: 'https://x.com/Cibebe8558Max', label: 'X', color: '#000000' },
    { icon: LinkedInIcon, href: 'https://www.linkedin.com/in/mohamed-tajer-9a6047386', label: 'LinkedIn', color: '#0A66C2' },
    { icon: ThreadsIcon, href: 'https://www.threads.com/@tajermohammedal', label: 'Threads', color: '#000000' },
    { icon: SnapchatIcon, href: 'https://accounts.snapchat.com/v2/welcome', label: 'Snapchat', color: '#FFFC00' },
  ];

  const contactInfo = {
    phone: '01552554185',
    phoneInternational: '+20 15 52554185',
    email: 'm5127681@gmail.com',
    whatsapp: 'https://wa.me/201552554185',
    telegram: 'https://t.me/+201552554185',
  };

  return (
    <footer className="bg-card/50 border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <a href="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Family Home" className="h-12 w-12 rounded-full" />
              <span className="font-display font-bold text-xl gradient-text">Family Home</span>
            </a>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              {t('hero.description').slice(0, 100)}...
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg glass border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                  <Phone size={14} />
                </div>
                <span className="text-sm" dir="ltr">{contactInfo.phoneInternational}</span>
              </a>
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg glass border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                  <Mail size={14} />
                </div>
                <span className="text-sm">{contactInfo.email}</span>
              </a>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex gap-2">
              <motion.a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/30 transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </motion.a>
              <motion.a
                href={contactInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/30 transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TelegramIcon />
                <span>Telegram</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-foreground mb-6">{t('header.categories')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-foreground mb-6">{t('features.support')}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.key}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-foreground mb-6">{t('footer.newsletter')}</h3>
            <form className="space-y-4 mb-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className={`w-full ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm`}
                />
                <motion.button
                  type="submit"
                  className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg btn-neon flex items-center justify-center`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={14} className={`text-primary-foreground ${isRTL ? 'rotate-180' : ''}`} />
                </motion.button>
              </div>
            </form>

            {/* Social Media */}
            <h4 className="font-semibold text-foreground mb-4 text-sm">{t('footer.followUs')}</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center hover:border-primary/50 transition-all group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                    style={{ '--hover-color': social.color } as React.CSSProperties}
                  >
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      <Icon />
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Family Home. {t('footer.rights')}.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span dir="ltr">📞 {contactInfo.phone}</span>
              <span>|</span>
              <span>✉️ {contactInfo.email}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;