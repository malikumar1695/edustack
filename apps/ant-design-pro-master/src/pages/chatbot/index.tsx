import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Bubble, Conversations, Sender, Think, XProvider } from '@ant-design/x';
import type {
  BubbleItemType,
  BubbleListProps,
} from '@ant-design/x/es/bubble/interface';
import XMarkdown from '@ant-design/x-markdown';
import { useXChat } from '@ant-design/x-sdk';
import { Avatar, Card } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ConversationItem, ParsedMessage } from './data';
import { createChatProvider } from './service';
import { useStyles } from './style';

const WELCOME_TEXT = '🤖 Hi, how can I help you?';

const TypewriterTitle: React.FC = () => {
  const { styles } = useStyles();
  const [index, setIndex] = useState(0);
  const done = index >= WELCOME_TEXT.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => {
        if (i >= WELCOME_TEXT.length) {
          clearInterval(timer);
          return i;
        }
        return i + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {WELCOME_TEXT.slice(0, index)}
      {!done && <span className={styles.cursor}>|</span>}
    </>
  );
};

const parser = (message: { content: string; role: string }): ParsedMessage => {
  const { content, role } = message;
  if (role !== 'assistant') return { role: 'user', content };

  const trimmed = content.trimStart();

  const fullMatch = trimmed.match(/^<think>([\s\S]*?)<\/think>([\s\S]*)$/);
  if (fullMatch) {
    return {
      role: 'assistant',
      thinkContent: fullMatch[1],
      content: fullMatch[2].trimStart(),
    };
  }

  const partialMatch = trimmed.match(/^<think>([\s\S]*)$/);
  if (partialMatch) {
    return { role: 'assistant', thinkContent: partialMatch[1], content: '' };
  }

  return { role: 'assistant', content };
};

const STREAMING_ACTIVE = { hasNextChunk: true, enableAnimation: true };
const STREAMING_IDLE = { hasNextChunk: false, enableAnimation: true };

const roleConfig: BubbleListProps['role'] = {
  user: {
    placement: 'end',
    avatar: <Avatar icon={<UserOutlined />} />,
  },
  ai: {
    placement: 'start',
    avatar: (
      <Avatar
        style={{
          background: 'transparent',
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🤖
      </Avatar>
    ),
    typing: { effect: 'typing', step: 2, interval: 20 },
    contentRender: (
      content: string,
      info: { status?: string; loading?: boolean },
    ) => {
      if (info?.loading || !content) return undefined;
      return (
        <XMarkdown
          streaming={
            info?.status === 'updating' ? STREAMING_ACTIVE : STREAMING_IDLE
          }
        >
          {content}
        </XMarkdown>
      );
    },
  },
};

const ChatbotPage: React.FC = () => {
  const { styles } = useStyles();
  const idCounter = useRef(0);
  const generateId = useCallback(() => `conv-${++idCounter.current}`, []);

  const [conversations, setConversations] = useState<ConversationItem[]>([
    { key: 'default', label: '💬 New Chat', group: 'Today', isDraft: true },
    {
      key: 'preset-1',
      label: '🧩 How do I do linked validation in an Ant Design Form?',
      group: 'Today',
    },
    {
      key: 'preset-2',
      label: '📋 How do I customize ProTable toolbar buttons?',
      group: 'Today',
    },
    {
      key: 'preset-3',
      label: '🎨 How do I implement dark theme switching with antd-style?',
      group: 'Yesterday',
    },
    {
      key: 'preset-4',
      label: '🗂️ How do I dynamically generate the ProLayout side menu?',
      group: 'Yesterday',
    },
    {
      key: 'preset-5',
      label: '📊 Ant Design Charts line chart data format',
      group: 'Yesterday',
    },
    {
      key: 'preset-6',
      label: '🚀 How do I connect Ant Design Pro to a backend permission system?',
      group: 'Earlier',
    },
    {
      key: 'preset-7',
      label: '🔍 How do I implement remote search for Select in ProForm?',
      group: 'Earlier',
    },
    {
      key: 'preset-8',
      label: '⚙️ Best practices for customizing themes with Ant Design Token',
      group: 'Earlier',
    },
  ]);
  const [activeKey, setActiveKey] = useState<string>('default');
  const [inputValue, setInputValue] = useState('');

  const provider = useMemo(() => createChatProvider() as any, []);
  const { onRequest, abort, isRequesting, parsedMessages } = useXChat<
    any,
    ParsedMessage
  >({
    provider,
    conversationKey: activeKey,
    parser,
    requestPlaceholder: { role: 'assistant', content: '' },
  });

  const sendMessage = (content: string) => {
    setInputValue('');
    setConversations((prev) =>
      prev.map((c) =>
        c.key === activeKey && c.isDraft
          ? { ...c, label: content.slice(0, 20), isDraft: false }
          : c,
      ),
    );
    onRequest({ messages: [{ role: 'user', content }] });
  };

  const newChat = () => {
    const key = generateId();
    setConversations((prev) => [
      { key, label: 'New Chat', group: 'Today', isDraft: true },
      ...prev,
    ]);
    setActiveKey(key);
  };

  const bubbleItems = useMemo<BubbleItemType[]>(
    () =>
      parsedMessages.map((msg) => {
        const parsed = msg.message as ParsedMessage;
        const isAI = parsed.role === 'assistant';
        const thinkContent =
          parsed.role === 'assistant' ? parsed.thinkContent : undefined;

        const item: BubbleItemType = {
          key: msg.id,
          role: isAI ? 'ai' : 'user',
          content: parsed.content,
          loading: isAI && msg.status === 'loading',
          status: msg.status,
        };

        if (isAI && thinkContent) {
          item.header = <Think>{thinkContent}</Think>;
        }

        return item;
      }),
    [parsedMessages],
  );

  const hasMessages = parsedMessages.length > 0;

  return (
    <PageContainer
      ghost
      childrenContentStyle={{
        paddingBlock: 0,
        height: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Card
        variant="borderless"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        styles={{
          body: {
            flex: 1,
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <XProvider>
          <div className={styles.layout}>
            <div className={styles.sidebar}>
              <Conversations
                items={conversations}
                activeKey={activeKey}
                onActiveChange={setActiveKey}
                groupable
                menu={(conversation) => ({
                  items: [{ key: 'delete', label: 'Delete', danger: true }],
                  onClick: ({ key }) => {
                    if (key === 'delete') {
                      setConversations((prev) => {
                        const next = prev.filter(
                          (c) => c.key !== conversation.key,
                        );
                        if (next.length === 0) {
                          const key = generateId();
                          next.push({
                            key,
                            label: '💬 New Chat',
                            group: 'Today',
                            isDraft: true,
                          });
                          setActiveKey(key);
                        } else if (activeKey === conversation.key) {
                          setActiveKey(next[0]?.key ?? '');
                        }
                        return next;
                      });
                    }
                  },
                })}
                creation={{ onClick: newChat, label: 'New Chat' }}
              />
            </div>

            <div className={styles.main}>
              {hasMessages && (
                <div className={styles.messages}>
                  <Bubble.List
                    items={bubbleItems}
                    role={roleConfig}
                    autoScroll
                    styles={{ root: { maxWidth: 940 } }}
                  />
                </div>
              )}

              <div
                className={hasMessages ? styles.footer : styles.footerCenter}
              >
                {!hasMessages && (
                  <div className={styles.welcomeTitle}>
                    <TypewriterTitle />
                  </div>
                )}
                <Sender
                  value={inputValue}
                  onChange={setInputValue}
                  loading={isRequesting}
                  onSubmit={sendMessage}
                  onCancel={abort}
                  placeholder="Type a message, press Enter to send..."
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  style={{ maxWidth: 940, width: '100%' }}
                  styles={{ input: { paddingBlock: 0 } }}
                />
              </div>
            </div>
          </div>
        </XProvider>
      </Card>
    </PageContainer>
  );
};

export default ChatbotPage;
