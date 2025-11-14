export type SupportedLocale = 'ja-JP' | 'zh-CN' | 'ko-KR';
export type Mood = '落ち込み' | '普通' | '前向き';

type TemplateBuckets = 'affirmation' | 'healing' | 'growth';

type LocaleConfig = {
  countryLabel: string;
  languageLabel: string;
  bannedPhrases: string[];
  templates: Record<TemplateBuckets, string[]>;
  moodToBucket: Record<Mood, TemplateBuckets>;
  moodLabels: Record<Mood, string>;
};

const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  'ja-JP': {
    countryLabel: '日本',
    languageLabel: '日本語',
    bannedPhrases: ['若くない', '行き遅れ', 'もう遅い', 'おばさん', '賞味期限', '結婚すべき', '出産しないと', '普通は家庭を持つ', '若い子には勝てない', '他の人はもう', 'あなたにも欠点があるけど', '誰でも老ける', 'かわいそう', '孤独でも頑張って', 'まだ間に合う', 'もう手遅れじゃない'],
    templates: {
      affirmation: ['今のあなたは、誰かの希望になっています。', '焦らずに、あなたのペースで歩いてください。', '経験を重ねるたびに、あなたの魅力は増しています。'],
      healing: ['今日は、頑張らない自分も褒めてあげてください。', '立ち止まることは、前に進む準備です。', '誰にも見えない努力を、私はちゃんと見ています。'],
      growth: ['30代・40代は、女性の人生が咲き誇る季節です。', 'これまでの経験が、あなたをいちばん美しくしています。', '今のあなたが一番、あなたらしい。'],
    },
    moodToBucket: {
      落ち込み: 'healing',
      普通: 'affirmation',
      前向き: 'growth',
    },
    moodLabels: {
      落ち込み: '落ち込み',
      普通: '普通',
      前向き: '前向き',
    },
  },
  'zh-CN': {
    countryLabel: '中国',
    languageLabel: '中文',
    bannedPhrases: ['老了', '过期', '剩下', '迟了', '该结婚', '没人要', '嫁不出去', '别人都', '不如别人', '孤单可怜', '太晚了', '普通', '没价值'],
    templates: {
      affirmation: ['你的经历，让你比从前更有力量。', '每一天，你都在成为更好的自己。', '你不是在迟到，而是在按自己的节奏前进。'],
      healing: ['别怕休息，停下来也是一种前进。', '幸福不是比较，而是内心的平静。'],
      growth: ['成熟让你更懂得爱自己。', '你的笑容，是岁月给你的礼物。'],
    },
    moodToBucket: {
      落ち込み: 'healing',
      普通: 'affirmation',
      前向き: 'growth',
    },
    moodLabels: {
      落ち込み: '情绪低落',
      普通: '平常心情',
      前向き: '积极心情',
    },
  },
  'ko-KR': {
    countryLabel: '韓国',
    languageLabel: '한국어',
    bannedPhrases: ['늙었다', '유통기한', '이제 늦었어요', '결혼해야죠', '남자 없으면 안돼요', '다른 사람은 벌써', '요즘 애들은', '혼자라서 외롭죠', '안됐어요', '여자치고', '그 나이에'],
    templates: {
      affirmation: ['당신은 이미 충분히 멋져요.', '다른 사람과 비교하지 마세요. 당신만의 길이에요.', '나이를 먹는 게 아니라, 깊어지는 거예요.'],
      healing: ['오늘은 그냥 쉬어도 괜찮아요.', '모든 순간이 당신을 더 단단하게 만들어요.'],
      growth: ['여자는 서른부터, 진짜로 빛나요.', '당신의 삶은 아직 시작이에요.'],
    },
    moodToBucket: {
      落ち込み: 'healing',
      普通: 'affirmation',
      前向き: 'growth',
    },
    moodLabels: {
      落ち込み: '기운이 가라앉음',
      普通: '보통 기분',
      前向き: '긍정적인 기분',
    },
  },
};

export const ASSISTANT_NAME = 'Glowガイド ひかり';
export const ASSISTANT_AVATAR = '🌸';
export const ASSISTANT_TAGLINE = 'あなたの心に寄り添う自己肯定感ナビゲーター';

export type ConversationTurn = {
  role: 'user' | 'assistant';
  content: string;
};

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type BuildChatMessagesParams = {
  locale: SupportedLocale;
  mood: Mood;
  age: number;
  userInput: string;
  conversation: ConversationTurn[];
};

export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return localeConfigs[locale];
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getTemplatesForMood(locale: SupportedLocale, mood: Mood): string[] {
  const config = getLocaleConfig(locale);
  const bucket = config.moodToBucket[mood];
  const templates = config.templates[bucket];
  return templates.length ? templates : [...config.templates.affirmation, ...config.templates.healing, ...config.templates.growth];
}

function buildSystemInstruction({ locale, mood, age }: BuildChatMessagesParams): string {
  const config = getLocaleConfig(locale);
  const moodLabel = config.moodLabels[mood];
  const bannedList = config.bannedPhrases.map((phrase) => `- ${phrase}`).join('\n');
  const templateCandidates = [
    ...config.templates.affirmation,
    ...config.templates.healing,
    ...config.templates.growth,
  ]
    .map((phrase) => `- ${phrase}`)
    .join('\n');

  return [
    `あなたは「${ASSISTANT_NAME}」というキャラクターです。${config.countryLabel}の女性に寄り添い、${config.languageLabel}で自己肯定感をそっと支えます。`,
    `口調は親しい友人のようにあたたかく、決して命令したり否定したりせず、相手の尊厳を守ってください。`,
    `ユーザーの属性：${config.countryLabel}／${age}歳／気分：${moodLabel}`,
    `禁止ワード（絶対に使わない）：\n${bannedList}`,
    `返答ルール：`,
    `- 肯定的でやさしい言葉にする`,
    `- 年齢や結婚、恋愛を否定的に扱わない`,
    `- 他人比較・期限を示唆しない`,
    `- 文章は1〜2文、合計で50〜90文字程度`,
    `- 顔文字や絵文字は多用せず、使う場合も1つまで`,
    `- 相手の感情を受け止めた上で、希望や安心を添える`,
    `参考テンプレート：\n${templateCandidates}`,
    `会話履歴を読み、最新のユーザー入力に応じた返答を生成してください。`,
  ].join('\n');
}

function formatConversation(conversation: ConversationTurn[]): ConversationTurn[] {
  return conversation
    .map((turn) => ({
      role: turn.role,
      content: turn.content.trim(),
    }))
    .filter((turn) => turn.content.length > 0);
}

export function buildChatMessages(params: BuildChatMessagesParams): OpenAIMessage[] {
  const { conversation, userInput } = params;
  const systemMessage = buildSystemInstruction(params);
  const history = formatConversation(conversation);
  const trimmedInput = userInput.trim();

  const chatHistory = history.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));

  return [
    { role: 'system' as const, content: systemMessage },
    ...chatHistory,
    { role: 'user' as const, content: trimmedInput },
  ];
}

export function buildFallbackMessage(locale: SupportedLocale, mood: Mood, userInput: string): string {
  const candidates = getTemplatesForMood(locale, mood);
  const base = randomFrom(candidates);
  const reflection = userInput.trim().length
    ? '\n\nあなたが打ち明けてくれた気持ちに寄り添いながら、ゆっくり歩いていきましょう。'
    : '';
  return `${base}${reflection}`;
}
