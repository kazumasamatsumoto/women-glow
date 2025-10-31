import Constants from 'expo-constants';

import { buildFallbackMessage, buildPrompt, type Mood, type SupportedLocale } from './messagePrompt';

type EncouragementParams = {
  mood: Mood;
  locale?: SupportedLocale;
  age?: number;
};

export type EncouragementSource = 'openai' | 'fallback';

export type EncouragementResponse = {
  message: string;
  source: EncouragementSource;
  notice?: string;
};

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_LOCALE: SupportedLocale = 'ja-JP';
const DEFAULT_AGE = 35;

function readApiKey(): string | undefined {
  const envKey =
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ??
    // @ts-expect-error expo-app-config typing does not include extra
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ??
    Constants?.manifest2?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;
  return typeof envKey === 'string' && envKey.length > 0 ? envKey : undefined;
}

export async function fetchAIEncouragement({
  mood,
  locale = DEFAULT_LOCALE,
  age = DEFAULT_AGE,
}: EncouragementParams): Promise<EncouragementResponse> {
  const prompt = buildPrompt(locale, mood, age);
  const apiKey = readApiKey();

  if (!apiKey) {
    return {
      message: buildFallbackMessage(locale, mood),
      source: 'fallback',
      notice: 'OpenAI APIキーが設定されていないため、テンプレートからメッセージを返しました。',
    };
  }

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: 'あなたは優しいカウンセラーです。女性の自己肯定感を高める言葉を作ります。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI APIから有効なメッセージが返りませんでした。');
    }

    return {
      message: content.trim(),
      source: 'openai',
    };
  } catch (error) {
    return {
      message: buildFallbackMessage(locale, mood),
      source: 'fallback',
      notice: `AIメッセージ生成でエラーが発生したため、テンプレートからメッセージを返しました。 (${(error as Error).message})`,
    };
  }
}

export type { Mood, SupportedLocale };
