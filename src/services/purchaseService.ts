import { Platform } from 'react-native';
import type * as ExpoInAppPurchases from 'expo-in-app-purchases';

let InAppPurchases: typeof ExpoInAppPurchases | undefined;
try {
  // Running in Expo Go throws if the native module is missing, so guard the require.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  InAppPurchases = require('expo-in-app-purchases');
} catch (error) {
  InAppPurchases = undefined;
  // eslint-disable-next-line no-console
  console.info('[purchaseService] expo-in-app-purchases is unavailable in this environment.', error);
}

export const PRODUCT_IDS = {
  tenPoints: 'women_glow_points_10',
  unlimitedMonthly: 'women_glow_unlimited_monthly',
} as const;

const CONSUMABLE_PRODUCTS = new Set<string>([PRODUCT_IDS.tenPoints]);

export const PRODUCT_REWARDS: Record<string, { points?: number; grantUnlimited?: boolean }> = {
  [PRODUCT_IDS.tenPoints]: { points: 10 },
  [PRODUCT_IDS.unlimitedMonthly]: { grantUnlimited: true },
};

export const FALLBACK_PRODUCTS: DisplayProduct[] = [
  {
    productId: 'demo_points_pack',
    title: 'ポイント 10P パック',
    description: '短い元気付けをもう少し受け取りたいときに。',
    priceString: '¥120',
  },
  {
    productId: 'demo_unlimited_plan',
    title: '無制限プラン (月額)',
    description: 'その日の気分に合わせて、いつでも AI メッセージをどうぞ。',
    priceString: '¥480 / 月',
  },
];

export const isPurchaseSupported = (Platform.OS === 'ios' || Platform.OS === 'android') && !!InAppPurchases;

export type DisplayProduct = {
  productId: string;
  title?: string;
  description?: string;
  priceString?: string;
};

export async function connectToStore(): Promise<boolean> {
  if (!isPurchaseSupported) {
    return false;
  }

  await InAppPurchases!.connectAsync();
  return true;
}

export async function disconnectFromStore(): Promise<void> {
  if (!isPurchaseSupported) {
    return;
  }

  try {
    await InAppPurchases!.disconnectAsync();
  } catch {
    // Ignore disconnect errors; Expo handles cleanup when app closes.
  }
}

export async function fetchProducts(productIds: string[]): Promise<DisplayProduct[]> {
  if (!InAppPurchases) {
    return [];
  }
  const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
  if (responseCode !== InAppPurchases.IAPResponseCode.OK) {
    throw new Error(`Failed to fetch products: code ${responseCode}`);
  }
  return results.map((product) => ({
    productId: product.productId,
    title: product.title,
    description: product.description,
    priceString: product.priceString,
  }));
}

export async function requestPurchase(productId: string) {
  if (!InAppPurchases) {
    throw new Error('課金モジュールが利用できません。');
  }
  return InAppPurchases.requestPurchaseAsync(productId);
}

export async function finishTransaction(purchase: ExpoInAppPurchases.InAppPurchase) {
  if (!InAppPurchases) {
    return;
  }
  const shouldConsume = CONSUMABLE_PRODUCTS.has(purchase.productId);
  await InAppPurchases.finishTransactionAsync(purchase, shouldConsume);
}

export async function getPurchaseHistory() {
  if (!InAppPurchases) {
    return [];
  }
  const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync(true);
  if (responseCode !== InAppPurchases.IAPResponseCode.OK) {
    throw new Error(`Failed to restore purchases: code ${responseCode}`);
  }
  return results ?? [];
}

export type PurchaseModule = typeof ExpoInAppPurchases;
export function getPurchaseModule(): PurchaseModule | undefined {
  return InAppPurchases;
}
