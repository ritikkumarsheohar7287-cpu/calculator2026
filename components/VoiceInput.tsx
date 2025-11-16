import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface VoiceInputProps {
  onVoiceCommand: (command: string) => void;
  theme: any;
}

export default function VoiceInput({ onVoiceCommand, theme }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startListening = () => {
    setIsListening(true);
    Speech.speak('Listening for calculation', { language: 'en-US' });

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      stopListening();
      const demoCommands = [
        'Calculate sine of 45 degrees',
        'Square root of 144',
        'Add 25 and 75',
        '10 factorial',
        'Log base 10 of 100',
      ];
      const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
      onVoiceCommand(randomCommand);
      Speech.speak(`Calculating ${randomCommand}`, { language: 'en-US' });
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isListening ? theme.accent : theme.cardBg,
          },
        ]}
        onPress={isListening ? stopListening : startListening}
      >
        {isListening ? (
          <View style={styles.listening}>
            <MicOff size={20} color="#000" />
            <View style={styles.ripple}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.rippleCircle,
                    { backgroundColor: theme.accent, opacity: 0.3 - i * 0.1 },
                  ]}
                />
              ))}
            </View>
          </View>
        ) : (
          <Mic size={20} color={theme.accent} />
        )}
      </TouchableOpacity>
      {isListening && (
        <Text style={[styles.listeningText, { color: theme.accent }]}>Listening...</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
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
  listening: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  rippleCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  listeningText: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
});
