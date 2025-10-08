import React from 'react';

const GiftCard = ({ gift, showBuyButton = false, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center p-4 hover:bg-gray-750 transition-colors">
      <img src={gift.image} alt={gift.name} className="w-32 h-32 object-contain mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">{gift.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{gift.effect_description}</p>
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
  );
};

export default GiftCard;
