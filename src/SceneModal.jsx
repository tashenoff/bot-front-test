import React, { useState, useEffect } from 'react';
import scenes from './data/scenes';
import { handleSceneSelection } from './utils/telegramUtils';
import { useTranslation } from './hooks/useTranslation';

const SceneModal = ({ character, isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const [availableScenes, setAvailableScenes] = useState([]);
  const botUsername = import.meta.env.VITE_BOT_USERNAME;

  // Функции для получения локализованных данных
  const getCharacterName = () => {
    if (!character) return '';
    if (typeof character.name === 'object') {
      return character.name[language] || character.name.ru;
    }
    return character.name;
  };

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
    if (character && character.available_scenes) {
      // Фильтруем сцены по available_scenes персонажа
      const characterScenes = scenes.filter(scene =>
        character.available_scenes.includes(scene.id)
      );
      setAvailableScenes(characterScenes);
    }
  }, [character]);

  const handleSceneSelect = (scene) => {
    if (!character) return;
    handleSceneSelection(character, scene, botUsername);
  };

  const handleRandomScene = () => {
    if (availableScenes.length > 0) {
      const randomScene = availableScenes[Math.floor(Math.random() * availableScenes.length)];
      handleSceneSelect(randomScene);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-purple-400">
              {language === 'en' ? 'Choose a scene' : 'Выберите сцену'}
            </h2>
            <p className="text-gray-400 mt-1">
              {language === 'en' ? 'for chatting with ' : 'для общения с '}{getCharacterName()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {availableScenes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {availableScenes.map(scene => {
                  const sceneName = getSceneName(scene);
                  const sceneIntroText = getSceneIntroText(scene);
                  
                  return (
                    <div
                      key={scene.id}
                      className="bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => handleSceneSelect(scene)}
                    >
                      <div className="relative">
                        <img
                          src={scene.image}
                          alt={sceneName}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-lg font-bold mb-1 text-purple-400">{sceneName}</h3>
                        {sceneIntroText && (
                          <p className="text-gray-400 text-sm line-clamp-2">{sceneIntroText}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Random scene button */}
              {availableScenes.length > 1 && (
                <div className="text-center">
                  <button
                    onClick={handleRandomScene}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105"
                  >
                    {language === 'en' ? 'Random scene' : 'Случайная сцена'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                {language === 'en' ? 'No scenes available for this character yet' : 'Для этого персонажа пока нет доступных сцен'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneModal;
