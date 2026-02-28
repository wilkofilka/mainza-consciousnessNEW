import { useState } from 'react';
import { ChatInterface } from '@/components/chatgpt/ChatInterface';
import { LoginButton } from '@/components/chatgpt/LoginButton';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
          <div>
            <h1 className="text-2xl font-semibold">Mainza ChatGPT Workspace</h1>
            <p className="text-sm text-muted-foreground">
              Zaloguj się, aby aktywować interfejs czatu i transport wiadomości.
            </p>
          </div>
          <LoginButton
            isLoggedIn={isLoggedIn}
            onLoginToggle={() => setIsLoggedIn((prev) => !prev)}
          />
        </header>

        <ChatInterface disabled={!isLoggedIn} />
      </div>
    </main>
  );
};

export default Index;
