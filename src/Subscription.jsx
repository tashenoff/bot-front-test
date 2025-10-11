import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';

const Subscription = () => {
  const { language } = useTranslation();
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();
      
      // Получаем chat_id из Telegram WebApp API
      if (tg.initDataUnsafe?.chat?.id) {
        setChatId(tg.initDataUnsafe.chat.id);
        console.log('Chat ID from WebApp:', tg.initDataUnsafe.chat.id);
      } else if (tg.initDataUnsafe?.user?.id) {
        // Если chat недоступен, используем user id
        setChatId(tg.initDataUnsafe.user.id);
        console.log('User ID from WebApp:', tg.initDataUnsafe.user.id);
      }
    }

    // Попытка получить chat_id из параметров URL как запасной вариант
    const params = new URLSearchParams(window.location.search);
    const chatFromUrl = params.get('chat_id');
    if (chatFromUrl && !chatId) {
      setChatId(chatFromUrl);
      console.log('Chat ID from URL:', chatFromUrl);
    }
  }, []);

  const handleSubscriptionSelect = (subscriptionType) => {
    if (!chatId) {
      alert(language === 'en' ? 'Error: Could not determine user' : 'Ошибка: не удалось определить пользователя');
      return;
    }

    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        const botUsername = import.meta.env.VITE_BOT_USERNAME || 'your_bot';
        
        // Создаем deep link для возврата в бота с информацией о подписке
        const deepLink = `https://t.me/${botUsername}?start=subscription_${subscriptionType}_chat_${chatId}`;
        
        // Открываем deep link
        tg.openTelegramLink(deepLink);
        
        // Закрываем webapp
        setTimeout(() => {
          tg.close();
        }, 100);
        
      } catch (error) {
        console.error('Error selecting subscription:', error);
        alert(language === 'en' ? `Error: ${error.message}` : `Ошибка: ${error.message}`);
      }
    } else {
      alert(language === 'en' ? 'Telegram WebApp not available' : 'Telegram WebApp не доступен');
    }
  };

  return (
    <div className="min-h-[400px] bg-black text-white p-4">
      <div className="max-w-md mx-auto py-8">
        {/* Premium карточка */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ height: '680px' }}>
          {/* Фоновое изображение */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/images/premium.jpeg')",
              backgroundPosition: 'center 20%'
            }}
          />
          
          {/* Градиентный оверлей для лучшей читаемости */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Контент */}
          <div className="relative h-full flex flex-col justify-center items-start p-8">
            <div className="space-y-6 text-left">
              {/* Заголовок и преимущества */}
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-white leading-tight whitespace-pre-line">
                  {language === 'en' ? 'Premium\nMonth' : 'Премиум\nмесяц'}
                </h2>
                
                <div className="space-y-2 text-white text-base">
                  <p>{language === 'en' ? 'Exclusive characters' : 'Эксклюзивные персонажи'}</p>
                  <p>{language === 'en' ? 'Unlimited messaging' : 'Безлимитное общение'}</p>
                  <p>{language === 'en' ? 'Priority generation' : 'Приоритетная генерация'}</p>
                  <p>{language === 'en' ? 'Exclusive content' : 'Эксклюзивный контент'}</p>
                </div>
              </div>
              
              {/* Кнопка подписки */}
              <button
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 text-base"
                onClick={() => handleSubscriptionSelect('monthly')}
              >
                {language === 'en' ? 'Subscribe now' : 'Подписаться сейчас'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
