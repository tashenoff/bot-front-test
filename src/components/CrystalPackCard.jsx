import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import LoadingButton from './LoadingButton';

const CrystalPackCard = ({ crystal, onSelect }) => {
  const { language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Определяем иконку и цвета в зависимости от пакета
  const getPackageConfig = () => {
    const amount = crystal.crystal_amount;
    
    if (amount <= 100) {
      return {
        icon: '⚡',
        name: language === 'en' ? 'Starter Pack' : 'Starter Pack',
        gradient: 'from-blue-600 to-cyan-500',
        glowColor: 'shadow-blue-500/30',
        borderColor: 'border-blue-400'
      };
    } else if (amount <= 500) {
      return {
        icon: '💎',
        name: language === 'en' ? 'Premium Pack' : 'Premium Pack',
        gradient: 'from-purple-600 to-pink-500',
        glowColor: 'shadow-purple-500/30',
        borderColor: 'border-purple-400'
      };
    } else if (amount <= 1000) {
      return {
        icon: '⭐',
        name: language === 'en' ? 'Ultimate Pack' : 'Ultimate Pack',
        gradient: 'from-yellow-500 to-orange-500',
        glowColor: 'shadow-yellow-500/30',
        borderColor: 'border-yellow-400'
      };
    } else {
      return {
        icon: '🎁',
        name: language === 'en' ? 'Crystal Pack' : 'Crystal Pack',
        gradient: 'from-red-500 to-pink-500',
        glowColor: 'shadow-red-500/30',
        borderColor: 'border-red-400'
      };
    }
  };

  const config = getPackageConfig();

  return (
    <div className="relative">
      
      <div className={`
        relative overflow-hidden rounded-2xl 
        bg-gradient-to-br ${config.gradient}
        ${config.borderColor} border-2
        shadow-2xl ${config.glowColor}
        hover:shadow-3xl hover:${config.glowColor}
        transform hover:scale-105 hover:-translate-y-2
        transition-all duration-300 ease-out
        min-h-[280px] w-full max-w-[200px] mx-auto
        group cursor-pointer
      `}>
        
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Основной контент */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          
          {/* Иконка */}
          <div className="flex justify-center mb-4">
            <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
              {config.icon}
            </div>
          </div>
          
          {/* Название пакета */}
          <h3 className="text-white text-lg font-bold text-center mb-2">
            {config.name}
          </h3>
          
          {/* Количество кристаллов */}
          <div className="text-center mb-4 flex-grow flex flex-col justify-center">
            <div className="text-3xl font-bold text-white mb-1">
              {crystal.crystal_amount}
            </div>
            <div className="text-white/80 text-sm flex items-center justify-center gap-1">
              <span>💎</span>
              <span>{language === 'en' ? 'crystals' : 'кристаллов'}</span>
            </div>
          </div>
          
          {/* Кнопка покупки */}
          <LoadingButton
            className={`
              w-full py-3 px-4 rounded-xl
              bg-red-500 hover:bg-red-600
              text-white font-bold text-sm uppercase tracking-wider
              transform hover:scale-105 active:scale-95
              transition-all duration-200
              shadow-lg hover:shadow-xl
              border-2 border-white/20
            `}
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                if (onSelect) {
                  await onSelect(crystal.id);
                }
              } finally {
                setIsLoading(false);
              }
            }}
            language={language}
          >
            {language === 'en' ? 'BUY' : 'КУПИТЬ'}
          </LoadingButton>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-2 left-2 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute bottom-4 right-2 w-6 h-6 bg-white/5 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default CrystalPackCard;
