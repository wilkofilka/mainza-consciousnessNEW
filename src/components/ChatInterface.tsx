import { FormEvent, useEffect, useState } from 'react';
import { attachToolResultListener, sendUserMessage, ToolResultNotification } from '@/lib/chatgptTransport';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const isDev = import.meta.env.DEV;

function devLog(message: string, payload?: unknown): void {
  if (!isDev) {
    return;
  }

  if (payload === undefined) {
    console.debug(`[ChatInterface] ${message}`);
    return;
  }

  console.debug(`[ChatInterface] ${message}`, payload);
}

export default function ChatInterface() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    return attachToolResultListener((notification: ToolResultNotification) => {
      const structuredContent = notification.params?.structuredContent;

      if (!structuredContent || typeof structuredContent !== 'object') {
        devLog('Ignored tool result without structuredContent', notification);
        return;
      }

      const messageText =
        typeof structuredContent.text === 'string' ? structuredContent.text.trim() : '';

      if (!messageText) {
        devLog('Ignored tool result with invalid text', notification);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: messageText,
        },
      ]);
    });
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    sendUserMessage(trimmed);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text: trimmed,
      },
    ]);

    setText('');
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1 space-y-2 overflow-y-auto rounded-lg border border-slate-700/50 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'ml-auto bg-cyan-500/20 text-cyan-100'
                : 'bg-slate-800 text-slate-100'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
