import React, { useState } from 'react';
import { useTranslation } from './hooks/useTranslation';
import LoadingButton from './components/LoadingButton';

const GiftCard = ({ gift, showBuyButton = false, onSelect }) => {
  const { language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Функции для получения локализованных данных
  const getGiftName = () => {
    if (typeof gift.name === 'string' && gift.name.startsWith('🍷')) {
      // Локальные данные (эмочи + текст)
      const emoji = gift.name.split(' ')[0];
      const names = {
        'en': gift.name.replace('🍷', '🍷').replace('Бутылка дорогого вина', 'Bottle of expensive wine'),
        'ru': gift.name
      };
      return names[language] || gift.name;
    }
    // Данные из API (просто строка)
    return gift.name;
  };

  const getGiftDescription = () => {
    if (typeof gift.effect_description === 'string') {
      // Локальные данные могут быть объектами, но API всегда строки
      return gift.effect_description;
    }
    // Fallback для старого формата
    if (typeof gift.effect_description === 'object') {
      return gift.effect_description[language] || gift.effect_description.ru;
    }
    return gift.effect_description;
  };

  const giftName = getGiftName();
  const giftDescription = getGiftDescription();

  return (
    <div className="bg-gray-950 rounded-lg overflow-hidden shadow-lg hover:bg-gray-800 transition-colors relative h-64">
      <img src={gift.image} alt={giftName} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{giftName}</h3>
        <p className="text-gray-300 text-sm mb-4">{giftDescription}</p>
        <div className="text-purple-400 font-bold text-lg mb-4">
          {gift.crystal_price} 💎
        </div>
        {showBuyButton && (
          <LoadingButton 
            className="w-full"
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await onSelect(gift.id);
              } finally {
                setIsLoading(false);
              }
            }}
            language={language}
          >
            {language === 'en' ? 'Gift' : 'Подарить'}
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

export default GiftCard;
