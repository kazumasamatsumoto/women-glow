import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { fetchAIEncouragement, type Mood } from '../services/aiService';

const moods: Mood[] = ['落ち込み', '普通', '前向き'];

export const ChatScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>('普通');
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const aiMessage = await fetchAIEncouragement(selectedMood);
      setMessages((prev) => [aiMessage, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>AI励ましチャット</Text>
        <Text style={styles.subtitle}>今の気持ちに近いものを選んでね。</Text>

        <View style={styles.moodRow}>
          {moods.map((mood) => {
            const isActive = selectedMood === mood;
            return (
              <TouchableOpacity
                key={mood}
                activeOpacity={0.8}
                style={[styles.moodChip, isActive ? styles.moodChipActive : undefined]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={[styles.moodChipText, isActive ? styles.moodChipTextActive : undefined]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.generateButton, isLoading ? styles.generateButtonDisabled : undefined]}
          onPress={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateButtonText}>励ましを受け取る</Text>}
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <Text style={styles.placeholderText}>まだメッセージはありません。気持ちを選んで受け取ってみてください。</Text>
          ) : (
            messages.map((message, index) => (
              <View key={`${message}-${index}`} style={styles.messageBubble}>
                <Text style={styles.messageBubbleText}>{message}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffe6f2',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#b85f8e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e5873',
    marginBottom: 24,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodChip: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e69abf',
    alignItems: 'center',
  },
  moodChipActive: {
    backgroundColor: '#e69abf',
  },
  moodChipText: {
    color: '#b85f8e',
    fontWeight: '600',
  },
  moodChipTextActive: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#c06292',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#c0392b',
    marginBottom: 16,
    fontSize: 14,
  },
  messagesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minHeight: 200,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholderText: {
    color: '#8e5873',
    fontSize: 14,
    lineHeight: 20,
  },
  messageBubble: {
    backgroundColor: '#f8d3e4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  messageBubbleText: {
    color: '#4a2f3b',
    fontSize: 16,
    lineHeight: 22,
  },
});
