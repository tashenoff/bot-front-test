import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import LoadingButton from './LoadingButton';

const CrystalPackCard = ({ crystal, onSelect }) => {
  const { language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Определяем иконку в зависимости от пакета
  const getPackageIcon = () => {
    const amount = crystal.crystal_amount;

    if (amount <= 100) {
      return '📦';
    } else if (amount <= 200) {
      return '🎁';
    } else if (amount <= 500) {
      return '💎';
    } else {
      return '👑';
    }
  };

  const icon = getPackageIcon();

  return (
    <div className="w-full">
      <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
        <div className="p-4 flex items-center justify-between">

          {/* Левая часть - иконка и название */}
          <div className="flex flex-col items-start">


            <div className="flex w-full justify-between items-start mt-2">

              <div className="flex">
                {/* Иконка */}
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">{icon}</span>
                </div>
                <h3 className="text-white font-semibold ml-2 text-sm">
                  {crystal.name}
                </h3>

              </div>


              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-yellow-600 px-2 py-1 rounded">
                  <span className="text-black font-bold text-sm">{crystal.price}</span>
                  <span className="text-black text-sm">⭐</span>
                </div>
              </div>
            </div>

            <div className="flex items-start mt-1">
              <div className="flex items-center">
                <span className="text-blue-400 text-sm"> {language === 'en' ? 'Buy' : 'Включает в себя:'}</span>

              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-400 text-sm">💎</span>
                <span className="text-blue-400 font-semibold text-sm">{crystal.crystal_amount}</span>
              </div>
            </div>
          </div>


        </div>

        {/* Кнопка покупки - опциональная, можно добавить при необходимости */}
        {onSelect && (
          <div className="px-4 pb-4">
            <LoadingButton
              className="w-full py-2 px-4 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors duration-200"
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await onSelect(crystal.id);
                } finally {
                  setIsLoading(false);
                }
              }}
              language={language}
            >
              {language === 'en' ? 'Buy' : 'Купить'}
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrystalPackCard;
