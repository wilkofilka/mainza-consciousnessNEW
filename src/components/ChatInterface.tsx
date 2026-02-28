import React, { useMemo, useState } from 'react';
import { AlertTriangle, Loader2, LogIn, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble, type ChatMessage } from '@/components/MessageBubble';

interface ChatApiResponse {
  response?: string;
}

type ChatError = 'transport' | 'unauthorized' | null;

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date(),
  };
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', 'Witaj! Jestem Mainza. Jak mogę Ci dziś pomóc?'),
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<ChatError>(null);

  const isSendDisabled = useMemo(() => isSending || input.trim().length === 0, [input, isSending]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    setInput('');
    setError(null);
    setIsSending(true);
    setMessages(prev => [...prev, createMessage('user', trimmed)]);

    try {
      const response = await fetch('/agent/router/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, user_id: 'mainza-user' }),
      });

      if (response.status === 401 || response.status === 403) {
        setError('unauthorized');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();
      const answer = data.response?.trim() || 'Brak treści odpowiedzi od modelu.';
      setMessages(prev => [...prev, createMessage('assistant', answer)]);
    } catch (sendError) {
      console.error('Transport error while sending chat message', sendError);
      setError('transport');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-background/60 backdrop-blur-sm">
      <ScrollArea className="h-[420px] px-4 py-4">
        <div className="space-y-3 pr-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && (
            <div className="flex items-center gap-2 pl-1 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Model przygotowuje odpowiedź…</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        {error === 'transport' && (
          <Alert variant="destructive" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Błąd transportu</AlertTitle>
            <AlertDescription>
              Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.
            </AlertDescription>
          </Alert>
        )}

        {error === 'unauthorized' && (
          <Alert className="mb-3 border-amber-500/50 bg-amber-500/10 text-amber-100 [&>svg]:text-amber-300">
            <LogIn className="h-4 w-4" />
            <AlertTitle>Brak autoryzacji</AlertTitle>
            <AlertDescription>
              Twoja sesja wygasła lub nie jesteś zalogowany. Zaloguj się ponownie, aby kontynuować.
            </AlertDescription>
          </Alert>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Napisz wiadomość do Mainza..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isSending}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSendDisabled}>
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4" />
                  Wyślij
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
