import React from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterCard = ({ character }) => {
  const navigate = useNavigate();

  const handleChat = (e) => {
    e.preventDefault();
    // Переходим к выбору сцен для данного персонажа
    navigate(`/character/${character.id}/scenes`);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img src={character.image} alt={character.name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-purple-400">{character.name}</h3>
        <p className="text-gray-400 mb-4">{character.description}</p>
        <button
          onClick={handleChat}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"

        >
          Начать чат
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;
