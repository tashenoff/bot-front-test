import React, { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import GiftCard from './GiftCard';
import Help from './Help';
import Characters from './Characters';
import SceneSelection from './SceneSelection';
import Gifts from './Gifts';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FaComments, FaUserFriends, FaBrain, FaGift } from 'react-icons/fa';

function App() {
  const botUsername = import.meta.env.VITE_BOT_USERNAME;
  const [characters, setCharacters] = useState([]);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    // Загрузка подарков
    fetch('/gifts.json')
      .then(response => response.json())
      .then(data => setGifts(data))
      .catch(error => console.error('Error fetching gifts:', error));
  }, []);

  useEffect(() => {
    import('./data/characters.js').then(module => {
      const allCharacters = module.default;
      const filtered = allCharacters.filter(character => character.enabled !== false);
      setCharacters(filtered);
    });
  }, []);

  const handleTelegramLinkClick = (e) => {
    // Предотвращаем стандартный переход по ссылке
    e.preventDefault();

    // Получаем смещение в минутах (например, для UTC+3 это будет -180)
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    // Конвертируем в часы (например, -180 / -60 = 3)
    const timezoneOffsetHours = timezoneOffsetMinutes / -60;
    
    // Формируем deep link
    const deepLink = `https://t.me/${botUsername}?start=time_${timezoneOffsetHours}`;
    
    // Перенаправляем пользователя по новой ссылке
    window.location.href = deepLink;
  };

  const advantages = [
    { icon: <FaComments size={30} className="mx-auto mb-4 text-purple-400" />, title: 'Живые диалоги', description: 'Наши AI-персонажи отлично говорят по-русски, поддерживая глубокие и осмысленные беседы.' },
    { icon: <FaUserFriends size={30} className="mx-auto mb-4 text-purple-400" />, title: 'Уникальные личности', description: 'Каждый персонаж обладает своим характером, интересами и тем, что ему не нравится.' },
    { icon: <FaBrain size={30} className="mx-auto mb-4 text-purple-400" />, title: 'Динамическая память', description: 'Персонажи запоминают детали вашего диалога, делая общение более личным.' },
    { icon: <FaGift size={30} className="mx-auto mb-4 text-purple-400" />, title: 'Интерактивные подарки', description: 'Удивляйте персонажей, даря им подарки, и наблюдайте за их уникальной реакцией.' }
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      
      <div className="text-center w-full max-w-4xl pt-16 pb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Venice AI
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Погрузитесь в общение с глубокими AI-личностями, свободными от обычных ограничений. Откройте для себя диалоги без запретных тем.
        </p>
        <a
          href={`https://t.me/${botUsername}`}
          onClick={handleTelegramLinkClick}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Начать общение в Telegram
        </a>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Наши Персонажи</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Наши Преимущества</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {advantages.map((adv, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {adv.icon}
              <h3 className="text-2xl font-bold text-white mb-2">{adv.title}</h3>
              <p className="text-gray-400">{adv.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Доступные Подарки</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {gifts.map(gift => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 py-16">
        <div 
          className="relative rounded-lg overflow-hidden bg-cover bg-center p-8 md:p-16 text-center" 
          style={{ backgroundImage: "url('/images/cta-banner.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы погрузиться?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Ваши персонажи уже ждут вас. Начните свое незабываемое приключение в мире Venice AI прямо сейчас.
            </p>
            <a
              href={`https://t.me/${botUsername}`}
              onClick={handleTelegramLinkClick}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Перейти к боту
            </a>
          </div>
        </div>
      </div>

            <footer className="w-full text-center p-8 text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} Venice AI. Все права защищены.</p>
            </footer>
          </div>
        } />
        <Route path="/help" element={<Help />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/character/:characterId/scenes" element={<SceneSelection />} />
        <Route path="/gifts" element={<Gifts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
