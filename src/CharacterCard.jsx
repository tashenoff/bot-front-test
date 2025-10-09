import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SceneModal from './SceneModal';

const CharacterCard = ({ character }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChat = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleAboutCharacter = (e) => {
    e.preventDefault();
    // Переходим на страницу о персонаже
    navigate(`/character/${character.id}`);
  };

  return (
    <>
      <div className="bg-gray-950 rounded-lg overflow-hidden shadow-lg">
        <div className="w-full bg-gray-950">
          <img src={character.image} alt={character.name} className="w-full h-auto" />
        </div>
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-purple-400 tracking-wide">{character.name}</h3>
            <button
              onClick={handleAboutCharacter}
              className="text-gray-400 hover:text-purple-400 transition-colors text-xs uppercase tracking-widest flex items-center gap-1"
            >
              О персонаже
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-gray-400 mb-4 text-sm">{character.description}</p>
          
          <button
            onClick={handleChat}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Начать чат
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
