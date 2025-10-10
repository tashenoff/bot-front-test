import React, { useState } from 'react';
import { useTranslation } from './hooks/useTranslation';

const CharacterVideos = ({ character }) => {
  const { language } = useTranslation();
  const [hasError, setHasError] = useState(false);

  // Получаем локализованное имя
  const getName = () => {
    if (typeof character.name === 'object') {
      return character.name[language] || character.name.ru;
    }
    return character.name;
  };

  const name = getName();

  // Сопоставление персонажей с видео
  const getCharacterVideo = (characterId) => {
    const videoMap = {
      'teacher': '/images/video/teacher.mp4',
      'gamer_streamer': '/images/video/streamer.mp4',
      'tiktok_alt_girl': '/images/video/mia.mp4',
      'party_influencer': '/images/video/nika.mp4'
    };
    
    return videoMap[characterId];
  };

  const videoSrc = getCharacterVideo(character.id);

  // Если у персонажа нет видео, не показываем компонент
  if (!videoSrc) {
    return null;
  }

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="bg-gray-950 rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          {name}
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-400">Не удалось загрузить видео</p>
          <a href={videoSrc} className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
            Попробовать скачать
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-lg shadow-lg p-6 mb-4">
      <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
        {name}
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <video
          className="w-full h-auto rounded-lg shadow-lg"
          controls
          preload="metadata"
          onError={handleError}
          poster={character.image}
        >
          <source src={videoSrc} type="video/mp4" />
          
          {/* Фоллбэк для браузеров без поддержки видео */}
          <p className="text-gray-400 text-center p-4">
            Ваш браузер не поддерживает воспроизведение видео.
            <a href={videoSrc} className="text-purple-400 hover:text-purple-300 ml-2">
              Скачать видео
            </a>
          </p>
        </video>
      </div>

    </div>
  );
};

export default CharacterVideos;
