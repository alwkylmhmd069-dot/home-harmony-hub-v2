import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DesignSettings {
  card_width: number;
  card_height: number;
  card_border_radius: number;
  hero_height: number;
  hero_overlay_opacity: number;
  primary_color: string;
  secondary_color: string;
  heading_font_size: number;
  body_font_size: number;
}

interface DesignContextType {
  settings: DesignSettings;
  isLoading: boolean;
  updateSetting: (key: keyof DesignSettings, value: number | string) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: DesignSettings = {
  card_width: 300,
  card_height: 450,
  card_border_radius: 12,
  hero_height: 600,
  hero_overlay_opacity: 0.5,
  primary_color: '271 76% 53%',
  secondary_color: '180 100% 50%',
  heading_font_size: 2.25,
  body_font_size: 1,
};

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within DesignProvider');
  }
  return context;
};

export const DesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<DesignSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        const newSettings = { ...defaultSettings };
        data.forEach((item) => {
          const key = item.setting_key as keyof DesignSettings;
          if (key in newSettings) {
            const value = item.setting_value;
            if (key === 'primary_color' || key === 'secondary_color') {
              newSettings[key] = value;
            } else {
              newSettings[key] = parseFloat(value);
            }
          }
        });
        setSettings(newSettings);
        applySettingsToCSS(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySettingsToCSS = (settings: DesignSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--design-card-width', `${settings.card_width}px`);
    root.style.setProperty('--design-card-height', `${settings.card_height}px`);
    root.style.setProperty('--design-card-radius', `${settings.card_border_radius}px`);
    root.style.setProperty('--design-hero-height', `${settings.hero_height}px`);
    root.style.setProperty('--design-hero-overlay', `${settings.hero_overlay_opacity}`);
    root.style.setProperty('--design-heading-size', `${settings.heading_font_size}rem`);
    root.style.setProperty('--design-body-size', `${settings.body_font_size}rem`);
    
    // Apply primary and secondary colors
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--neon-purple', settings.primary_color);
    root.style.setProperty('--neon-cyan', settings.secondary_color);
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateSetting = async (key: keyof DesignSettings, value: number | string) => {
    const stringValue = String(value);
    
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: stringValue })
      .eq('setting_key', key);

    if (error) {
      console.error('Error updating setting:', error);
      throw error;
    }

    // Update local state
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettingsToCSS(newSettings);
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <DesignContext.Provider value={{ settings, isLoading, updateSetting, refreshSettings }}>
      {children}
    </DesignContext.Provider>
  );
};
