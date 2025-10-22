import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import announcements from './data/announcements.json';

const PromoBanner = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();
  const botUsername = import.meta.env.VITE_BOT_USERNAME;
  const [isVisible, setIsVisible] = useState(true);

  // Проверяем наличие активных анонсов
  const activeAnnouncements = announcements.announcements.filter(announcement => {
    if (!announcement.active) return false;
    
    const now = new Date();
    const expiresDate = new Date(announcement.dateExpires);
    
    return now <= expiresDate;
  });

  const hasActiveAnnouncements = activeAnnouncements.length > 0;
  const currentAnnouncement = hasActiveAnnouncements ? activeAnnouncements[0] : null;

  const handlePromoBannerClick = () => {
    if (hasActiveAnnouncements && currentAnnouncement) {
      // Переходим на страницу анонса
      navigate(`/announcement/${currentAnnouncement.id}`);
    } else {
      // Стандартное поведение для премиума
      const deepLink = `https://t.me/${botUsername}?start=promo_subscription`;
      window.open(deepLink, '_blank');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  // Рендерим анонс, если есть активные анонсы
  if (hasActiveAnnouncements && currentAnnouncement) {
    const content = currentAnnouncement[language];
    
    return (
      <div className="w-full py-8">
        <div 
          className="relative rounded-xl overflow-hidden p-6 md:p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl"
          style={{
            backgroundImage: 'url(/images/rose_banner.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          onClick={handlePromoBannerClick}
        >
          {/* Темный оверлей для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-black/70"></div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200 z-20"
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Содержимое банера */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0 flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {content.title}
              </h2>
              
              <p className="text-lg md:text-xl text-white mb-4 drop-shadow-lg">
                {content.shortDescription}
              </p>
            </div>
            
            {/* CTA кнопка */}
            <div className="text-center">
              <button className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-6 rounded-full text-lg transition-all transform hover:scale-110 shadow-lg">
                {content.buttonText}
              </button>
            </div>
          </div>
          
          {/* Декоративные элементы */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/20 rounded-full translate-y-10 -translate-x-10"></div>
        </div>
      </div>
    );
  }

  // Стандартный промо-банер для премиума
  return (
    <div className="w-full py-8">
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
                500 ⭐
              </div>
              <div className="text-2xl text-gray-300 line-through opacity-75">
                1000  ⭐
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
