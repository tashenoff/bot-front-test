import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';
import { useTranslation } from './hooks/useTranslation';

const Gifts = () => {
  const { language } = useTranslation();
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

    // Загружаем подарки из API
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/gifts`);

      if (!response.ok) {
        throw new Error('Не удалось загрузить подарки');
      }

      const giftsData = await response.json();
      setGifts(giftsData);
      setError(null);
    } catch (err) {
      console.error('Error loading gifts:', err);
      setError(err.message);

      // Fallback к локальным данным при ошибке API
      try {
        const giftsData = (await import('./data/gifts')).default;
        setGifts(giftsData);
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
        setGifts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiftSelect = async (giftId) => {
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;

        // Получаем данные подарка из API
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/gifts/${giftId}/invoice?chat_id=${chatId}`);

        if (!response.ok) {
          throw new Error('Не удалось получить данные подарка');
        }

        const giftData = await response.json();

        console.log('Gift data:', giftData);

        // Отправляем данные боту через WebApp
        tg.sendData(JSON.stringify(giftData));

        // Закрываем WebApp
        tg.close();

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
