import React, { useState, useEffect } from 'react';
import CrystalPackCard from './components/CrystalPackCard';
import { useTranslation } from './hooks/useTranslation';

const Crystals = () => {
  const { language } = useTranslation();
  const [crystals, setCrystals] = useState([]);
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

    // Загружаем кристаллы из API
    loadCrystals();
  }, []);

  const loadCrystals = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      console.log('🔄 Loading crystals from:', `${apiUrl}/crystals`);
      const response = await fetch(`${apiUrl}/crystals`);

      console.log('📥 Crystals response:', response.status, response.ok);

      if (!response.ok) {
        throw new Error(`Не удалось загрузить кристаллы: ${response.status}`);
      }

      const crystalsData = await response.json();
      console.log('💎 Loaded crystals:', crystalsData);
      setCrystals(crystalsData);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading crystals:', err);
      setError(err.message);
      
      // Fallback к тестовым данным
      const testCrystals = [
        {
          id: 'crystal_pack_small',
          name: '💎 Маленький пакет кристаллов',
          description: '50 дополнительных сообщений',
          price: 10,
          crystal_amount: 50,
          image: '',
          popular: false,
          best_value: false
        }
      ];
      setCrystals(testCrystals);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrystalSelect = async (crystalId) => {
    console.log('🎯 Crystal button clicked! ID:', crystalId, 'Chat ID:', chatId);
    
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;

        if (!chatId) {
          throw new Error('Chat ID not available');
        }

        console.log('Creating invoice for crystal:', crystalId, 'chat:', chatId);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/crystals/${crystalId}/invoice?chat_id=${chatId}`);

        if (!response.ok) {
          throw new Error('Не удалось создать инвойс для кристаллов');
        }

        const invoiceData = await response.json();
        console.log('Crystal invoice data:', invoiceData);

        if (invoiceData.error) {
          throw new Error(invoiceData.error);
        }

        const invoiceLink = invoiceData.invoice_link;
        if (!invoiceLink) {
          throw new Error('Не удалось получить ссылку на инвойс');
        }

        console.log('Opening crystal invoice:', invoiceLink);

        tg.openInvoice(invoiceLink, (status) => {
          console.log('Crystal payment status:', status);

          if (status === 'paid') {
            const crystal = crystals.find(c => c.id === crystalId);
            const successMessage = language === 'en' ? 
              `🎉 Payment successful! ${crystal?.crystal_amount} crystals purchased!` :
              `🎉 Оплата прошла успешно! ${crystal?.crystal_amount} кристаллов куплено!`;
            
            tg.showAlert(successMessage);
            
            setTimeout(() => {
              tg.close();
            }, 2000);
            
          } else if (status === 'cancelled') {
            const cancelMessage = language === 'en' ? 'Payment cancelled' : 'Оплата отменена';
            tg.showAlert(cancelMessage);
          } else if (status === 'failed') {
            const failMessage = language === 'en' ? 'Payment failed' : 'Ошибка оплаты';
            tg.showAlert(failMessage);
          }
        });

      } catch (error) {
        console.error('Error purchasing crystals:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">
            {language === 'en' ? 'Loading crystals...' : 'Загрузка кристаллов...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadCrystals}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            {language === 'en' ? 'Try Again' : 'Попробовать снова'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
          {language === 'en' ? '💎 Crystal Shop' : '💎 Магазин кристаллов'}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {language === 'en' ? 'Buy crystals to unlock more conversations' : 'Купите кристаллы для дополнительных сообщений'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {crystals.map(crystal => (
            <CrystalPackCard 
              key={crystal.id} 
              crystal={crystal} 
              onSelect={handleCrystalSelect}
            />
          ))}
        </div>

        {crystals.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-6xl mb-4">💎</div>
            <p className="text-xl">
              {language === 'en' ? 'No crystals available at the moment' : 'Кристаллы временно недоступны'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crystals;
