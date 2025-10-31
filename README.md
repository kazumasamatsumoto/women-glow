# Women Glow App

Women Glow は、30〜40代の独身女性に寄り添い、毎日励ましの言葉を届けることを目的にした React Native (Expo) アプリです。無料で受け取れる固定メッセージに加えて、AI が気分に合わせたメッセージを生成する拡張機能を備えています。

## 主な機能

- ホーム画面での無料メッセージ表示（1 日 3 件まで）
- AI による励ましメッセージ生成（将来的にポイント制で提供予定）
- メッセージカード UI とやさしいピンク系カラーパレット

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

## プロジェクト構成

```
App.tsx
src/
├── screens/
│   └── HomeScreen.tsx
└── utils/
    └── messages.ts
```

- `App.tsx`: エントリーポイント。現在はホーム画面のみを表示します。
- `HomeScreen.tsx`: メッセージ一覧と AI ボタンがあるトップ画面。
- `messages.ts`: 無料メッセージと回数上限の定義。

## 今後の拡張予定

- OpenAI API を用いた AI メッセージ生成
- ポイント課金機能（`expo-in-app-purchases`）
- 通知機能（`expo-notifications`）
- Firebase 認証・分析連携

## 環境変数メモ

AI や Firebase を導入する際は、`.env` などに以下のようなキーを追加し、`expo-constants` や `react-native-config` で読み込む運用を想定しています。

```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
```

## ライセンス

このリポジトリのライセンスが未設定の場合は、利用前にプロジェクトオーナーへ確認してください。
