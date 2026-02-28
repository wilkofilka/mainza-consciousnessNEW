import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthSessionProvider } from './context/AuthSessionContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthSessionProvider>
    <App />
  </AuthSessionProvider>
);
