import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';
import { useTranslation } from './hooks/useTranslation';

const Gifts = () => {
  const { language } = useTranslation();
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-4), `${timestamp}: ${message}`]);
  };

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
    addLog(`🎁 Выбран подарок: ${giftId}, chatId: ${chatId}`);
    
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        addLog('✅ Telegram WebApp доступен');

        // Получаем данные подарка из API
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        addLog(`📡 Запрос к API: ${apiUrl}/gifts/${giftId}/invoice?chat_id=${chatId}`);
        
        const response = await fetch(`${apiUrl}/gifts/${giftId}/invoice?chat_id=${chatId}`);

        if (!response.ok) {
          addLog(`❌ API ошибка: ${response.status} ${response.statusText}`);
          throw new Error('Не удалось получить данные подарка');
        }

        const giftData = await response.json();
        addLog(`✅ Данные получены: ${JSON.stringify(giftData)}`);

        // ПРАВИЛЬНЫЙ способ: сохраняем данные и показываем MainButton
        window.giftDataToSend = JSON.stringify(giftData);
        
        // Настраиваем MainButton
        tg.MainButton.setText('💳 Купить подарок');
        tg.MainButton.show();
        tg.MainButton.enable();
        
        // Обработчик для MainButton
        tg.MainButton.onClick(() => {
          addLog('📤 MainButton нажат, отправляю данные...');
          tg.sendData(window.giftDataToSend);
        });
        
        addLog('✅ MainButton показан. Нажми "Купить подарок" для отправки данных боту.');
        
      } catch (error) {
        addLog(`❌ Ошибка: ${error.message}`);
        alert(language === 'en' ? `Error: ${error.message}` : `Ошибка: ${error.message}`);
      }
    } else {
      addLog('❌ Telegram WebApp недоступен');
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
        
        {/* Debug панель - показываем только если есть логи */}
        {debugLogs.length > 0 && (
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-green-400">🔍 Debug логи:</h3>
            <div className="space-y-1 text-sm font-mono">
              {debugLogs.map((log, index) => (
                <div key={index} className="text-gray-300 bg-gray-800 px-3 py-1 rounded">
                  {log}
                </div>
              ))}
            </div>
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
