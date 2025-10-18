import React from 'react';
import { useTranslation } from './hooks/useTranslation';

const PromoBanner = () => {
  const { language } = useTranslation();
  const botUsername = import.meta.env.VITE_BOT_USERNAME;

  const handlePromoBannerClick = () => {
    const deepLink = `https://t.me/${botUsername}?start=promo_subscription`;
    window.open(deepLink, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div 
        className="relative rounded-xl overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 md:p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl"
        onClick={handlePromoBannerClick}
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 animate-pulse"></div>
        
        {/* Содержимое банера */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            {/* Бейдж акции */}
            <div className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 animate-bounce">
              🔥 {language === 'en' ? 'LIMITED OFFER' : 'ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ'}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {language === 'en' ? 'Special Promo!' : 'Специальная акция!'}
            </h2>
            
            <p className="text-xl md:text-2xl text-yellow-200 mb-2">
              {language === 'en' ? 'Premium subscription for just' : 'Премиум подписка всего за'}
            </p>
            
            {/* Цены */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="text-5xl font-bold text-yellow-300">
                100 ⭐
              </div>
              <div className="text-2xl text-gray-300 line-through opacity-75">
                500  ⭐
              </div>
            </div>
            
            <p className="text-lg text-white/90">
              {language === 'en' ? 'Full month access to all premium features!' : 'Полный месяц доступа ко всем премиум функциям!'}
            </p>
          </div>
          
          {/* CTA кнопка */}
          <div className="text-center">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-110 shadow-lg">
              {language === 'en' ? '⭐ Get Now!' : '⭐ Получить сейчас!'}
            </button>
            <p className="text-white/80 text-sm mt-2">
              {language === 'en' ? 'Limited time only!' : 'Только ограниченное время!'}
            </p>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-400/20 rounded-full translate-y-10 -translate-x-10"></div>
      </div>
    </div>
  );
};

export default PromoBanner;
