import React, { useState, useEffect } from 'react';
import GiftCard from './GiftCard';
import CrystalPackCard from './components/CrystalPackCard';
import { useTranslation } from './hooks/useTranslation';

const Gifts = () => {
  const { language } = useTranslation();
  const [gifts, setGifts] = useState([]);
  const [crystals, setCrystals] = useState([]);
  const [activeTab, setActiveTab] = useState('gifts');
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

    // Загружаем подарки и кристаллы из API
    loadGifts();
    loadCrystals();
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

  const loadCrystals = async () => {
    try {
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
    } catch (err) {
      console.error('❌ Error loading crystals:', err);
      
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

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {activeTab === 'gifts' 
            ? (language === 'en' ? '🎁 Gift Shop' : '🎁 Магазин подарков')
            : (language === 'en' ? '💎 Crystal Shop' : '💎 Магазин кристаллов')
          }
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {activeTab === 'gifts' 
            ? (language === 'en' ? 'Choose a gift to delight the character' : 'Выберите подарок, чтобы порадовать персонажа')
            : (language === 'en' ? 'Buy crystals to unlock more conversations' : 'Купите кристаллы для дополнительных сообщений')
          }
        </p>

        {/* Табы */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('gifts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'gifts'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎁 {language === 'en' ? 'Gifts' : 'Подарки'}
            </button>
            <button
              onClick={() => setActiveTab('crystals')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'crystals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💎 {language === 'en' ? 'Crystals' : 'Кристаллы'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {activeTab === 'gifts' 
            ? gifts.map(gift => (
                <GiftCard 
                  key={gift.id} 
                  gift={gift} 
                  showBuyButton={true}
                  onSelect={handleGiftSelect}
                />
              ))
            : crystals.map(crystal => (
                <CrystalPackCard 
                  key={crystal.id} 
                  crystal={crystal} 
                  onSelect={handleCrystalSelect}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default Gifts;
