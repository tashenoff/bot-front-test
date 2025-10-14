import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SceneModal from './SceneModal';
import { useTranslation } from './hooks/useTranslation';

const CharacterCard = ({ character }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
    return `${apiUrl}${imagePath}`;
  };

  const handleChat = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAboutCharacter = (e) => {
    e.preventDefault();
    // Переходим на страницу о персонаже
    navigate(`/character/${character.id}`);
  };

  // Получаем локализованное имя и описание
  const getName = () => {
    if (typeof character.name === 'object') {
      return character.name[language] || character.name.ru;
    }
    return character.name;
  };

  const getDescription = () => {
    // Сначала пытаемся получить short_description
    const shortDesc = character.short_description;
    if (shortDesc) {
      if (typeof shortDesc === 'object') {
        return shortDesc[language] || shortDesc.ru;
      }
      return shortDesc;
    }
    // Если short_description нет, используем description
    if (typeof character.description === 'object') {
      return character.description[language] || character.description.ru;
    }
    return character.description;
  };

  const name = getName();
  const description = getDescription();

  return (
    <>
      <div className="bg-gray-950/60 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-gray-800/50">
        <div className="w-full relative min-h-[300px]">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4 text-sm">{t('loading') || 'Загрузка...'}</p>
              </div>
            </div>
          )}
          <img 
            src={getImageUrl(character.image)} 
            alt={name} 
            className={`w-full h-full min-h-[300px] object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {character.premium_only && (
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold text-xs">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {t('premiumLabel')}
              </span>
            </div>
          )}
        </div>
        <div className="px-5 pt-3 pb-5 bg-gray-950/80 backdrop-blur-sm border-t border-gray-800/50">
          <h3 className="text-base font-bold text-purple-400 tracking-wide mb-2">{name}</h3>
          <p className="text-gray-300 text-xs leading-relaxed mb-4 line-clamp-3">{description}</p>
          <button
            onClick={handleAboutCharacter}
            className="text-gray-400 hover:text-purple-400 transition-colors text-[10px] uppercase tracking-widest flex items-center justify-between w-full mb-4 border border-gray-600/30 hover:border-purple-400/50 rounded py-1.5 px-4"
          >
            <span className="font-bold">{t('aboutCharacter')}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={handleChat}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm py-1.5 px-4 rounded transition duration-300"
          >
            {t('startChat')}
          </button>
        </div>
      </div>

      <SceneModal 
        character={character}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CharacterCard;
