import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';

const Gifts = () => {
  const [gifts, setGifts] = useState([]);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    // Получаем chat_id из параметров URL
    const params = new URLSearchParams(window.location.search);
    const chat = params.get('chat_id');
    setChatId(chat);

    // Загружаем подарки
    fetch('/gifts.json')
      .then(response => response.json())
      .then(data => setGifts(data))
      .catch(error => console.error('Error loading gifts:', error));
  }, []);

  const handleGiftSelect = (giftId) => {
    // Отправляем данные о выбранном подарке обратно в бота через Telegram WebApp API
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify({ 
        type: 'gift_selected',
        gift_id: giftId,
        chat_id: chatId 
      }));
      // Закрываем webapp
      window.Telegram.WebApp.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🎁 Магазин подарков
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Выберите подарок, чтобы порадовать персонажа
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
