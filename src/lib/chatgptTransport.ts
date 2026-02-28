export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

type MessageListener = (message: ChatMessage) => void;

const transportEmitter = new EventTarget();

const emitMessage = (message: ChatMessage) => {
  transportEmitter.dispatchEvent(
    new CustomEvent<ChatMessage>('chatgpt:message', { detail: message }),
  );
};

const createMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export const sendMessage = async (content: string): Promise<ChatMessage> => {
  const userMessage = createMessage('user', content);
  emitMessage(userMessage);

  try {
    const response = await fetch('/agent/router/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: content,
        user_id: 'chatgpt-ui-user',
      }),
    });

    if (!response.ok) {
      throw new Error(`Transport request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const assistantMessage = createMessage(
      'assistant',
      payload.response ?? 'Brak odpowiedzi z backendu.',
    );

    emitMessage(assistantMessage);
    return assistantMessage;
  } catch (error) {
    const assistantMessage = createMessage(
      'assistant',
      'Nie udało się połączyć z backendem. To odpowiedź lokalna fallback.',
    );

    emitMessage(assistantMessage);
    return assistantMessage;
  }
};

export const attachMessageListener = (listener: MessageListener) => {
  const eventListener: EventListener = (event) => {
    const customEvent = event as CustomEvent<ChatMessage>;
    listener(customEvent.detail);
  };

  transportEmitter.addEventListener('chatgpt:message', eventListener);

  return () => {
    transportEmitter.removeEventListener('chatgpt:message', eventListener);
  };
};
