import React, { useState, useRef } from 'react';

const CharacterVideos = ({ character }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

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

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleCustomPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  if (hasError) {
    return (
      <div className="bg-gray-950 rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-4 text-center">
          {character.name}
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
        {character.name}
      </h2>
      
      <div className="relative max-w-2xl mx-auto">
        <video
          ref={videoRef}
          className="w-full h-auto rounded-lg shadow-lg"
          controls
          preload="metadata"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handlePause}
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

        {/* Кастомная кнопка play - показывается только когда видео не воспроизводится */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg pointer-events-none"
          >
            <div 
              className="bg-purple-600 hover:bg-purple-700 rounded-full p-4 transition-colors cursor-pointer pointer-events-auto"
              onClick={handleCustomPlay}
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CharacterVideos;
