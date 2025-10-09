import React from 'react';

const AboutCharacter = ({ character }) => {
  return (
    <div className="bg-gray-950 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
     
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">{character.name}</h2>
          <p className="text-gray-300 leading-relaxed">{character.description}</p>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Интересы:</h3>
            <div className="flex flex-wrap gap-2">
              {character.interests.map((interest) => (
                <span key={interest} className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">#{interest}</span>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Не нравится:</h3>
            <div className="flex flex-wrap gap-2">
              {character.dislikes.map((dislike) => (
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
