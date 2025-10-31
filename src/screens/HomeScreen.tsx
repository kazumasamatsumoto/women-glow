import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { dailyMessages, maxFreeMessagesPerDay } from '../utils/messages';
import { usePurchase } from '../store/purchaseStore';
import type { RootTabParamList } from '../navigation/RootNavigator';

export const HomeScreen: React.FC = () => {
  const displayedMessages = dailyMessages.slice(0, maxFreeMessagesPerDay);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList, 'Home'>>();
  const { points, hasUnlimitedAccess } = usePurchase();

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
          <Text style={styles.sectionTitle}>現在のステータス</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>所持ポイント</Text>
            <Text style={styles.balanceValue}>{points}</Text>
            {hasUnlimitedAccess ? (
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>無制限プラン利用中</Text>
              </View>
            ) : (
              <Text style={styles.balanceSubtext}>無制限プランを契約すると AI 励ましがいつでも使えます。</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>次にどこへ進む？</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navigationButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.navigationButtonTitle}>AI 励ましチャットへ</Text>
            <Text style={styles.navigationButtonSubtitle}>気持ちに寄り添う言葉を AI にお願いしましょう</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navigationButton}
            onPress={() => navigation.navigate('Purchase')}
          >
            <Text style={styles.navigationButtonTitle}>ポイント・プランを確認</Text>
            <Text style={styles.navigationButtonSubtitle}>追加メッセージや無制限プランを購入できます</Text>
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
    marginBottom: 12,
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
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8e5873',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#b85f8e',
  },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: '#f8d3e4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusPillText: {
    fontSize: 12,
    color: '#b85f8e',
    fontWeight: '600',
  },
  balanceSubtext: {
    marginTop: 12,
    fontSize: 13,
    color: '#8e5873',
    lineHeight: 18,
  },
  navigationButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  navigationButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a2f3b',
    marginBottom: 8,
  },
  navigationButtonSubtitle: {
    fontSize: 13,
    color: '#8e5873',
    lineHeight: 18,
  },
});
