import { useState } from 'react';

export interface Theme {
  gradient: string[];
  displayGradient: string[];
  buttonGradient: string[];
  operatorGradient: string[];
  equalsGradient: string[];
  clearGradient: string[];
  scientificGradient: string[];
  cardBg: string;
  text: string;
  textSecondary: string;
  accent: string;
}

const darkTheme: Theme = {
  gradient: ['#0a0e27', '#1a1f3a', '#2a2f4a'],
  displayGradient: ['rgba(0, 255, 136, 0.1)', 'rgba(0, 136, 255, 0.1)'],
  buttonGradient: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
  operatorGradient: ['rgba(0, 255, 136, 0.2)', 'rgba(0, 136, 255, 0.2)'],
  equalsGradient: ['#00ff88', '#00aa66'],
  clearGradient: ['rgba(255, 68, 68, 0.2)', 'rgba(255, 68, 68, 0.1)'],
  scientificGradient: ['rgba(138, 43, 226, 0.2)', 'rgba(75, 0, 130, 0.2)'],
  cardBg: 'rgba(255, 255, 255, 0.08)',
  text: '#ffffff',
  textSecondary: '#888888',
  accent: '#00ff88',
};

const lightTheme: Theme = {
  gradient: ['#e0f7fa', '#b2ebf2', '#80deea'],
  displayGradient: ['rgba(0, 150, 136, 0.1)', 'rgba(0, 100, 255, 0.1)'],
  buttonGradient: ['rgba(255, 255, 255, 0.9)', 'rgba(240, 240, 240, 0.9)'],
  operatorGradient: ['rgba(0, 150, 136, 0.3)', 'rgba(0, 100, 255, 0.3)'],
  equalsGradient: ['#00c9a7', '#00a896'],
  clearGradient: ['rgba(244, 67, 54, 0.3)', 'rgba(244, 67, 54, 0.2)'],
  scientificGradient: ['rgba(103, 58, 183, 0.3)', 'rgba(63, 81, 181, 0.3)'],
  cardBg: 'rgba(255, 255, 255, 0.7)',
  text: '#1a1a1a',
  textSecondary: '#666666',
  accent: '#00c9a7',
};

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return {
    theme: isDark ? darkTheme : lightTheme,
    isDark,
    toggleTheme,
  };
}
