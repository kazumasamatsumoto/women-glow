import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { maxFreeMessagesPerDay } from '../utils/messages';
import { usePurchase } from '../store/purchaseStore';
import { FALLBACK_PRODUCTS, type DisplayProduct } from '../services/purchaseService';

export const PurchaseScreen: React.FC = () => {
  const {
    isSupported,
    isLoading,
    isProcessingPurchase,
    products,
    points,
    hasUnlimitedAccess,
    error,
    initiatePurchase,
    restorePurchases,
  } = usePurchase();

  const useFallbackProducts = !isLoading && (!isSupported || products.length === 0);
  const displayedProducts: DisplayProduct[] = useFallbackProducts ? FALLBACK_PRODUCTS : products;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ポイントとプラン</Text>
        <Text style={styles.subtitle}>追加の励ましや無制限プランはアプリ内課金から購入できます。</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>所持ポイント</Text>
          <Text style={styles.balanceValue}>{points}</Text>
          {hasUnlimitedAccess ? (
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>無制限プラン利用中</Text>
            </View>
          ) : (
            <Text style={styles.balanceSubtext}>1日{maxFreeMessagesPerDay}件の無料メッセージをいつでもどうぞ。</Text>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!isSupported ? (
          <Text style={styles.noticeText}>
            Expo Go や Web では実際の課金フローは利用できません。下記のカードは表示のイメージです。
          </Text>
        ) : null}
        {isSupported && isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#c06292" />
            <Text style={styles.loadingText}>ストア情報を読み込み中…</Text>
          </View>
        ) : null}

        {displayedProducts.map((product) => (
          <View key={product.productId} style={styles.purchaseCard}>
            <Text style={styles.purchaseTitle}>{product.title || 'ポイントパック'}</Text>
            {product.description ? (
              <Text style={styles.purchaseDescription}>{product.description}</Text>
            ) : (
              <Text style={styles.purchaseDescription}>より多くの励ましを受け取れます。</Text>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.purchaseButton,
                isProcessingPurchase || useFallbackProducts ? styles.purchaseButtonDisabled : undefined,
              ]}
              onPress={() => !useFallbackProducts && initiatePurchase(product.productId)}
              disabled={isProcessingPurchase || useFallbackProducts}
            >
              <Text style={styles.purchaseButtonText}>
                {isProcessingPurchase
                  ? '処理中…'
                  : useFallbackProducts
                    ? product.priceString
                    : `${product.priceString} で購入`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {isSupported ? (
          <TouchableOpacity activeOpacity={0.8} style={styles.secondaryButton} onPress={restorePurchases}>
            <Text style={styles.secondaryButtonText}>以前の購入を復元する</Text>
          </TouchableOpacity>
        ) : null}
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
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  balanceSubtext: {
    marginTop: 12,
    fontSize: 13,
    color: '#8e5873',
    lineHeight: 18,
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
  noticeText: {
    fontSize: 13,
    color: '#8e5873',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#c0392b',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#8e5873',
  },
  purchaseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a2f3b',
    marginBottom: 4,
  },
  purchaseDescription: {
    fontSize: 13,
    color: '#8e5873',
    lineHeight: 18,
    marginBottom: 16,
  },
  purchaseButton: {
    backgroundColor: '#e69abf',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e69abf',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b85f8e',
  },
});
