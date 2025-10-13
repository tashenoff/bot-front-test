import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';

const Profile = () => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Извлекаем user_id из Telegram WebApp
  useEffect(() => {
    const extractUserId = () => {
      // Проверяем доступность Telegram WebApp API
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
          setUserId(user.id);
          return user.id;
        }
      }
      
      // Фоллбэк для разработки - извлечение из URL параметров
      const urlParams = new URLSearchParams(window.location.search);
      const userIdParam = urlParams.get('user_id');
      if (userIdParam) {
        const id = parseInt(userIdParam);
        setUserId(id);
        return id;
      }
      
      // Если не удалось извлечь, используем тестовый ID
      console.warn('Не удалось извлечь user_id, используется тестовый ID');
      setUserId(123456789);
      return 123456789;
    };

    const id = extractUserId();
    if (id) {
      fetchUserProfile(id);
    } else {
      setError('Не удалось определить пользователя');
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      // Определяем базовый URL для API
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/user/${userId}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const profileData = await response.json();
      setUserProfile(profileData);
    } catch (err) {
      console.error('Ошибка при загрузке профиля:', err);
      setError('Не удалось загрузить профиль пользователя');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return 'Неверный формат даты';
    }
  };

  const getSubscriptionStatus = () => {
    if (!userProfile?.subscription) return 'Не определено';
    
    const { subscription } = userProfile;
    
    if (subscription.is_premium) {
      if (subscription.days_remaining !== null) {
        if (subscription.days_remaining <= 0) {
          return 'Премиум подписка истекла';
        }
        return `Премиум (осталось ${subscription.days_remaining} дн.)`;
      }
      return 'Премиум (безлимитная)';
    }
    
    return 'Бесплатная подписка';
  };

  const getSubscriptionBadgeClass = () => {
    if (!userProfile?.subscription?.is_premium) {
      return 'bg-gray-100 text-gray-800';
    }
    
    const daysRemaining = userProfile.subscription.days_remaining;
    if (daysRemaining !== null && daysRemaining <= 3) {
      return 'bg-red-100 text-red-800'; // Скоро истечет
    }
    
    return 'bg-green-100 text-green-800'; // Активная премиум
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка профиля...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-400 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Ошибка</h2>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Профиль не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Профиль пользователя</h1>
          <p className="text-gray-300">Информация о вашем аккаунте и подписке</p>
        </div>

        {/* Основная информация */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Основная информация</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">ID пользователя:</span>
              <span className="text-white font-mono">{userProfile.user_id}</span>
            </div>
            
            {userProfile.user_full_name && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Полное имя:</span>
                <span className="text-white">{userProfile.user_full_name}</span>
              </div>
            )}
            
            {userProfile.user_username && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Username:</span>
                <span className="text-white">@{userProfile.user_username}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Дата регистрации:</span>
              <span className="text-white">{formatDate(userProfile.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Подписка */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Подписка</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Статус:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadgeClass()}`}>
                {getSubscriptionStatus()}
              </span>
            </div>
            
            {userProfile.subscription.is_premium && userProfile.subscription.expires_at && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Действует до:</span>
                <span className="text-white">{formatDate(userProfile.subscription.expires_at)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Дата покупки:</span>
              <span className="text-white">{formatDate(userProfile.subscription.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Баланс и лимиты */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Баланс и лимиты</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Баланс звезд:</span>
              <span className="text-yellow-400 font-bold">⭐ {userProfile.stars_balance}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Использовано изображений сегодня:</span>
              <span className="text-white">{userProfile.free_images_today}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Бонусных изображений доступно:</span>
              <span className="text-green-400 font-bold">{userProfile.bonus_images_today}</span>
            </div>
          </div>
        </div>

        {/* Кнопка обновления */}
        <div className="text-center">
          <button
            onClick={() => fetchUserProfile(userId)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Обновить данные
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
