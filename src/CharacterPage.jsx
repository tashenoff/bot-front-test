import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleSceneSelection } from './utils/telegramUtils';

const CharacterPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [availableScenes, setAvailableScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('Инициализация...');
  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'test_bot';

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    return `${apiUrl}${imagePath}`;
  };

  // Упрощенные функции для получения названий сцен
  const getSceneName = (scene) => {
    return scene.name || 'Безымянная сцена';
  };

  const getSceneIntroText = (scene) => {
    return scene.intro_text || '';
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

  // Убираем этот useEffect который может вызывать ошибки

  const handleBack = () => {
    navigate('/characters');
  };

  const handleSceneSelect = (scene) => {
    if (!character) return;
    handleSceneSelection(character, scene, botUsername);
  };

  // Функция для извлечения интересов из текста
  const getInterests = (character) => {
    if (!character?.prompt_parts?.interests) return [];
    
    const interestsText = character.prompt_parts.interests;
    const interestsMatch = interestsText.match(/Тебя интересует: (.+?)(?:\.|$)/);
    
    if (interestsMatch) {
      return interestsMatch[1].split(', ').map(interest => interest.trim());
    }
    
    return [];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Debug info */}
      <div className="bg-gray-800 p-4 text-sm">
        <div>Character ID: {characterId} | Loading: {loading ? 'ДА' : 'НЕТ'}</div>
        {error && <div className="text-red-400">Error: {error}</div>}
        <div className="text-yellow-400">Debug: {debugInfo}</div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-64">
          <div>Загрузка...</div>
        </div>
      )}
      
      {!loading && !character && (
        <div className="flex items-center justify-center min-h-64">
          <div>Персонаж не найден</div>
        </div>
      )}
      
      {!loading && character && (
        <div className="container mx-auto px-4 py-6">
          {/* Фото персонажа */}
          <div className="mb-8 text-center">
            <img 
              src={getImageUrl(character.image)} 
              alt={character.name}
              className="w-64 h-64 object-cover rounded-lg mx-auto shadow-lg"
            />
            <h1 className="text-3xl font-bold mt-4 text-purple-400">{character.name}</h1>
          </div>

          {/* О персонаже */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">О персонаже</h2>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-gray-300 leading-relaxed">{character.description}</p>
            </div>
          </div>

          {/* Интересы */}
          {getInterests(character).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Интересы</h2>
              <div className="grid grid-cols-2 gap-3">
                {getInterests(character).map((interest, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-lg text-center">
                    <span className="text-sm text-gray-300">{interest}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Доступные сцены */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Доступные сцены ({availableScenes.length})
            </h2>
            {availableScenes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {availableScenes.map(scene => (
                  <div 
                    key={scene.id} 
                    className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => handleSceneSelect(scene)}
                  >
                    <h3 className="font-bold text-lg mb-2">{getSceneName(scene)}</h3>
                    {getSceneIntroText(scene) && (
                      <p className="text-gray-400 text-sm line-clamp-2">{getSceneIntroText(scene)}</p>
                    )}
                  </div>
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
      )}
    </div>
  );
};

export default CharacterPage;
