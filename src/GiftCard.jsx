import React from 'react';

const GiftCard = ({ gift, showBuyButton = false, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:bg-gray-750 transition-colors flex flex-col">
      <div className="w-full h-48 bg-gray-900 flex items-center justify-center p-4">
        <img src={gift.image} alt={gift.name} className="w-full h-full object-contain" />
      </div>
      <div className="p-4 text-center flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-white">{gift.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{gift.effect_description}</p>
        <div className="text-purple-400 font-bold text-lg mb-4">
          {gift.price} 🌟
        </div>
        {showBuyButton && (
          <button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            onClick={() => onSelect && onSelect(gift.id)}
          >
            Подарить
          </button>
        )}
      </div>
    </div>
  );
};

export default GiftCard;
