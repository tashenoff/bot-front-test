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
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {language === 'en' ? '⭐ Premium Subscription' : '⭐ Премиум подписка'}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {language === 'en' ? 'Get access to exclusive characters and features' : 'Получите доступ к эксклюзивным персонажам и функциям'}
        </p>

        {/* Месячная подписка */}
        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
          <div className="bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:bg-gray-800 transition-colors relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
            <div className="relative p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {language === 'en' ? 'Premium Month' : 'Премиум месяц'}
              </h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                199 ⭐
              </div>
              <div className="text-gray-300 text-sm mb-6 space-y-2">
                <p>🎮 {language === 'en' ? 'Exclusive characters' : 'Эксклюзивные персонажи'}</p>
                <p>💬 {language === 'en' ? 'Unlimited messaging' : 'Безлимитное общение'}</p>
                <p>🎨 {language === 'en' ? 'Priority generation' : 'Приоритетная генерация'}</p>
                <p>🔥 {language === 'en' ? 'Exclusive content' : 'Эксклюзивный контент'}</p>
              </div>
              <button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                onClick={() => handleSubscriptionSelect('monthly')}
              >
                {language === 'en' ? '⭐ Subscribe Now' : '⭐ Подписаться сейчас'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
