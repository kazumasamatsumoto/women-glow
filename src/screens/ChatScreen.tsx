import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ASSISTANT_AVATAR,
  ASSISTANT_NAME,
  ASSISTANT_TAGLINE,
  fetchAIEncouragement,
  type ConversationTurn,
  type EncouragementResponse,
  type EncouragementSource,
  type Mood,
  type SupportedLocale,
} from '../services/aiService';

const moods: Mood[] = ['落ち込み', '普通', '前向き'];
const locales: Array<{ label: string; value: SupportedLocale }> = [
  { label: '日本語', value: 'ja-JP' },
  { label: '中文', value: 'zh-CN' },
  { label: '한국어', value: 'ko-KR' },
];

type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mood: Mood;
  locale: SupportedLocale;
  source?: EncouragementSource;
};

const MAX_HISTORY_FOR_PROMPT = 8;

export const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top + 48 : 0;
  const [selectedMood, setSelectedMood] = useState<Mood>('普通');
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('ja-JP');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!scrollViewRef.current) {
      return;
    }
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [conversation.length, isLoading]);

  const buildConversationTurns = (): ConversationTurn[] => {
    const sameLocaleHistory = conversation.filter((entry) => entry.locale === selectedLocale);
    const trimmedHistory = sameLocaleHistory.slice(-MAX_HISTORY_FOR_PROMPT);
    return trimmedHistory.map<ConversationTurn>(({ role, text }) => ({
      role,
      content: text,
    }));
  };

  const handleSend = async () => {
    if (isLoading) {
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: ConversationMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmed,
      mood: selectedMood,
      locale: selectedLocale,
    };

    const historyForPrompt = buildConversationTurns();

    setConversation((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(undefined);
    setNotice(undefined);

    try {
      const result: EncouragementResponse = await fetchAIEncouragement({
        mood: selectedMood,
        locale: selectedLocale,
        userInput: trimmed,
        conversation: historyForPrompt,
      });

      const assistantMessage: ConversationMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        text: result.message,
        mood: selectedMood,
        locale: selectedLocale,
        source: result.source,
      };

      setConversation((prev) => [...prev, assistantMessage]);
      setNotice(result.notice);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSendDisabled = !inputText.trim() || isLoading;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Text style={styles.title}>AI励ましチャット</Text>
          <Text style={styles.subtitle}>気持ちを伝えると、{ASSISTANT_NAME}がそっと寄り添う言葉を返してくれます。</Text>

          <View style={styles.characterCard}>
            <View style={styles.characterAvatar}>
              <Text style={styles.characterAvatarEmoji}>{ASSISTANT_AVATAR}</Text>
            </View>
            <View style={styles.characterTextBlock}>
              <Text style={styles.characterName}>{ASSISTANT_NAME}</Text>
              <Text style={styles.characterTagline}>{ASSISTANT_TAGLINE}</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>気分を選ぶ</Text>

          <View style={styles.moodRow}>
            {moods.map((mood) => {
              const isActive = selectedMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  activeOpacity={0.8}
                  style={[styles.moodChip, isActive ? styles.moodChipActive : undefined]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={[styles.moodChipText, isActive ? styles.moodChipTextActive : undefined]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>言語を選ぶ</Text>
          <View style={styles.moodRow}>
            {locales.map(({ label, value }) => {
              const isActive = selectedLocale === value;
              return (
                <TouchableOpacity
                  key={value}
                  activeOpacity={0.8}
                  style={[styles.moodChip, isActive ? styles.moodChipActive : undefined]}
                  onPress={() => setSelectedLocale(value)}
                >
                  <Text style={[styles.moodChipText, isActive ? styles.moodChipTextActive : undefined]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {notice ? (
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>お知らせ</Text>
              <Text style={styles.noticeText}>{notice}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.messagesContainer}>
            {conversation.length === 0 ? (
              <Text style={styles.placeholderText}>
                「最近仕事で落ち込んでるの」「もっと自信を持ちたい」など、感じていることを伝えてみましょう。
              </Text>
            ) : (
              conversation.map((message) => {
                if (message.role === 'assistant') {
                  return (
                    <View key={message.id} style={[styles.messageRow, styles.assistantRow]}>
                      <View style={styles.messageAvatar}>
                        <Text style={styles.messageAvatarEmoji}>{ASSISTANT_AVATAR}</Text>
                      </View>
                      <View style={[styles.messageBubble, styles.assistantBubble]}>
                        <Text style={styles.messageSpeaker}>{ASSISTANT_NAME}</Text>
                        <Text style={styles.messageBubbleText}>{message.text}</Text>
                        <Text style={styles.messageMeta}>
                          {message.source === 'openai' ? 'AI生成' : 'テンプレート'} / {message.locale} / {message.mood}
                        </Text>
                      </View>
                    </View>
                  );
                }

                return (
                  <View key={message.id} style={[styles.messageRow, styles.userRow]}>
                    <View style={[styles.messageBubble, styles.userBubble]}>
                      <Text style={styles.messageSpeaker}>あなた</Text>
                      <Text style={styles.messageBubbleTextUser}>{message.text}</Text>
                    </View>
                  </View>
                );
              })
            )}

            {isLoading ? (
              <View style={[styles.messageRow, styles.assistantRow]}>
                <View style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarEmoji}>{ASSISTANT_AVATAR}</Text>
                </View>
                <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
                  <ActivityIndicator color="#b85f8e" size="small" />
                  <Text style={styles.typingText}>考え中...</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.inputContainer, { paddingBottom: 12 + insets.bottom }]}>
          <TextInput
            style={[styles.inputField, { maxHeight: 160 }]}
            placeholder={`${ASSISTANT_NAME}に伝えたいことを入力`}
            placeholderTextColor="#c088a8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.sendButton, isSendDisabled ? styles.sendButtonDisabled : undefined]}
            onPress={handleSend}
            disabled={isSendDisabled}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>送信</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffe6f2',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#b85f8e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e5873',
    marginBottom: 24,
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d3e4',
    borderRadius: 18,
    padding: 16,
    marginBottom: 28,
  },
  characterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffe6f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  characterAvatarEmoji: {
    fontSize: 30,
  },
  characterTextBlock: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b85f8e',
    marginBottom: 4,
  },
  characterTagline: {
    fontSize: 14,
    color: '#8e5873',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e5873',
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodChip: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e69abf',
    alignItems: 'center',
  },
  moodChipActive: {
    backgroundColor: '#e69abf',
  },
  moodChipText: {
    color: '#b85f8e',
    fontWeight: '600',
  },
  moodChipTextActive: {
    color: '#fff',
  },
  noticeCard: {
    backgroundColor: '#fff7fb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5cce0',
    marginBottom: 16,
  },
  noticeTitle: {
    color: '#b85f8e',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  noticeText: {
    color: '#8e5873',
    fontSize: 13,
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: '#fce2e2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f5b5b5',
    marginBottom: 16,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 14,
    lineHeight: 20,
  },
  messagesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minHeight: 220,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholderText: {
    color: '#8e5873',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe6f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageAvatarEmoji: {
    fontSize: 22,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  assistantBubble: {
    backgroundColor: '#f8d3e4',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#c06292',
    borderTopRightRadius: 4,
  },
  messageSpeaker: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8e5873',
    marginBottom: 4,
  },
  messageBubbleText: {
    color: '#4a2f3b',
    fontSize: 15,
    lineHeight: 22,
  },
  messageBubbleTextUser: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  messageMeta: {
    marginTop: 8,
    fontSize: 11,
    color: '#8e5873',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#8e5873',
    fontSize: 12,
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#ffe6f2',
    borderTopWidth: 1,
    borderColor: '#f3c2d9',
  },
  inputField: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#4a2f3b',
    borderWidth: 1,
    borderColor: '#f3c2d9',
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#c06292',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
