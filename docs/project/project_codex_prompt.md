# 📘 `project_codex_prompt.md`

````markdown
# 🌸 Women Glow App — AIで女性を励ますReact Nativeアプリ

## 🎯 PURPOSE (プロジェクトの目的)

社会の中で「30代・40代の独身女性」は、結婚や年齢に関して否定的な言葉を受けやすい。
このアプリはそんな女性たちに「あなたはまだまだ輝ける」「今が一番美しい」という励ましを届ける。

ユーザーがアプリを開くと、AIまたは固定メッセージで温かい言葉が表示される。
目的は「自己肯定感の回復」「安心できる体験の提供」。

---

## ⚙️ REQUIREMENTS (実装要件)

**Platform:** React Native (Expo) + TypeScript  
**Target:** iOS / Android 両対応  
**Style:** シンプル・優しいUI（ピンク系パレット）

---

## 🧱 MAIN FEATURES (主要機能)

1. **無料メッセージ機能**
   - 1日3回まで固定メッセージを受け取れる。
   - メッセージはアプリ内配列またはFirestoreから取得。

2. **AI励ましメッセージ (有料)**
   - OpenAI APIを使って、その日の気分に合わせた言葉を生成。
   - 気分は3択：「落ち込み」「普通」「前向き」。

3. **ポイント課金システム**
   - 無料ユーザーは1日3回まで。
   - 有料ユーザーはポイント購入で追加メッセージを取得。
   - 価格例：10P＝¥120、無制限プラン¥480/月。

4. **お気に入り機能**
   - ユーザーが気に入ったメッセージをローカルに保存。

5. **通知**
   - 朝9時、夜21時に“今日のひとこと”通知を送信。

6. **設定画面**
   - テーマ変更・通知ON/OFF・利用規約表示。

---

## 🧩 TECH STACK

| 領域 | 使用技術 |
|------|-----------|
| UI | React Native (Expo) |
| 言語 | TypeScript |
| 状態管理 | Zustand または React Context |
| API | OpenAI GPT API (text generation) |
| 課金 | expo-in-app-purchases |
| 通知 | expo-notifications |
| 認証 | Firebase Auth |
| データ | Firestore |
| 分析 | Firebase Analytics |

---

## 📱 SCREEN STRUCTURE (画面構成)

| 画面 | 説明 |
|------|------|
| SplashScreen | 起動時のアニメーション。「今日もよく生きてるね」 |
| HomeScreen | 今日のメッセージ3件を表示（無料） |
| MessageDetailScreen | AI生成メッセージ（ポイント消費） |
| PurchaseScreen | ポイント購入画面 |
| SettingsScreen | 通知・テーマ・法的情報 |

---

## 💬 SAMPLE MESSAGES

```ts
const messages = [
  "あなたは今日もよく頑張ってるね 🌸",
  "焦らなくていいよ。ゆっくりで大丈夫。",
  "30代・40代こそ、一番深みが出る時期だよ。",
  "誰かの期待じゃなく、自分の希望で生きよう。",
];
````

---

## 🧠 AI MESSAGE GENERATION LOGIC (擬似コード)

```ts
async function getAIMessage(mood: "sad" | "neutral" | "positive") {
  const prompt = `あなたは優しいカウンセラーです。30代・40代の女性を励ます文章を50文字以内で書いてください。テーマは「${mood}」な気持ちです。`;
  const res = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return res.data.choices[0].message.content;
}
```

---

## 🪙 POINT SYSTEM (擬似コード)

```ts
// 初期ポイント（無料）
let points = 3;

// メッセージ表示関数
function showMessage() {
  if (points > 0) {
    points -= 1;
    displayNextMessage();
  } else {
    alert("ポイントが足りません。購入しますか？");
  }
}

// 課金処理
import * as InAppPurchases from "expo-in-app-purchases";
```

---

## 🖋 UI STYLE GUIDE

* 背景：`#ffe6f2`
* メインカラー：`#e69abf`
* フォント：Noto Sans JP
* レイアウト：中央寄せ、縦スクロール対応
* アニメーション：Lottieを使用（花びら・光の演出）

---

## 🔐 LEGAL & ETHICAL GUIDELINES

* 医療行為・心理療法を提供しない。
* 比較・差別的な言葉は使用しない。
* 「AI生成であること」を明記。
* 個人情報はFirebase経由で安全に管理。

---

## 💰 PRICING MODEL (App内課金)

| プラン    | 内容         | 価格     |
| ------ | ---------- | ------ |
| 無料プラン  | 1日3メッセージまで | ¥0     |
| ポイント制  | 10ポイント購入   | ¥120   |
| 無制限プラン | 月額サブスク     | ¥480/月 |

---

## 🧭 DEVELOPMENT TASKS (実装ステップ)

1. Expoプロジェクトを作成

   ```bash
   npx create-expo-app women-glow --template
   ```
2. TypeScript対応設定
3. Home画面とAIメッセージ機能を実装
4. 課金機能（expo-in-app-purchases）追加
5. 通知（expo-notifications）実装
6. Firebase連携で認証・分析
7. App Store / Google Play リリース設定

---

## 🧱 FOLDER STRUCTURE (提案)

```
women-glow/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── MessageDetailScreen.tsx
│   │   ├── PurchaseScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── MessageCard.tsx
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── services/
│   │   ├── aiService.ts
│   │   ├── purchaseService.ts
│   │   └── notificationService.ts
│   ├── store/
│   │   └── userStore.ts
│   └── utils/
│       └── constants.ts
└── app.json
```

---

## 📦 INSTALL COMMANDS

```bash
npm install expo-in-app-purchases expo-notifications firebase openai
```

---

## ✅ DELIVERABLES (Codexに期待する出力)

* React Native (Expo) プロジェクト初期構成
* 各画面ファイルと最小限のUIコード
* AIメッセージ生成関数（OpenAI API）
* ポイント消費ロジック（ダミーでOK）
* 課金機能スタブ
* READMEにビルド手順と説明コメントを含む


