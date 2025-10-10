import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Получаем сохраненный язык из localStorage или используем русский по умолчанию
    return localStorage.getItem('language') || 'ru';
  });

  useEffect(() => {
    // Сохраняем язык в localStorage при изменении
    localStorage.setItem('language', language);
  }, [language]);

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
