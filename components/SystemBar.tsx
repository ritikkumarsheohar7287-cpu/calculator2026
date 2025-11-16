import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Wifi, WifiOff, Activity } from 'lucide-react-native';
import { format } from 'date-fns';

interface SystemBarProps {
  isActive: boolean;
}

export default function SystemBar({ isActive }: SystemBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wifiStrength, setWifiStrength] = useState(3);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setWifiStrength(Math.floor(Math.random() * 3) + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          {wifiStrength > 0 ? (
            <Wifi size={18} color="#00ff88" />
          ) : (
            <WifiOff size={18} color="#ff4444" />
          )}
          <View style={styles.wifibars}>
            {[1, 2, 3].map((bar) => (
              <View
                key={bar}
                style={[
                  styles.wifiBar,
                  {
                    height: bar * 4,
                    backgroundColor: bar <= wifiStrength ? '#00ff88' : '#333',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.dateText}>{format(currentTime, 'MMM dd, yyyy')}</Text>
          <Text style={styles.timeText}>{format(currentTime, 'HH:mm:ss')}</Text>
        </View>

        <Animated.View
          style={[
            styles.section,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Activity
            size={18}
            color={isActive ? '#00ff88' : '#666'}
            strokeWidth={2.5}
          />
          <Text style={[styles.statusText, { color: isActive ? '#00ff88' : '#666' }]}>
            {isActive ? 'ACTIVE' : 'IDLE'}
          </Text>
        </Animated.View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wifiBars: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'flex-end',
  },
  wifiBar: {
    width: 3,
    borderRadius: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#aaa',
    fontFamily: 'Inter_400Regular',
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Orbitron_700Bold',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
});
