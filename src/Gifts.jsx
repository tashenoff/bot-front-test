import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';

const Gifts = () => {
  const [gifts, setGifts] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [debug, setDebug] = useState([]);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Скрываем MainButton по умолчанию
      tg.MainButton.hide();
      
      setDebug(prev => [...prev, 'WebApp initialized']);
      setDebug(prev => [...prev, `Platform: ${tg.platform}`]);
      setDebug(prev => [...prev, `Version: ${tg.version}`]);
    } else {
      setDebug(prev => [...prev, 'WebApp not available']);
    }

    // Получаем chat_id из параметров URL
    const params = new URLSearchParams(window.location.search);
    const chat = params.get('chat_id');
    setChatId(chat);
    setDebug(prev => [...prev, `Chat ID: ${chat}`]);

    // Загружаем подарки
    fetch('/gifts.json')
      .then(response => response.json())
      .then(data => {
        setGifts(data);
        setDebug(prev => [...prev, `Loaded ${data.length} gifts`]);
      })
      .catch(error => {
        console.error('Error loading gifts:', error);
        setDebug(prev => [...prev, `Error: ${error.message}`]);
      });
  }, []);

  const handleGiftSelect = (giftId) => {
    setDebug(prev => [...prev, `Selecting gift: ${giftId}`]);
    
    // Отправляем данные о выбранном подарке обратно в бота через Telegram WebApp API
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        const data = JSON.stringify({ 
          type: 'gift_selected',
          gift_id: giftId,
          chat_id: chatId 
        });
        
        setDebug(prev => [...prev, `Prepared data: ${data}`]);
        setDebug(prev => [...prev, `Data length: ${data.length}`]);
        
        // Проверяем, поддерживается ли sendData
        if (typeof tg.sendData === 'function') {
          setDebug(prev => [...prev, 'Calling sendData...']);
          tg.sendData(data);
          setDebug(prev => [...prev, 'sendData called successfully']);
        } else {
          setDebug(prev => [...prev, 'sendData not available!']);
          alert('Метод sendData недоступен. Версия WebApp: ' + tg.version);
          return;
        }
        
        // Закрываем webapp с небольшой задержкой
        setDebug(prev => [...prev, 'Closing in 500ms...']);
        setTimeout(() => {
          setDebug(prev => [...prev, 'Calling close...']);
          tg.close();
        }, 500);
        
      } catch (error) {
        setDebug(prev => [...prev, `Error: ${error.message}`]);
        setDebug(prev => [...prev, `Error stack: ${error.stack}`]);
        alert(`Ошибка: ${error.message}`);
      }
    } else {
      setDebug(prev => [...prev, 'WebApp not available!']);
      alert('Telegram WebApp не доступен. Debug: ' + debug.join(', '));
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
        
        {/* Debug info */}
        {debug.length > 0 && (
          <div className="mb-4 p-4 bg-gray-800 rounded text-xs">
            <div className="font-bold mb-2">Debug Info:</div>
            {debug.map((msg, i) => (
              <div key={i} className="text-gray-400">{msg}</div>
            ))}
          </div>
        )}
        
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
