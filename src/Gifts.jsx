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
      
      // Сначала проверяем URL параметры (приоритет для WebApp)
      const params = new URLSearchParams(window.location.search);
      const urlChatId = params.get('chat_id');
      
      if (urlChatId) {
        setChatId(parseInt(urlChatId));
      } else {
        // Fallback: получаем из Telegram WebApp API
        const webAppUser = tg.initDataUnsafe?.user;
        const webAppChat = tg.initDataUnsafe?.chat;
        
        if (webAppChat) {
          setChatId(webAppChat.id);
        } else if (webAppUser) {
          setChatId(webAppUser.id);
        }
      }
    }

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
      setGifts([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGiftSelect = async (giftId) => {
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;

        // Проверяем, что у нас есть chat_id
        if (!chatId) {
          throw new Error('Chat ID not available');
        }

        console.log('Buying gift with crystals:', giftId, 'chat:', chatId);

        // Покупаем подарок за кристаллы через API
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/gifts/${giftId}/buy?chat_id=${chatId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const responseData = await response.json();
        console.log('Gift purchase response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.detail || 'Не удалось купить подарок');
        }

        // Покупка успешна
        if (responseData.success) {
          const successMessage = language === 'en' ? 
            `🎉 Gift purchased! "${responseData.gift_name}" bought for ${responseData.crystal_price} crystals!` :
            `🎉 Подарок куплен! "${responseData.gift_name}" за ${responseData.crystal_price} кристаллов!`;
          
          // Показываем уведомление через Telegram
          tg.showAlert(successMessage);
          
          // Закрываем WebApp через некоторое время
          setTimeout(() => {
            tg.close();
          }, 2000);
        }

      } catch (error) {
        console.error('Error purchasing gift:', error);
        const errorMessage = language === 'en' ? 
          `Error: ${error.message}` : 
          `Ошибка: ${error.message}`;
        
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } else {
      const noWebAppMessage = language === 'en' ? 
        'Telegram WebApp not available' : 
        'Telegram WebApp не доступен';
      alert(noWebAppMessage);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {language === 'en' ? '🎁 Gift Shop' : '🎁 Магазин подарков'}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {language === 'en' ? 'Choose a gift to delight the character' : 'Выберите подарок, чтобы порадовать персонажа'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {gifts.map(gift => (
            <GiftCard 
              key={gift.id} 
              gift={gift} 
              showBuyButton={true}
              onSelect={handleGiftSelect}
            />
          ))}
        </div>

        {gifts.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-xl">
              {language === 'en' ? 'No gifts available at the moment' : 'Подарки временно недоступны'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400 mt-8">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">
              {language === 'en' ? 'Loading gifts...' : 'Загрузка подарков...'}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 mt-8">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl mb-4">{error}</p>
            <button 
              onClick={loadGifts}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              {language === 'en' ? 'Try Again' : 'Попробовать снова'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gifts;
