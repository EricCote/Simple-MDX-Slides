//This language provider

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: string;
  languageList?: string[];
  // setCurrentLanguage: CallableFunction;
  // setLanguageList: CallableFunction;
}

interface LanguageContextType {
  currentLanguage?: string;
  languageList?: string[];
  setCurrentLanguage: CallableFunction;
  setLanguageList: CallableFunction;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export default function LanguageProvider({
  initialLanguage,
  children,
}: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(
    initialLanguage ?? navigator.language.slice(0, 2) === 'fr' ? 'fr' : 'en'
  );
  const [languageList, setLanguageList] = useState(['en', 'fr']);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageList,
        setCurrentLanguage,
        setLanguageList,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

type currentLanguage = [string | undefined, CallableFunction];

export function useLanguage(): currentLanguage {
  const context = useContext(LanguageContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error('useLanguage() was used outside of its Provider');
  }
  return [context.currentLanguage, context.setCurrentLanguage];
}

export function useLanguageList() {
  const context = useContext(LanguageContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error('useLanguageList() was used outside of its Provider');
  }
  return [context.languageList, context.setLanguageList];
}
