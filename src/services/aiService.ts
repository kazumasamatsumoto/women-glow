type Mood = '落ち込み' | '普通' | '前向き';

const fallbackResponses: Record<Mood, string[]> = {
  落ち込み: [
    'つらい気持ちを抱えながら、ここまで来たあなたはとても強い人です。',
    '無理しなくて大丈夫。今日はゆっくり、自分を甘やかしてね。',
  ],
  普通: [
    'ちょうどいいリズムで進めているね。この調子でゆっくり行きましょう。',
    '小さな幸せを見つける力を、あなたはすでに持っていますよ。',
  ],
  前向き: [
    'その前向きな気持ちが、あなたの周りにも優しさを広げていくはず。',
    'ワクワクが続きますように。あなたの笑顔が今日も輝きますように。',
  ],
};

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export async function fetchAIEncouragement(mood: Mood): Promise<string> {
  // TODO: Replace with actual OpenAI API call.
  return randomFrom(fallbackResponses[mood]);
}

export type { Mood };
