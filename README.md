# Women Glow App

Women Glow は、30〜40代の独身女性に寄り添い、毎日励ましの言葉を届けることを目的にした React Native (Expo) アプリです。ユーザーが入力した気持ちに合わせて AI が優しいメッセージを返してくれるチャット体験に特化しています。

## 主な機能

- 会話形式の励ましチャット（ムード／言語を選択して対話可能）
- OpenAI API キー未設定時のテンプレートフォールバック
- 日本語・中国語（簡体字）・韓国語に対応した文化配慮プロンプト

## 開発環境

- [Expo](https://expo.dev/) (React Native)
- TypeScript
- Node.js 18 以上推奨

## セットアップ

```bash
npm install
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
├── screens/
│   └── ChatScreen.tsx
└── services/
    ├── aiService.ts
    └── messagePrompt.ts
```

- `App.tsx`: エントリーポイント。SafeAreaProvider 配下で `ChatScreen` を描画します。
- `ChatScreen.tsx`: ユーザー入力欄・会話履歴・ムード／言語切り替えを備えたメイン画面。
- `aiService.ts`: OpenAI へのリクエストとテンプレートフォールバック処理。
- `messagePrompt.ts`: 文化配慮したプロンプト生成とフォールバック文言管理。

## 今後の拡張予定

- OpenAI API を用いた AI メッセージ生成の高度化
- 会話履歴の永続化とマルチデバイス同期
- プッシュ通知（`expo-notifications`）によるリマインダー配信
- Firebase などの分析／認証連携

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
