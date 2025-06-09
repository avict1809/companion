import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  gradient: string[];
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const lightColors: ThemeColors = {
  primary: '#7C3AED',         // deep neon purple
  secondary: '#A855F7',       // softer violet
  accent: '#5EEAD4',          // soft neon teal (instead of harsh cyan)
  background: '#F3F4F6',      // light gray background
  surface: '#FFFFFF',         // white surface (for contrast with neon)
  card: '#F9FAFB',            // very light gray for cards
  text: '#1F2937',            // rich gray, very readable
  textSecondary: '#6B7280',   // muted gray
  border: '#00000',          // soft gray border
  success: '#34D399',         // neon green but not harsh
  warning: '#FBBF24',         // bright but controlled yellow
  error: '#F87171',           // soft neon red
  gradient: ['#7C3AED', '#A855F7'], // deep neon purple gradient
};



const darkColors: ThemeColors = {
  primary: '#8B5CF6',
  secondary: '#6366F1',
  accent: '#06B6D4',
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradient: ['#8B5CF6', '#6366F1'],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};