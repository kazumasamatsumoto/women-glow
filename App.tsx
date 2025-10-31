import React from 'react';

import { PurchaseProvider } from './src/store/purchaseStore';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <PurchaseProvider>
      <RootNavigator />
    </PurchaseProvider>
  );
}
