import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Trash2, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onSelectHistory: (expression: string) => void;
  onClose: () => void;
  theme: any;
}

export default function HistoryPanel({
  history,
  onClearHistory,
  onSelectHistory,
  onClose,
  theme,
}: HistoryPanelProps) {
  return (
    <BlurView intensity={90} tint="dark" style={styles.container}>
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={24} color={theme.accent} />
          <Text style={[styles.title, { color: theme.text }]}>History</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.cardBg }]}
            onPress={onClearHistory}
          >
            <Trash2 size={20} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.cardBg }]}
            onPress={onClose}
          >
            <X size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No calculations yet
            </Text>
          </View>
        ) : (
          history.map((entry, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.historyItem, { backgroundColor: theme.cardBg }]}
              onPress={() => {
                onSelectHistory(entry.expression);
                onClose();
              }}
            >
              <BlurView intensity={30} tint="dark" style={styles.itemBlur}>
                <Text style={[styles.expression, { color: theme.text }]}>
                  {entry.expression}
                </Text>
                <Text style={[styles.result, { color: theme.accent }]}>
                  = {entry.result}
                </Text>
                <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Orbitron_700Bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  historyItem: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  itemBlur: {
    padding: 16,
  },
  expression: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  result: {
    fontSize: 20,
    fontFamily: 'Orbitron_700Bold',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
