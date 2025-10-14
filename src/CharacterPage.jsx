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

  // Всегда показываем отладочную информацию
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4">DEBUG: Character Page</h1>
      
      <div className="bg-gray-800 p-4 rounded mb-4">
        <div>Character ID: {characterId}</div>
        <div>Loading: {loading ? 'ДА' : 'НЕТ'}</div>
        <div>Character: {character ? character.name : 'НЕТ'}</div>
        <div>Scenes: {availableScenes.length}</div>
        {error && <div className="text-red-400">Error: {error}</div>}
        <div className="text-yellow-400">Debug: {debugInfo}</div>
      </div>

      {loading && <div>Загрузка...</div>}
      
      {!loading && !character && <div>Персонаж не найден</div>}
      
      {!loading && character && (
        <div>
          <h2 className="text-xl mb-4">Персонаж: {character.name}</h2>
          
          {availableScenes.length > 0 ? (
            <div>
              <h3 className="mb-2">Доступные сцены ({availableScenes.length}):</h3>
              {availableScenes.map(scene => (
                <div key={scene.id} className="bg-gray-900 p-2 mb-2 rounded">
                  {getSceneName(scene)}
                </div>
              ))}
            </div>
          ) : (
            <div>Нет доступных сцен</div>
          )}
        </div>
      )}
      
      <button 
        onClick={handleBack}
        className="mt-4 bg-purple-600 px-4 py-2 rounded"
      >
        Назад к персонажам
      </button>
    </div>
  );
};

export default CharacterPage;
