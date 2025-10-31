import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { fetchAIEncouragement, type EncouragementResponse, type Mood, type SupportedLocale } from '../services/aiService';

const moods: Mood[] = ['落ち込み', '普通', '前向き'];
const locales: Array<{ label: string; value: SupportedLocale }> = [
  { label: '日本語', value: 'ja-JP' },
  { label: '中文', value: 'zh-CN' },
  { label: '한국어', value: 'ko-KR' },
];

type ChatMessage = EncouragementResponse & { id: string; mood: Mood; locale: SupportedLocale };

export const ChatScreen: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>('普通');
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('ja-JP');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await fetchAIEncouragement({ mood: selectedMood, locale: selectedLocale });
      const message: ChatMessage = {
        ...result,
        id: `${Date.now()}`,
        mood: selectedMood,
        locale: selectedLocale,
      };
      setMessages((prev) => [message, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const latestNotice = messages[0]?.notice;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>AI励ましチャット</Text>
        <Text style={styles.subtitle}>気持ちと使いたい言語を選んで、AIに優しい言葉をお願いしましょう。</Text>

        <Text style={styles.sectionLabel}>気分を選ぶ</Text>

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

        <Text style={styles.sectionLabel}>言語を選ぶ</Text>
        <View style={styles.moodRow}>
          {locales.map(({ label, value }) => {
            const isActive = selectedLocale === value;
            return (
              <TouchableOpacity
                key={value}
                activeOpacity={0.8}
                style={[styles.moodChip, isActive ? styles.moodChipActive : undefined]}
                onPress={() => setSelectedLocale(value)}
              >
                <Text style={[styles.moodChipText, isActive ? styles.moodChipTextActive : undefined]}>
                  {label}
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
        {latestNotice ? <Text style={styles.noticeText}>{latestNotice}</Text> : null}

        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <Text style={styles.placeholderText}>まだメッセージはありません。気持ちを選んで受け取ってみてください。</Text>
          ) : (
            messages.map((message) => (
              <View key={message.id} style={styles.messageBubble}>
                <View style={styles.messageMetaRow}>
                  <Text style={styles.messageMetaText}>
                    {message.locale} / {message.mood}
                  </Text>
                  <Text style={styles.messageMetaSource}>
                    {message.source === 'openai' ? 'AI生成' : 'テンプレート'}
                  </Text>
                </View>
                <Text style={styles.messageBubbleText}>{message.message}</Text>
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e5873',
    marginBottom: 12,
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
  noticeText: {
    color: '#8e5873',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
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
  messageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageMetaText: {
    fontSize: 12,
    color: '#8e5873',
  },
  messageMetaSource: {
    fontSize: 12,
    color: '#b85f8e',
    fontWeight: '600',
  },
  messageBubbleText: {
    color: '#4a2f3b',
    fontSize: 16,
    lineHeight: 22,
  },
});
