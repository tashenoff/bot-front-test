import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleSceneSelection } from './utils/telegramUtils';
import LazyImage from './components/LazyImage';

// Кэш для данных персонажей и сцен
const dataCache = new Map();
const IMAGE_CACHE_TIME = 10 * 60 * 1000; // 10 минут

// Мемоизированный компонент для сцены
const SceneItem = memo(({ scene, onSelect, getSceneName, getSceneIntroText }) => (
  <div 
    className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
    onClick={() => onSelect(scene)}
  >
    <h3 className="font-bold text-lg mb-2">{getSceneName(scene)}</h3>
    {getSceneIntroText(scene) && (
      <p className="text-gray-400 text-sm line-clamp-2">{getSceneIntroText(scene)}</p>
    )}
  </div>
));

// Мемоизированный компонент для интересов
const InterestsGrid = memo(({ interests }) => {
  if (!interests.length) return null;
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">Интересы</h2>
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest, index) => (
          <div key={index} className="bg-gray-800 p-3 rounded-lg text-center">
            <span className="text-sm text-gray-300">{interest}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Компонент скелетона для загрузки
const SkeletonLoader = memo(() => (
  <div className="container mx-auto px-4 py-6 animate-pulse">
    <div className="mb-8">
      <div className="w-full max-w-md h-96 bg-gray-700 rounded-lg mx-auto mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-64"></div>
    </div>
    
    <div className="mb-8">
      <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    
    <div className="mb-8">
      <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg">
            <div className="h-5 bg-gray-700 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

const CharacterPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [availableScenes, setAvailableScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'test_bot';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  // Мемоизированная функция для получения URL изображения
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiUrl}${imagePath}`;
  }, [apiUrl]);

  // Мемоизированные функции для сцен
  const getSceneName = useCallback((scene) => {
    return scene.name?.ru || scene.name || 'Безымянная сцена';
  }, []);

  const getSceneIntroText = useCallback((scene) => {
    return scene.intro_text?.ru || scene.intro_text || '';
  }, []);

  // Мемоизированное извлечение интересов
  const characterInterests = useMemo(() => {
    if (!character) return [];
    
    // Если интересы уже в массиве
    if (Array.isArray(character.interests)) {
      return character.interests;
    }
    
    // Если есть многоязычные интересы
    if (character.interests?.ru) {
      return character.interests.ru;
    }
    
    // Парсинг из prompt_parts (fallback)
    if (character.prompt_parts?.interests) {
      const interestsText = character.prompt_parts.interests;
      const interestsMatch = interestsText.match(/Тебя интересует: (.+?)(?:\.|$)/);
      
      if (interestsMatch) {
        return interestsMatch[1].split(', ').map(interest => interest.trim());
      }
    }
    
    return [];
  }, [character]);

  // Функция для кэширования данных
  const getCachedData = useCallback((key) => {
    const cached = dataCache.get(key);
    if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TIME) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key, data) => {
    dataCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  // Оптимизированная загрузка данных с кэшированием
  const fetchCharacterData = useCallback(async () => {
    const cacheKey = `character_${characterId}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      setCharacter(cached.character);
      setAvailableScenes(cached.scenes);
      setLoading(false);
      return;
    }

    try {
      // Параллельная загрузка персонажа и сцен
      const [characterResponse, scenesResponse] = await Promise.all([
        fetch(`${apiUrl}/characters/${characterId}`),
        fetch(`${apiUrl}/characters/${characterId}/scenes`)
      ]);
      
      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const scenesData = scenesResponse.ok ? await scenesResponse.json() : [];
        
        setCharacter(characterData);
        setAvailableScenes(scenesData);
        
        // Кэшируем данные
        setCachedData(cacheKey, {
          character: characterData,
          scenes: scenesData
        });
      } else {
        throw new Error(`API Error: ${characterResponse.status}`);
      }
    } catch (error) {
      console.warn('API Error, falling back to local data:', error.message);
      
      // Fallback к локальным данным с кэшированием импорта
      try {
        let localCharacters, localScenes;
        
        const localCacheKey = 'local_data';
        const localCached = getCachedData(localCacheKey);
        
        if (localCached) {
          localCharacters = localCached.characters;
          localScenes = localCached.scenes;
        } else {
          // Динамический импорт только при первой необходимости
          const [{ default: characters }, { default: scenes }] = await Promise.all([
            import('./data/characters'),
            import('./data/scenes')
          ]);
          
          localCharacters = characters;
          localScenes = scenes;
          
          setCachedData(localCacheKey, {
            characters: localCharacters,
            scenes: localScenes
          });
        }
        
        const selectedCharacter = localCharacters.find(char => char.id === characterId);
        if (selectedCharacter) {
          setCharacter(selectedCharacter);
          
          // Фильтруем сцены
          const characterScenes = selectedCharacter.available_scenes
            ? localScenes.filter(scene => selectedCharacter.available_scenes.includes(scene.id))
            : [];
          
          setAvailableScenes(characterScenes);
        } else {
          setError('Персонаж не найден');
        }
      } catch (fallbackError) {
        setError(`Ошибка загрузки данных: ${fallbackError.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [characterId, apiUrl, getCachedData, setCachedData]);

  useEffect(() => {
    fetchCharacterData();
  }, [fetchCharacterData]);

  const handleBack = useCallback(() => {
    navigate('/characters');
  }, [navigate]);

  const handleSceneSelect = useCallback((scene) => {
    if (!character) return;
    handleSceneSelection(character, scene, botUsername);
  }, [character, botUsername]);

  // Показываем скелетон при загрузке
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SkeletonLoader />
      </div>
    );
  }

  // Показываем ошибку
  if (!character) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Персонаж не найден</h2>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <button 
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
          >
            Назад к персонажам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Фото персонажа с ленивой загрузкой */}
        <div className="mb-8">
          <div className="w-full max-w-md mx-auto">
            <LazyImage 
              src={getImageUrl(character.image)} 
              alt={character.name?.ru || character.name}
              className="w-full h-96 object-contain rounded-lg shadow-lg"
              loadingClassName="w-full h-96 bg-gray-700 rounded-lg animate-pulse"
              placeholder={
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">Загрузка изображения...</span>
                </div>
              }
            />
          </div>
          <h1 className="text-3xl font-bold mt-4 text-purple-400 text-left">
            {character.name?.ru || character.name}
          </h1>
        </div>

        {/* О персонаже */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">О персонаже</h2>
          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-gray-300 leading-relaxed">
              {character.description?.ru || character.description}
            </p>
          </div>
        </div>

        {/* Интересы */}
        <InterestsGrid interests={characterInterests} />

        {/* Доступные сцены */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Доступные сцены ({availableScenes.length})
          </h2>
          {availableScenes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {availableScenes.map(scene => (
                <SceneItem
                  key={scene.id}
                  scene={scene}
                  onSelect={handleSceneSelect}
                  getSceneName={getSceneName}
                  getSceneIntroText={getSceneIntroText}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <p className="text-gray-400">Нет доступных сцен</p>
            </div>
          )}
        </div>

        {/* Кнопка назад */}
        <div className="text-center">
          <button 
            onClick={handleBack}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
          >
            Назад к персонажам
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterPage);
