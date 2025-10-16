import { useState, useEffect } from 'react';

const AGE_VERIFICATION_KEY = 'ageVerificationStatus';

export const useAgeVerification = () => {
  const [isAdult, setIsAdult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненные настройки при загрузке
    const savedStatus = localStorage.getItem(AGE_VERIFICATION_KEY);
    
    if (savedStatus !== null) {
      // Если настройки есть, используем их
      setIsAdult(savedStatus === 'adult');
      setIsLoading(false);
    } else {
      // Если настроек нет, показываем модальное окно
      setShowModal(true);
      setIsLoading(false);
    }
  }, []);

  const handleAgeConfirmation = (isUserAdult) => {
    // Сохраняем выбор пользователя
    const status = isUserAdult ? 'adult' : 'minor';
    localStorage.setItem(AGE_VERIFICATION_KEY, status);
    
    // Обновляем состояние
    setIsAdult(isUserAdult);
    setShowModal(false);
  };

  const resetAgeVerification = () => {
    // Очищаем сохраненные настройки (полезно для тестирования или сброса)
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsAdult(null);
    setShowModal(true);
  };

  const getAgeStatus = () => {
    if (isLoading) return 'loading';
    if (isAdult === null) return 'pending';
    return isAdult ? 'adult' : 'minor';
  };

  return {
    isAdult,
    showModal,
    isLoading,
    ageStatus: getAgeStatus(),
    handleAgeConfirmation,
    resetAgeVerification,
    // Флаг для фильтрации контента
    includeAdultContent: isAdult === true,
    // Флаг готовности системы
    isReady: !isLoading && isAdult !== null
  };
};

export default useAgeVerification;
