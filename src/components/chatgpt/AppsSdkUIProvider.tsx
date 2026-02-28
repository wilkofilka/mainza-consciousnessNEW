import { PropsWithChildren } from 'react';

/**
 * Izoluje kontekst Apps SDK UI od globalnych providerów aplikacji.
 * To miejsce na przyszłą integrację właściwego providera SDK.
 */
export const AppsSdkUIProvider = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};
