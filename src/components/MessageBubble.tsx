import React from 'react';
import { User, Bot } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function UserMessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow">
        <div className="mb-1 flex items-center justify-end gap-2 text-[11px] opacity-80">
          <span>You</span>
          <User className="h-3.5 w-3.5" />
        </div>
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

function AssistantMessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Bot className="h-3.5 w-3.5" />
          <span>Mainza</span>
        </div>
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return <UserMessageBubble message={message} />;
  }

  return <AssistantMessageBubble message={message} />;
}
