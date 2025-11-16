import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import SystemBar from '../components/SystemBar';
import CalculatorButton from '../components/CalculatorButton';
import HistoryPanel from '../components/HistoryPanel';
import VoiceInput from '../components/VoiceInput';
import { useCalculator } from '../hooks/useCalculator';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun, History as HistoryIcon, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Calculator() {
  const {
    display,
    result,
    handleInput,
    calculate,
    clear,
    deleteLast,
    history,
    clearHistory,
    insertFromHistory,
    handleVoiceCommand,
    memory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
  } = useCalculator();

  const { theme, toggleTheme, isDark } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const activityTimeout = useRef<NodeJS.Timeout>();

  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (showHistory) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: width,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [showHistory]);

  const handleActivity = () => {
    setIsActive(true);
    if (activityTimeout.current) {
      clearTimeout(activityTimeout.current);
    }
    activityTimeout.current = setTimeout(() => {
      setIsActive(false);
    }, 3000);
  };

  const onButtonPress = (value: string) => {
    handleActivity();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleInput(value);
  };

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log', 'ln'],
    ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', '√', 'x²'],
    ['sinh', 'cosh', 'tanh', 'π', 'e'],
    ['(', ')', 'x!', 'xʸ', '10ˣ'],
    ['MC', 'MR', 'M+', 'M-', '%'],
  ];

  const standardButtons = [
    ['C', '⌫', '(', ')'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SystemBar isActive={isActive} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topControls}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.cardBg }]}
            onPress={toggleTheme}
          >
            {isDark ? (
              <Sun size={20} color={theme.accent} />
            ) : (
              <Moon size={20} color={theme.accent} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.cardBg }]}
            onPress={() => setShowHistory(!showHistory)}
          >
            <HistoryIcon size={20} color={theme.accent} />
          </TouchableOpacity>

          <VoiceInput onVoiceCommand={handleVoiceCommand} theme={theme} />
        </View>

        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.displayContainer}>
          <LinearGradient
            colors={theme.displayGradient}
            style={styles.displayGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.displayScroll}
            >
              <Text style={[styles.displayText, { color: theme.text }]}>
                {display || '0'}
              </Text>
            </ScrollView>

            {result !== null && (
              <Text style={[styles.resultText, { color: theme.accent }]}>
                = {result}
              </Text>
            )}

            {memory > 0 && (
              <View style={[styles.memoryIndicator, { backgroundColor: theme.accent }]}>
                <Text style={styles.memoryText}>M</Text>
              </View>
            )}
          </LinearGradient>
        </BlurView>

        <View style={styles.scientificSection}>
          {scientificButtons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button) => (
                <CalculatorButton
                  key={button}
                  value={button}
                  onPress={onButtonPress}
                  theme={theme}
                  type="scientific"
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.standardSection}>
          {standardButtons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button) => (
                <CalculatorButton
                  key={button}
                  value={button}
                  onPress={
                    button === 'C'
                      ? clear
                      : button === '⌫'
                      ? deleteLast
                      : button === '='
                      ? calculate
                      : onButtonPress
                  }
                  theme={theme}
                  type={
                    button === '='
                      ? 'equals'
                      : ['÷', '×', '-', '+'].includes(button)
                      ? 'operator'
                      : button === 'C'
                      ? 'clear'
                      : 'standard'
                  }
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            4K Scientific Calculator
          </Text>
        </View>
      </ScrollView>

      <Animated.View
        style={[
          styles.historyContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <HistoryPanel
          history={history}
          onClearHistory={clearHistory}
          onSelectHistory={insertFromHistory}
          onClose={() => setShowHistory(false)}
          theme={theme}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  displayContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  displayGradient: {
    padding: 24,
    minHeight: 140,
    justifyContent: 'center',
  },
  displayScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  displayText: {
    fontSize: width < 768 ? 36 : 48,
    fontFamily: 'Orbitron_700Bold',
    textAlign: 'right',
  },
  resultText: {
    fontSize: width < 768 ? 24 : 32,
    fontFamily: 'Orbitron_400Regular',
    textAlign: 'right',
    marginTop: 8,
  },
  memoryIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  scientificSection: {
    marginBottom: 16,
  },
  standardSection: {
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  historyContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width < 768 ? '100%' : 400,
    zIndex: 1000,
  },
});
