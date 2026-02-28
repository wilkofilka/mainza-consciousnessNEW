import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/chatgptTransport';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
        )}
      >
        <p>{message.content}</p>
        <p className="mt-1 text-[10px] opacity-70">
          {new Date(message.createdAt).toLocaleTimeString('pl-PL')}
        </p>
      </div>
    </div>
  );
};
