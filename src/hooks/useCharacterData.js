import { useState, useCallback, useRef } from 'react';

// Глобальный кэш для всех компонентов
const globalCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

export const useCharacterData = (apiUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  const getCachedData = useCallback((key) => {
    const cached = globalCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key, data) => {
    globalCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const fetchCharacterData = useCallback(async (characterId) => {
    // Отменяем предыдущий запрос, если он есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const cacheKey = `character_${characterId}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    setLoading(true);
    setError('');

    // Создаем новый AbortController для этого запроса
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Параллельная загрузка данных с отменой запроса
      const [characterResponse, scenesResponse] = await Promise.all([
        fetch(`${apiUrl}/characters/${characterId}`, { signal }),
        fetch(`${apiUrl}/characters/${characterId}/scenes`, { signal })
      ]);
      
      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const scenesData = scenesResponse.ok ? await scenesResponse.json() : [];
        
        const result = {
          character: characterData,
          scenes: scenesData
        };

        // Кэшируем данные
        setCachedData(cacheKey, result);
        
        return { success: true, data: result };
      } else {
        throw new Error(`API Error: ${characterResponse.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Запрос отменен' };
      }

      console.warn('API Error, falling back to local data:', error.message);
      
      // Fallback к локальным данным
      try {
        let localCharacters, localScenes;
        
        const localCacheKey = 'local_data';
        const localCached = getCachedData(localCacheKey);
        
        if (localCached) {
          localCharacters = localCached.characters;
          localScenes = localCached.scenes;
        } else {
          // Динамический импорт только при необходимости
          const [{ default: characters }, { default: scenes }] = await Promise.all([
            import('../data/characters'),
            import('../data/scenes')
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
          // Фильтруем сцены
          const characterScenes = selectedCharacter.available_scenes
            ? localScenes.filter(scene => selectedCharacter.available_scenes.includes(scene.id))
            : [];
          
          const result = {
            character: selectedCharacter,
            scenes: characterScenes
          };

          return { success: true, data: result };
        } else {
          return { success: false, error: 'Персонаж не найден' };
        }
      } catch (fallbackError) {
        return { success: false, error: `Ошибка загрузки данных: ${fallbackError.message}` };
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiUrl, getCachedData, setCachedData]);

  // Предзагрузка данных персонажа (для оптимизации навигации)
  const preloadCharacterData = useCallback(async (characterId) => {
    const cacheKey = `character_${characterId}`;
    const cached = getCachedData(cacheKey);
    
    if (!cached) {
      // Асинхронно загружаем данные в фоне без индикатора загрузки
      try {
        await fetchCharacterData(characterId);
      } catch (error) {
        // Игнорируем ошибки при предзагрузке
        console.debug('Preload failed for character:', characterId);
      }
    }
  }, [getCachedData, fetchCharacterData]);

  // Очистка кэша (при необходимости)
  const clearCache = useCallback(() => {
    globalCache.clear();
  }, []);

  return {
    loading,
    error,
    fetchCharacterData,
    preloadCharacterData,
    clearCache,
    getCachedData,
    setCachedData
  };
};

export default useCharacterData;
