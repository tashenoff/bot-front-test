import React, { useState, useEffect, useCallback, memo } from 'react';
import LazyImage from './LazyImage';
import { useTranslation } from '../hooks/useTranslation';

// Мемоизированный компонент для элемента одежды
const ClothingItem = memo(({ item, isSelected, onSelect, onPurchase, apiUrl, userId }) => {
  const { t, language } = useTranslation();
  const [purchasing, setPurchasing] = useState(false);

  const handleSelect = useCallback(() => {
    if (item.is_available) {
      onSelect(item.id);
    }
  }, [item.id, item.is_available, onSelect]);

  const handlePurchase = useCallback(async () => {
    setPurchasing(true);
    try {
      await onPurchase(item.id);
    } finally {
      setPurchasing(false);
    }
  }, [item.id, onPurchase]);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiUrl}${imagePath}`;
  }, [apiUrl]);

  return (
    <div className={`
      bg-gray-900 p-4 rounded-lg border-2 transition-all cursor-pointer
      ${isSelected 
        ? 'border-purple-500 bg-purple-900/20' 
        : item.is_available 
          ? 'border-gray-700 hover:border-gray-600' 
          : 'border-gray-800 opacity-60'
      }
    `}>
      {/* Превью изображения */}
      <div className="relative mb-3">
        <LazyImage 
          src={getImageUrl(item.preview_url)}
          alt={item.name}
          className="w-full h-32 object-cover rounded-lg"
          loadingClassName="w-full h-32 bg-gray-700 rounded-lg animate-pulse"
          placeholder={
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 text-xs">{t('loading')}</span>
            </div>
          }
        />
        
        {/* Бейдж премиум */}
        {item.is_premium && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
            ⭐ {t('premium')}
          </div>
        )}
        
        {/* Бейдж выбрано */}
        {isSelected && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            ✓ {t('selected')}
          </div>
        )}
      </div>

      {/* Информация об одежде */}
      <div className="mb-3">
        <h4 className="font-bold text-sm mb-1 text-white">{item.name}</h4>
        <p className="text-gray-400 text-xs line-clamp-2">{item.description}</p>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-2">
        {item.is_available ? (
          <button
            onClick={handleSelect}
            className={`
              w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors
              ${isSelected 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
              }
            `}
          >
            {isSelected ? t('selectedClothing') : t('selectClothing')}
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white transition-colors"
          >
            {purchasing ? t('purchasing') : t('buyClothing').replace('{price}', item.price_crystals || 50)}
          </button>
        )}
      </div>
    </div>
  );
});

const ClothingSelector = ({ characterId, userId, botUsername }) => {
  const { t, language } = useTranslation();
  const [clothingData, setClothingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  // Загрузка данных одежды
  const fetchClothingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/characters/${characterId}/clothing/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setClothingData(data);
      } else {
        throw new Error(`Ошибка загрузки одежды: ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка загрузки одежды:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [characterId, userId, apiUrl]);

  useEffect(() => {
    if (characterId && userId) {
      fetchClothingData();
    }
  }, [fetchClothingData]);

  // Выбор одежды
  const handleSelectClothing = useCallback(async (clothingId) => {
    console.log('🎯 Начинаем выбор одежды:', clothingId);
    console.log('🌐 API URL:', apiUrl);
    console.log('📊 Character ID:', characterId);
    console.log('👤 User ID:', userId);
    
    try {
      setUpdating(true);
      
      const requestUrl = `${apiUrl}/characters/${characterId}/clothing/${userId}`;
      const requestBody = { clothing_id: clothingId };
      
      console.log('📤 Отправляем POST запрос на:', requestUrl);
      console.log('📝 Тело запроса:', requestBody);
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Получен ответ:', response.status, response.statusText);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Успешный ответ:', responseData);
        
        // Обновляем данные
        await fetchClothingData();
        
        // Показываем уведомление (можно добавить toast)
        console.log('Одежда успешно выбрана');
      } else {
        const errorData = await response.json();
        console.error('❌ Ошибка ответа:', errorData);
        throw new Error(errorData.detail || 'Ошибка при выборе одежды');
      }
    } catch (error) {
      console.error('💥 Ошибка выбора одежды:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  }, [characterId, userId, apiUrl, fetchClothingData]);

  // Покупка премиум одежды
  const handlePurchaseClothing = useCallback(async (clothingId) => {
    try {
      const response = await fetch(`${apiUrl}/characters/${characterId}/clothing/${userId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          character_id: characterId,
          clothing_id: clothingId 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Обновляем данные после покупки
        await fetchClothingData();
        
        // Показываем сообщение об успехе
        alert(`Одежда куплена! ${result.message}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при покупке одежды');
      }
    } catch (error) {
      console.error('Ошибка покупки одежды:', error);
      alert(`Ошибка: ${error.message}`);
    }
  }, [characterId, userId, apiUrl, fetchClothingData]);

  // Сброс выбора одежды
  const handleClearSelection = useCallback(async () => {
    try {
      setUpdating(true);
      const response = await fetch(`${apiUrl}/characters/${characterId}/clothing/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchClothingData();
        console.log('Выбор одежды сброшен');
      } else {
        throw new Error('Ошибка при сбросе выбора');
      }
    } catch (error) {
      console.error('Ошибка сброса одежды:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  }, [characterId, userId, apiUrl, fetchClothingData]);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">{t('wardrobe')}</h2>
        <div className="bg-gray-900 p-6 rounded-lg animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-700 h-40 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">{t('wardrobe')}</h2>
        <div className="bg-red-900/20 border border-red-600 p-4 rounded-lg">
          <p className="text-red-400">{t('wardrobeLoadError').replace('{error}', error)}</p>
          <button 
            onClick={fetchClothingData}
            className="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!clothingData || !clothingData.items.length) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">{t('wardrobe')}</h2>
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <p className="text-gray-400">{t('noClothingAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-400">
          {t('wardrobeCount').replace('{count}', clothingData.items.length)}
        </h2>
        
        {clothingData.current_selection && (
          <button
            onClick={handleClearSelection}
            disabled={updating}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {updating ? t('clearing') : t('clearSelection')}
          </button>
        )}
      </div>

      {/* Статус премиум */}
      {!clothingData.user_has_premium && (
        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg mb-4">
          <p className="text-yellow-400 text-sm">
            {t('freeClothingAccess')}
          </p>
        </div>
      )}

      {/* Сетка одежды */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clothingData.items.map(item => (
          <ClothingItem
            key={item.id}
            item={item}
            isSelected={item.id === clothingData.current_selection}
            onSelect={handleSelectClothing}
            onPurchase={handlePurchaseClothing}
            apiUrl={apiUrl}
            userId={userId}
          />
        ))}
      </div>

      {/* Информация о текущем выборе */}
      {clothingData.current_selection && (
        <div className="mt-4 bg-purple-900/20 border border-purple-600 p-3 rounded-lg">
          <p className="text-purple-400 text-sm">
            {t('clothingSelected')}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ClothingSelector);
