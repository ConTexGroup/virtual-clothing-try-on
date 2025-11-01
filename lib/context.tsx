/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    try {
      // Attempt to retrieve the key from session storage on initial load
      return sessionStorage.getItem('gemini-api-key');
    } catch (e) {
      console.error('Could not access session storage:', e);
      return null;
    }
  });

  const setApiKey = (key: string) => {
    try {
      // Persist the key to session storage
      sessionStorage.setItem('gemini-api-key', key);
      setApiKeyState(key);
    } catch (e) {
      console.error('Could not set item in session storage:', e);
      // Still set in state so the app can function
      setApiKeyState(key);
    }
  };

  return (
    <AppContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
