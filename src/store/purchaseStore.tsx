import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  PRODUCT_IDS,
  PRODUCT_REWARDS,
  connectToStore,
  disconnectFromStore,
  fetchProducts,
  finishTransaction,
  getPurchaseHistory,
  isPurchaseSupported,
  requestPurchase,
  getPurchaseModule,
  type DisplayProduct,
  type PurchaseModule,
} from '../services/purchaseService';

type PurchaseContextValue = {
  isSupported: boolean;
  isLoading: boolean;
  isProcessingPurchase: boolean;
  products: DisplayProduct[];
  points: number;
  hasUnlimitedAccess: boolean;
  error?: string;
  refreshProducts: () => Promise<void>;
  initiatePurchase: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const PurchaseContext = createContext<PurchaseContextValue | undefined>(undefined);

export const PurchaseProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [points, setPoints] = useState(0);
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false);
  const [error, setError] = useState<string>();

  const applyReward = useCallback((productId: string) => {
    const reward = PRODUCT_REWARDS[productId];
    if (!reward) {
      return;
    }

    if (reward.points) {
      setPoints((prev) => prev + reward.points);
    }
    if (reward.grantUnlimited) {
      setHasUnlimitedAccess(true);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    if (!isPurchaseSupported) {
      return;
    }

    try {
      setError(undefined);
      const productIds = Object.values(PRODUCT_IDS);
      const fetchedProducts = await fetchProducts(productIds);
      setProducts(fetchedProducts);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    if (!isPurchaseSupported) {
      return;
    }

    try {
      setError(undefined);
      const history = await getPurchaseHistory();
      const hasUnlimited = history.some((purchase) => PRODUCT_REWARDS[purchase.productId]?.grantUnlimited);
      if (hasUnlimited) {
        setHasUnlimitedAccess(true);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const initiatePurchase = useCallback(async (productId: string) => {
    if (!isPurchaseSupported) {
      setError('このプラットフォームでは課金がサポートされていません。');
      return;
    }

    try {
      setError(undefined);
      setIsProcessingPurchase(true);
      await requestPurchase(productId);
    } catch (err) {
      setError((err as Error).message);
      setIsProcessingPurchase(false);
    }
  }, []);

  useEffect(() => {
    const purchaseModule = getPurchaseModule();
    type PurchaseListener = ReturnType<NonNullable<PurchaseModule>['setPurchaseListener']>;
    let listener: PurchaseListener | undefined;
    let isMounted = true;

    const setup = async () => {
      if (!isPurchaseSupported) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await connectToStore();
        await refreshProducts();
        listener = purchaseModule?.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
          if (!isMounted) {
            return;
          }

          setIsProcessingPurchase(false);

          if (responseCode === purchaseModule?.IAPResponseCode.OK && results?.length) {
            for (const purchase of results) {
              applyReward(purchase.productId);
              await finishTransaction(purchase);
            }
          } else if (responseCode === purchaseModule?.IAPResponseCode.USER_CANCELED) {
            // The user canceled the flow; nothing to do.
          } else if (errorCode) {
            setError(`購入処理に失敗しました (code: ${errorCode}).`);
          }
        });

        await restorePurchases();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setup();

    return () => {
      isMounted = false;
      listener?.remove();
      disconnectFromStore();
    };
  }, [applyReward, refreshProducts, restorePurchases]);

  const value = useMemo(
    () => ({
      isSupported: isPurchaseSupported,
      isLoading,
      isProcessingPurchase,
      products,
      points,
      hasUnlimitedAccess,
      error,
      refreshProducts,
      initiatePurchase,
      restorePurchases,
    }),
    [
      isLoading,
      isProcessingPurchase,
      products,
      points,
      hasUnlimitedAccess,
      error,
      refreshProducts,
      initiatePurchase,
      restorePurchases,
    ],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
};

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}
