import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AboutCharacter from './AboutCharacter';
import CharacterGallery from './CharacterGallery';
import CharacterVideos from './CharacterVideos';
import { handleSceneSelection } from './utils/telegramUtils';
import { useTranslation } from './hooks/useTranslation';

const CharacterPage = () => {
  const { t, language } = useTranslation();
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [availableScenes, setAvailableScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const botUsername = import.meta.env.VITE_BOT_USERNAME;

  // Функции для получения локализованных данных сцен
  const getSceneName = (scene) => {
    if (typeof scene.name === 'object') {
      return scene.name[language] || scene.name.ru;
    }
    return scene.name;
  };

  const getSceneIntroText = (scene) => {
    if (typeof scene.intro_text === 'object') {
      return scene.intro_text[language] || scene.intro_text.ru;
    }
    return scene.intro_text;
  };

  useEffect(() => {
    const fetchCharacterData = async () => {
      setDebugInfo(`Загрузка персонажа: ${characterId}`);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        setDebugInfo(`API URL: ${apiUrl}`);
        
        // Загружаем данные персонажа
        const characterResponse = await fetch(`${apiUrl}/characters/${characterId}`);
        setDebugInfo(`Character response: ${characterResponse.status}`);
        
        if (characterResponse.ok) {
          const characterData = await characterResponse.json();
          setCharacter(characterData);
          setDebugInfo(`Персонаж загружен: ${characterData.name}`);

          // Загружаем сцены персонажа
          const scenesResponse = await fetch(`${apiUrl}/characters/${characterId}/scenes`);
          setDebugInfo(`Scenes response: ${scenesResponse.status}`);
          
          if (scenesResponse.ok) {
            const scenesData = await scenesResponse.json();
            setAvailableScenes(scenesData);
            setDebugInfo(`Загружено сцен: ${scenesData.length}`);
          } else {
            setError(`Ошибка загрузки сцен: ${scenesResponse.status}`);
            setAvailableScenes([]);
          }
        } else {
          setError(`Ошибка загрузки персонажа: ${characterResponse.status}`);
          setCharacter(null);
        }
      } catch (error) {
        setError(`Ошибка сети: ${error.message}`);
        setDebugInfo('Переходим на локальные данные');
        
        // Fallback к локальным данным при ошибке API
        try {
          const { default: characters } = await import('./data/characters');
          const { default: scenes } = await import('./data/scenes');
          
          const selectedCharacter = characters.find(char => char.id === characterId);
          if (selectedCharacter) {
            setCharacter(selectedCharacter);
            setDebugInfo('Персонаж загружен из локальных данных');
            
            // Фильтруем сцены по available_scenes персонажа
            if (selectedCharacter.available_scenes) {
              const characterScenes = scenes.filter(scene =>
                selectedCharacter.available_scenes.includes(scene.id)
              );
              setAvailableScenes(characterScenes);
              setDebugInfo(`Сцен из локальных данных: ${characterScenes.length}`);
            }
          } else {
            setError('Персонаж не найден в локальных данных');
          }
        } catch (fallbackError) {
          setError(`Ошибка локальных данных: ${fallbackError.message}`);
          setCharacter(null);
          setAvailableScenes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [characterId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Показываем кнопку только в середине страницы
      // Не показываем в первых 300px и в последних 300px
      const showButton = scrollY > 300 && scrollY < (documentHeight - windowHeight - 300);
      setShowScrollTop(showButton);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate('/characters');
  };

  const handleSceneSelect = (scene) => {
    if (!character) return;
    handleSceneSelection(character, scene, botUsername);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">{t('characterNotFound')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header с кнопкой назад */}
      <div className="bg-gray-900 p-6">
        <button
          onClick={handleBack}
          className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2"
        >
          {t('backToCharacters')}
        </button>
        
        {/* Debug info для диагностики */}
        {(debugInfo || error) && (
          <div className="mt-4 p-3 bg-gray-800 rounded">
            {error && (
              <div className="text-red-400 mb-2">
                <strong>Ошибка:</strong> {error}
              </div>
            )}
            {debugInfo && (
              <div className="text-yellow-400">
                <strong>Отладка:</strong> {debugInfo}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Видео персонажа */}
      <div className="container mx-auto px-4 py-4">
        <CharacterVideos character={character} />
      </div>

      {/* О персонаже */}
      <div className="container mx-auto px-4 py-4">
        <AboutCharacter character={character} />
      </div>

      {/* Выбор сцен */}
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-bold mb-6 text-center text-purple-400">{t('chooseSceneForChat')}</h2>

        {availableScenes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableScenes.map(scene => {
              const sceneName = getSceneName(scene);
              const sceneIntroText = getSceneIntroText(scene);
              
              return (
                <div
                  key={scene.id}
                  className="bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105 relative"
                  onClick={() => handleSceneSelect(scene)}
                >
                  <div className="relative">
                    <img
                      src={scene.image}
                      alt={sceneName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-purple-400">{sceneName}</h3>
                    {sceneIntroText && (
                      <p className="text-gray-400 text-sm line-clamp-3">{sceneIntroText}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">{t('noScenesAvailable')}</p>
          </div>
        )}
      </div>

      {/* Галерея персонажа */}
      <div className="container mx-auto px-4 py-4">
        <CharacterGallery character={character} />
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 backdrop-blur-sm"
          aria-label={t('scrollUp')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CharacterPage;
