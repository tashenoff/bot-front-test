import React from 'react';

const GiftCard = ({ gift }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center p-4">
      <img src={gift.image} alt={gift.name} className="w-32 h-32 object-contain mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">{gift.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{gift.effect_description}</p>
      <div className="text-purple-400 font-bold text-lg">
        {gift.price} 🌟
      </div>
    </div>
  );
};

export default GiftCard;