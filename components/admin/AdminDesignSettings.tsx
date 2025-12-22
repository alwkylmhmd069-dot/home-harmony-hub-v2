import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Eye } from 'lucide-react';
import { useDesign } from '@/contexts/DesignContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const AdminDesignSettings = () => {
  const { settings, updateSetting, isLoading, refreshSettings } = useDesign();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSliderChange = (key: keyof typeof settings, value: number[]) => {
    setLocalSettings({ ...localSettings, [key]: value[0] });
  };

  const handleColorChange = (key: 'primary_color' | 'secondary_color', value: string) => {
    // Convert hex to HSL for storage
    const hsl = hexToHsl(value);
    setLocalSettings({ ...localSettings, [key]: hsl });
  };

  const hexToHsl = (hex: string): string => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const hslToHex = (hsl: string): string => {
    const parts = hsl.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return '#8B5CF6';
    
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save each changed setting
      const keys = Object.keys(localSettings) as (keyof typeof settings)[];
      for (const key of keys) {
        if (localSettings[key] !== settings[key]) {
          await updateSetting(key, localSettings[key]);
        }
      }
      
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ إعدادات التصميم' : 'Design settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setLocalSettings({
      card_width: 300,
      card_height: 450,
      card_border_radius: 12,
      hero_height: 600,
      hero_overlay_opacity: 0.5,
      primary_color: '271 76% 53%',
      secondary_color: '180 100% 50%',
      heading_font_size: 2.25,
      body_font_size: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-neon p-6">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {isRTL ? 'إعدادات التصميم' : 'Design Settings'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'تخصيص مظهر المتجر' : 'Customize your store appearance'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 me-2" />
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
          <Button 
            className="btn-neon text-primary-foreground"
            onClick={saveSettings}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 me-2" />
            {isSaving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التعديلات' : 'Save Changes')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-neon p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            {isRTL ? 'إعدادات البطاقات' : 'Card Controls'}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'عرض البطاقة' : 'Card Width'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.card_width}px</span>
              </div>
              <Slider
                value={[localSettings.card_width]}
                onValueChange={(value) => handleSliderChange('card_width', value)}
                min={200}
                max={450}
                step={10}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'ارتفاع البطاقة' : 'Card Height'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.card_height}px</span>
              </div>
              <Slider
                value={[localSettings.card_height]}
                onValueChange={(value) => handleSliderChange('card_height', value)}
                min={300}
                max={600}
                step={10}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'استدارة الزوايا' : 'Border Radius'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.card_border_radius}px</span>
              </div>
              <Slider
                value={[localSettings.card_border_radius]}
                onValueChange={(value) => handleSliderChange('card_border_radius', value)}
                min={0}
                max={32}
                step={2}
              />
            </div>
          </div>
        </motion.div>

        {/* Hero Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neon p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            {isRTL ? 'إعدادات البانر' : 'Banner Controls'}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'ارتفاع البانر' : 'Hero Height'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.hero_height}px</span>
              </div>
              <Slider
                value={[localSettings.hero_height]}
                onValueChange={(value) => handleSliderChange('hero_height', value)}
                min={400}
                max={900}
                step={50}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'شفافية الطبقة' : 'Overlay Opacity'}</Label>
                <span className="text-sm text-muted-foreground">{Math.round(localSettings.hero_overlay_opacity * 100)}%</span>
              </div>
              <Slider
                value={[localSettings.hero_overlay_opacity * 100]}
                onValueChange={(value) => setLocalSettings({ ...localSettings, hero_overlay_opacity: value[0] / 100 })}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>
        </motion.div>

        {/* Typography Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-neon p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Aa</span>
            </div>
            {isRTL ? 'إعدادات الخطوط' : 'Typography'}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'حجم العناوين' : 'Heading Size'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.heading_font_size}rem</span>
              </div>
              <Slider
                value={[localSettings.heading_font_size * 10]}
                onValueChange={(value) => setLocalSettings({ ...localSettings, heading_font_size: value[0] / 10 })}
                min={15}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>{isRTL ? 'حجم النص' : 'Body Size'}</Label>
                <span className="text-sm text-muted-foreground">{localSettings.body_font_size}rem</span>
              </div>
              <Slider
                value={[localSettings.body_font_size * 10]}
                onValueChange={(value) => setLocalSettings({ ...localSettings, body_font_size: value[0] / 10 })}
                min={8}
                max={20}
                step={1}
              />
            </div>
          </div>
        </motion.div>

        {/* Color Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-neon p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            {isRTL ? 'الألوان' : 'Colors'}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>{isRTL ? 'اللون الأساسي' : 'Primary Color'}</Label>
              <div className="flex gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
                  style={{ backgroundColor: `hsl(${localSettings.primary_color})` }}
                />
                <Input
                  type="color"
                  value={hslToHex(localSettings.primary_color)}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="flex-1 h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>{isRTL ? 'اللون الثانوي' : 'Secondary Color'}</Label>
              <div className="flex gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
                  style={{ backgroundColor: `hsl(${localSettings.secondary_color})` }}
                />
                <Input
                  type="color"
                  value={hslToHex(localSettings.secondary_color)}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="flex-1 h-12"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-neon p-6"
      >
        <h2 className="text-xl font-bold mb-6">
          {isRTL ? 'معاينة مباشرة' : 'Live Preview'}
        </h2>
        
        <div className="flex flex-wrap gap-6 items-start">
          {/* Preview Card */}
          <div
            className="glass rounded-2xl p-4 transition-all"
            style={{
              width: `${localSettings.card_width}px`,
              borderRadius: `${localSettings.card_border_radius}px`,
            }}
          >
            <div 
              className="bg-muted rounded-xl mb-4"
              style={{ 
                height: `${localSettings.card_height * 0.5}px`,
                borderRadius: `${localSettings.card_border_radius * 0.8}px`,
              }}
            />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-6 rounded w-1/2" style={{ backgroundColor: `hsl(${localSettings.primary_color})` }} />
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-xl"
                style={{ backgroundColor: `hsl(${localSettings.primary_color})` }}
              />
              <span className="text-sm text-muted-foreground">
                {isRTL ? 'اللون الأساسي' : 'Primary'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-xl"
                style={{ backgroundColor: `hsl(${localSettings.secondary_color})` }}
              />
              <span className="text-sm text-muted-foreground">
                {isRTL ? 'اللون الثانوي' : 'Secondary'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDesignSettings;
