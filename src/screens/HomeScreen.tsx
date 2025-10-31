import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { dailyMessages, maxFreeMessagesPerDay } from '../utils/messages';

export const HomeScreen: React.FC = () => {
  const displayedMessages = dailyMessages.slice(0, maxFreeMessagesPerDay);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>今日もお疲れさま 🌸</Text>
        <Text style={styles.subtitle}>あなたのための言葉をお届けします</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日のメッセージ</Text>
          <Text style={styles.sectionDescription}>
            無料メッセージは1日{maxFreeMessagesPerDay}件まで受け取れます。
          </Text>

          {displayedMessages.map((message, index) => (
            <View key={index} style={styles.messageCard}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>さらに寄り添う言葉も</Text>
          <Text style={styles.sectionDescription}>
            気分に合わせてAIがあなただけの言葉を贈ります。
          </Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>AIに励ましをお願いする</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#b85f8e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a86c8d',
    marginBottom: 24,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#c06292',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8e5873',
    marginBottom: 16,
    lineHeight: 20,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4a2f3b',
  },
  primaryButton: {
    backgroundColor: '#e69abf',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
