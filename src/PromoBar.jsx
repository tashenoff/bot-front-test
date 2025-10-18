import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';

const PromoBar = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/subscription');
  };

  return (
    <div 
      className="w-full bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 py-4 px-4 mb-6 cursor-pointer hover:from-red-500 hover:via-pink-500 hover:to-purple-500 transition-colors duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center text-center text-sm text-white">
        <span className="mr-2">🔥</span>
        <span className="mr-2">
          {language === 'en' ? 'Special offer: Premium for' : 'Специальная акция: Премиум за'}
        </span>
        <span className="text-yellow-300 font-semibold mr-2">100 ⭐</span>
        <span className="text-white">→</span>
      </div>
    </div>
  );
};

export default PromoBar;
