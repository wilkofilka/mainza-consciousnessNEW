import { Button } from '@/components/ui/button';

interface LoginButtonProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export const LoginButton = ({ isLoggedIn, onLoginToggle }: LoginButtonProps) => {
  return (
    <Button onClick={onLoginToggle} variant={isLoggedIn ? 'secondary' : 'default'}>
      {isLoggedIn ? 'Wyloguj z ChatGPT UI' : 'Zaloguj do ChatGPT UI'}
    </Button>
  );
};
