import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scenes from './data/scenes';
import characters from './data/characters';

const SceneSelection = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [availableScenes, setAvailableScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const botUsername = import.meta.env.VITE_BOT_USERNAME;

  useEffect(() => {
    // Найти персонажа в локальных данных
    const selectedCharacter = characters.find(char => char.id === characterId);
    
    if (selectedCharacter) {
      setCharacter(selectedCharacter);
      
      // Фильтруем сцены по available_scenes персонажа
      const characterScenes = scenes.filter(scene => 
        selectedCharacter.available_scenes && 
        selectedCharacter.available_scenes.includes(scene.id)
      );
      
      setAvailableScenes(characterScenes);
    }
    
    setLoading(false);
  }, [characterId]);

  const handleSceneSelect = (scene) => {
    if (!character) return;
    
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const timezoneOffsetHours = timezoneOffsetMinutes / -60;
    
    // Создаем диплинк с информацией о персонаже и сцене
    const deepLink = `https://t.me/${botUsername}?start=char-${character.id}-world-${character.world_id}-scene-${scene.id}-free-${timezoneOffsetHours}`;
    
    // Проверяем, доступен ли API Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(deepLink);
      window.Telegram.WebApp.close();
    } else {
      // Фоллбэк для открытия в обычном браузере
      window.location.href = deepLink;
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Персонаж не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header с информацией о персонаже */}
      <div className="bg-gray-800 p-6">
        <button 
          onClick={handleBack}
          className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2"
        >
          ← Назад к персонажам
        </button>
        
      </div>

      {/* Выбор сцен */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Выберите сцену для общения</h2>
        
        {availableScenes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableScenes.map(scene => (
              <div 
                key={scene.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleSceneSelect(scene)}
              >
                <img 
                  src={scene.image} 
                  alt={scene.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-purple-400">{scene.name}</h3>
                  {scene.intro_text && (
                    <p className="text-gray-400 text-sm line-clamp-3">{scene.intro_text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">Для этого персонажа пока нет доступных сцен</p>
          </div>
        )}

        {/* Кнопка для случайной сцены */}
        {availableScenes.length > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const randomScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
                handleSceneSelect(randomScene);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
            >
              🎲 Случайная сцена
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneSelection;
