import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import announcements from './data/announcements.json';

const AnnouncementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Находим анонс по ID
  const announcement = announcements.announcements.find(
    ann => ann.id === id
  );

  // Если анонс не найден, показываем ошибку
  if (!announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Announcement Not Found' : 'Анонс не найден'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {language === 'en' ? 'Back to Home' : 'Вернуться на главную'}
          </button>
        </div>
      </div>
    );
  }

  const content = announcement[language];
  const botUsername = import.meta.env.VITE_BOT_USERNAME;

  // Загрузка костюмов из API
  useEffect(() => {
    const fetchCostumes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/clothing/all`);
        const data = await response.json();
        setCostumes(data.costumes || []);
      } catch (error) {
        console.error('Error fetching costumes:', error);
        setCostumes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCostumes();
  }, []);

  const handleTryNow = () => {
    navigate('/characters');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-purple-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'en' ? 'Back to Home' : 'Вернуться на главную'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* Banner Image */}
            <div className="mb-8">
              <img 
                src="/images/banner_help.jpeg" 
                alt="Banner Help" 
                className="mx-auto max-w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              {content.fullDescription}
            </p>

            <div className="flex justify-center">
              <div className="animate-bounce">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          {/* How it works Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              {language === 'en' ? 'How to choose costumes:' : 'Как выбрать костюм:'}
            </h2>
            
            <div className="grid md:grid-cols-1 gap-4 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  1
                </div>
                <p className="text-gray-200 text-sm">
                  {language === 'en' 
                    ? 'Go to character page by clicking "More details" on character card'
                    : 'Перейдите на страницу персонажа, нажав "Подробнее" на карточке персонажа'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  2
                </div>
                <p className="text-gray-200 text-sm">
                  {language === 'en' 
                    ? 'In "Wardrobe" section choose your favorite costume from available options'
                    : 'В разделе "Гардероб" выберите понравившийся костюм из доступных вариантов'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  3
                </div>
                <p className="text-gray-200 text-sm">
                  {language === 'en' 
                    ? 'Click "Select" for free costumes or "Buy" for premium ones'
                    : 'Нажмите "Выбрать" для бесплатных костюмов или "Купить" для премиум'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                  4
                </div>
                <p className="text-gray-200 text-sm">
                  {language === 'en' 
                    ? 'Start chatting with character in Telegram bot - they will appear in selected outfit'
                    : 'Начните общение с персонажем в телеграм боте - он появится в выбранном наряде'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              {language === 'en' ? 'What\'s Available:' : 'Что доступно:'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-200 text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              {language === 'en' ? 'Available Costumes' : 'Доступные костюмы'}
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">
                  {language === 'en' ? 'Loading costumes...' : 'Загрузка костюмов...'}
                </p>
              </div>
            ) : costumes.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {costumes.map((costume, index) => (
                  <div key={costume.id || index} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="aspect-[3/4] w-full">
                      <img
                        src={costume.preview_url}
                        alt={costume.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white text-sm font-semibold text-center mb-2">
                        {costume.name}
                      </h3>
                      <p className="text-gray-300 text-xs text-center mb-2">
                        {costume.description}
                      </p>
                      {costume.is_premium && (
                        <div className="flex justify-center">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                            {language === 'en' ? 'PREMIUM' : 'ПРЕМИУМ'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>{language === 'en' ? 'No costumes available' : 'Костюмы не найдены'}</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {language === 'en' ? 'Ready to Try?' : 'Готовы попробовать?'}
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              {language === 'en' 
                ? 'Start chatting with your characters in their new outfits!'
                : 'Начните общение с персонажами в их новых нарядах!'
              }
            </p>
            <button
              onClick={handleTryNow}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              {content.ctaButtonText || content.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
