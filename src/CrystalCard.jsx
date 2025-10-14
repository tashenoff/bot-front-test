import React from 'react';
import { useTranslation } from './hooks/useTranslation';

const CrystalCard = ({ crystal, showBuyButton = false, onSelect }) => {
  const { language } = useTranslation();

  const getCrystalName = () => {
    return crystal.name;
  };

  const getCrystalDescription = () => {
    return crystal.description;
  };

  const crystalName = getCrystalName();
  const crystalDescription = getCrystalDescription();

  // Определяем стили для разных типов пакетов
  const getCardStyle = () => {
    if (crystal.best_value) {
      return "bg-gradient-to-br from-yellow-900 to-yellow-700 border-2 border-yellow-400";
    } else if (crystal.popular) {
      return "bg-gradient-to-br from-purple-900 to-purple-700 border-2 border-purple-400";
    }
    return "bg-gradient-to-br from-blue-900 to-blue-700";
  };

  const getBadge = () => {
    if (crystal.best_value) {
      return (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
          {language === 'en' ? 'BEST VALUE' : 'ВЫГОДНО'}
        </div>
      );
    } else if (crystal.popular) {
      return (
        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
          {language === 'en' ? 'POPULAR' : 'ПОПУЛЯРНО'}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${getCardStyle()} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative min-h-96`}>
      {getBadge()}
      
      {/* Кристалл иконка */}
      <div className="flex justify-center items-center h-24 pt-4">
        <div className="text-5xl">💎</div>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2 text-white">{crystalName}</h3>
          <p className="text-gray-200 text-sm mb-3">{crystalDescription}</p>
          
          {/* Количество кристаллов */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-white mb-1">
              {crystal.crystal_amount}
            </div>
            <div className="text-sm text-gray-300">
              {language === 'en' ? 'crystals' : 'кристаллов'}
            </div>
          </div>
          
          {/* Цена */}
          <div className="mb-4">
            <div className="text-yellow-400 font-bold text-lg">
              {crystal.price} ⭐
            </div>
            <div className="text-xs text-gray-400">
              ≈ {(crystal.price / crystal.crystal_amount).toFixed(2)} ⭐/{language === 'en' ? 'msg' : 'сообщ'}
            </div>
          </div>
        </div>
        
        {/* КНОПКА ПОКУПКИ - ВСЕГДА ВИДИМАЯ */}
        <button 
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg border-2 border-white"
          onClick={() => {
            console.log('🎯 Button clicked for crystal:', crystal.id);
            if (onSelect) {
              onSelect(crystal.id);
            }
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          🔥 {language === 'en' ? 'BUY NOW!' : 'КУПИТЬ СЕЙЧАС!'}
        </button>
      </div>
    </div>
  );
};

export default CrystalCard;
