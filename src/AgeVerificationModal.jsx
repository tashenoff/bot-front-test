import React, { useState } from 'react';
import { useTranslation } from './hooks/useTranslation';

const AgeVerificationModal = ({ isOpen, onConfirm, onDecline }) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleDecline = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onDecline();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
      isAnimating ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className={`relative bg-gray-900 border border-purple-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur"></div>
        
        <div className="relative">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            {t('ageVerification.title', 'Подтверждение возраста')}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            {t('ageVerification.description', 'Некоторый контент может быть предназначен только для взрослых. Вам есть 18 лет?')}
          </p>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-300 text-sm">
                {t('ageVerification.warning', 'Если вам меньше 18 лет, контент для взрослых будет скрыт.')}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              {t('ageVerification.yes', 'Да, мне есть 18')}
            </button>
            
            <button
              onClick={handleDecline}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              {t('ageVerification.no', 'Нет, мне меньше 18')}
            </button>
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-xs text-center mt-4">
            {t('ageVerification.footer', 'Ваш выбор сохранится в настройках браузера')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
