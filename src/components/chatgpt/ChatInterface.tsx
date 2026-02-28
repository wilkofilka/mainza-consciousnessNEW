import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { attachMessageListener, sendMessage, type ChatMessage } from '@/lib/chatgptTransport';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  disabled?: boolean;
}

export const ChatInterface = ({ disabled = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const detach = attachMessageListener((message) => {
      setMessages((prev) => [...prev, message]);
    });

    return detach;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.trim() || isSending || disabled) {
      return;
    }

    const content = draft.trim();
    setDraft('');
    setIsSending(true);

    try {
      await sendMessage(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Rozpocznij rozmowę, aby zobaczyć wiadomości.</p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={disabled ? 'Najpierw zaloguj się...' : 'Napisz wiadomość...'}
          disabled={disabled || isSending}
        />
        <Button type="submit" disabled={disabled || isSending || !draft.trim()}>
          {isSending ? 'Wysyłanie...' : 'Wyślij'}
        </Button>
      </form>
    </div>
  );
};
