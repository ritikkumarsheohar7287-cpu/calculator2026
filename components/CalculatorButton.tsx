import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';

interface ButtonProps {
  value: string;
  onPress: (value: string) => void;
  theme: any;
  type?: 'standard' | 'operator' | 'equals' | 'clear' | 'scientific';
}

export default function CalculatorButton({ value, onPress, theme, type = 'standard' }: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGM0fPTgjMGHm7A7+OZUQ0PVanl8LNfHAU7k9n0ynkpBiZ3x+/bjkALD1ys6O6rVxQKSKDi8bxqIQc0jdL00IExBx5vwfDin1QNEFap5O+zYBsGO5TX9NF8KgUmesjw3JBBCw9drej0q1kUCkig4/K9ayEHNI7S9dCCMgcebrDw4p9UDRBYqOXusV8cBTuU2PTSfCsGJ3vI8dyRQQwOXKvn77JnHAU8ltr104MzBx5vwPDinlQNEFan5fCzYBoGO5PZ9NJ7KgYmecnw24xADA' },
      );
      await sound.setVolumeAsync(0.3);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handlePressIn = () => {
    playSound();
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 3,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonColors = () => {
    switch (type) {
      case 'equals':
        return theme.equalsGradient;
      case 'operator':
        return theme.operatorGradient;
      case 'clear':
        return theme.clearGradient;
      case 'scientific':
        return theme.scientificGradient;
      default:
        return theme.buttonGradient;
    }
  };

  const getTextColor = () => {
    if (type === 'equals') return '#fff';
    if (type === 'operator') return theme.accent;
    if (type === 'clear') return '#ff4444';
    return theme.text;
  };

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          shadowOpacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(value)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={getButtonColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.text, { color: getTextColor() }]}>{value}</Text>
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    minWidth: 60,
    maxWidth: 100,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
});
