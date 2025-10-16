import { createContext, useContext, useState, useEffect } from 'react';

const AGE_VERIFICATION_KEY = 'ageVerificationStatus';

const AgeVerificationContext = createContext();

export const AgeVerificationProvider = ({ children }) => {
  const [isAdult, setIsAdult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedStatus = localStorage.getItem(AGE_VERIFICATION_KEY);
    
    if (savedStatus !== null) {
      setIsAdult(savedStatus === 'adult');
      setIsLoading(false);
    } else {
      setShowModal(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Sync localStorage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === AGE_VERIFICATION_KEY) {
        const newStatus = e.newValue;
        if (newStatus !== null) {
          setIsAdult(newStatus === 'adult');
          if (newStatus === 'adult') {
            setShowModal(false);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAgeConfirmation = (userIsAdult) => {
    const status = userIsAdult ? 'adult' : 'minor';
    localStorage.setItem(AGE_VERIFICATION_KEY, status);
    setIsAdult(userIsAdult);
    setShowModal(false);
  };

  const resetAgeVerification = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsAdult(null);
    setShowModal(true);
  };

  const getAgeStatus = () => {
    if (isLoading) return 'loading';
    if (isAdult === null) return 'pending';
    return isAdult ? 'adult' : 'minor';
  };

  const value = {
    isAdult,
    showModal,
    isLoading,
    ageStatus: getAgeStatus(),
    handleAgeConfirmation,
    resetAgeVerification,
    includeAdultContent: isAdult === true,
    isReady: !isLoading && isAdult !== null,
    setShowModal // Expose for App to control modal
  };

  return (
    <AgeVerificationContext.Provider value={value}>
      {children}
    </AgeVerificationContext.Provider>
  );
};

export const useAgeVerification = () => {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error('useAgeVerification must be used within AgeVerificationProvider');
  }
  return context;
};

export default AgeVerificationContext;
