# Women Glow App

Women Glow は、30〜40代の独身女性に寄り添い、毎日励ましの言葉を届けることを目的にした React Native (Expo) アプリです。無料で受け取れる固定メッセージに加えて、AI が気分に合わせたメッセージを生成する拡張機能を備えています。

## 主な機能

- トップ画面での無料メッセージ表示とステータス確認
- AI 励ましチャット画面でのムード選択＆メッセージ生成（ダミー実装）
- 課金画面でのポイント・プラン購入 UI（Expo Go ではデモ表示）

## 開発環境

- [Expo](https://expo.dev/) (React Native)
- TypeScript
- Node.js 18 以上推奨

## セットアップ

```bash
npm install
# ネットワーク環境に応じて以下も実行してください
npx expo install expo-in-app-purchases @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
npx expo start
```

ブラウザで立ち上がる Expo Dev Tools から、シミュレータまたは Expo Go (iOS / Android) に接続して動作確認できます。

### OpenAI API キーの設定

1. `.env.example` を `.env` にコピーします。
   ```bash
   cp .env.example .env
   ```
2. `.env` 内の `EXPO_PUBLIC_OPENAI_API_KEY` に OpenAI のシークレットキーを貼り付けます。
3. `npx expo start --clear` を実行してバンドラーを再起動すると、チャット画面でリアルな AI 応答が得られます（未設定時はテンプレートメッセージにフォールバックします）。

## プロジェクト構成

```
App.tsx
src/
├── navigation/
│   └── RootNavigator.tsx
├── screens/
│   ├── ChatScreen.tsx
│   ├── HomeScreen.tsx
│   └── PurchaseScreen.tsx
├── services/
│   ├── aiService.ts
│   └── purchaseService.ts
└── utils/
    └── messages.ts
└── store/
    └── purchaseStore.tsx
```

- `App.tsx`: エントリーポイント。課金プロバイダとタブナビゲーションを初期化します。
- `RootNavigator.tsx`: Bottom Tab ナビゲーションの定義（トップ・チャット・課金）。
- `HomeScreen.tsx`: メッセージ一覧とステータスを表示するトップ画面。
- `ChatScreen.tsx`: ムードを選んで励ましメッセージを受け取るチャット画面。
- `PurchaseScreen.tsx`: 課金 UI をまとめた画面。Expo Go ではダミー表示のみになります。
- `aiService.ts`: AI 連携のダミー実装（OpenAI 接続の置き換え予定）。
- `purchaseService.ts`: Expo In-App Purchases とのやり取り用ヘルパー。
- `purchaseStore.tsx`: 課金状態を管理する React コンテキスト。
- `messages.ts`: 無料メッセージと回数上限の定義。

## 今後の拡張予定

- OpenAI API を用いた AI メッセージ生成（現在はダミー）
- ポイント課金機能（`expo-in-app-purchases` のネイティブ検証 / サーバー検証）
- 通知機能（`expo-notifications`）
- Firebase 認証・分析連携

## 環境変数メモ

AI や Firebase を導入する際は、`.env` などに以下のようなキーを追加し、`expo-constants` や `react-native-config` で読み込む運用を想定しています。

```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
APPLE_SHARED_SECRET=your_app_store_shared_secret
GOOGLE_SERVICE_KEY_JSON=path_to_google_play_service_key
```

`app.config.js` が `.env` を読み込み、Expo の `extra` に値を渡します。`EXPO_PUBLIC_OPENAI_API_KEY` を設定するとチャット画面から OpenAI API (gpt-4o-mini) を通じてメッセージが生成され、未設定時はテンプレートベースの文を返します。

## ライセンス

このリポジトリのライセンスが未設定の場合は、利用前にプロジェクトオーナーへ確認してください。
