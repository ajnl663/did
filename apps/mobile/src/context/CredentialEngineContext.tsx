import { createContext, useContext, ReactNode } from 'react';
import { CredentialEngine } from '@did-workers/credential-engine';

interface CredentialEngineContextType {
  engine: CredentialEngine;
}

const CredentialEngineContext = createContext<CredentialEngineContextType | null>(null);

export function CredentialEngineProvider({ children, engine }: { children: ReactNode; engine: CredentialEngine }) {
  return (
    <CredentialEngineContext.Provider value={{ engine }}>
      {children}
    </CredentialEngineContext.Provider>
  );
}

export function useCredentialEngine(): CredentialEngine {
  const context = useContext(CredentialEngineContext);
  if (!context) {
    throw new Error('useCredentialEngine must be used within a CredentialEngineProvider');
  }
  return context.engine;
}