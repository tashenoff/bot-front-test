import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';
import { useTranslation } from './hooks/useTranslation';
import giftsData from './data/gifts';

const Gifts = () => {
  const { language } = useTranslation();
  const [gifts, setGifts] = useState([]);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();
    }

    // Получаем chat_id из параметров URL
    const params = new URLSearchParams(window.location.search);
    const chat = params.get('chat_id');
    setChatId(chat);

    // Загружаем подарки из локальных данных
    setGifts(giftsData);
  }, []);

  const handleGiftSelect = (giftId) => {
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        const botUsername = import.meta.env.VITE_BOT_USERNAME || 'your_bot';
        
        // Создаем deep link для возврата в бота с информацией о подарке
        const deepLink = `https://t.me/${botUsername}?start=gift_${giftId}_chat_${chatId}`;
        
        // Открываем deep link
        tg.openTelegramLink(deepLink);
        
        // Закрываем webapp
        setTimeout(() => {
          tg.close();
        }, 100);
        
      } catch (error) {
        console.error('Error selecting gift:', error);
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
          {language === 'en' ? '🎁 Gift Shop' : '🎁 Магазин подарков'}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {language === 'en' ? 'Choose a gift to delight the character' : 'Выберите подарок, чтобы порадовать персонажа'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map(gift => (
            <GiftCard 
              key={gift.id} 
              gift={gift} 
              showBuyButton={true}
              onSelect={handleGiftSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gifts;
