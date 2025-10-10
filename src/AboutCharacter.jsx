import React from 'react';
import { useTranslation } from './hooks/useTranslation';

const AboutCharacter = ({ character }) => {
  const { t, language } = useTranslation();
  
  // Получаем локализованные данные
  const getName = () => {
    if (typeof character.name === 'object') {
      return character.name[language] || character.name.ru;
    }
    return character.name;
  };

  const getDescription = () => {
    if (typeof character.description === 'object') {
      return character.description[language] || character.description.ru;
    }
    return character.description;
  };

  const getInterests = () => {
    if (typeof character.interests === 'object' && !Array.isArray(character.interests)) {
      return character.interests[language] || character.interests.ru;
    }
    return character.interests;
  };

  const getDislikes = () => {
    if (typeof character.dislikes === 'object' && !Array.isArray(character.dislikes)) {
      return character.dislikes[language] || character.dislikes.ru;
    }
    return character.dislikes;
  };

  const name = getName();
  const description = getDescription();
  const interests = getInterests();
  const dislikes = getDislikes();
  
  return (
    <div className="bg-gray-950 rounded-lg shadow-lg p-6 mb-4">
      <div className="flex flex-col md:flex-row gap-6 items-center">
     
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">{name}</h2>
          <p className="text-gray-300 leading-relaxed mb-6">{description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">{t('interests')}</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span key={interest} className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">#{interest}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">{t('dislikes')}</h3>
            <div className="flex flex-wrap gap-2">
              {dislikes.map((dislike) => (
                <span key={dislike} className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">#{dislike}</span>
              ))}
            </div>
          </div>
       
        </div>
      </div>
    </div>
  );
};

export default AboutCharacter;
