import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaQuestionCircle } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { to: '/', label: 'Главная', icon: <FaHome /> },
    { to: '/characters', label: 'Персонажи', icon: <FaUsers /> },
    { to: '/help', label: 'Помощь', icon: <FaQuestionCircle /> }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Десктопный навбар (верхний) */}
      <nav className="hidden md:block bg-gray-950 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Waifu Dreams
              </span>
            </Link>

            {/* Десктопное меню */}
            <div className="flex space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    isActive(item.to)
                      ? 'text-purple-400 bg-gray-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Мобильный навбар (нижний) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-50">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition duration-300 ${
                isActive(item.to)
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="text-xl mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Мобильный хедер (только логотип) */}
      <header className="md:hidden bg-gray-950 shadow-lg sticky top-0 z-40">
        <div className="flex justify-center items-center h-16 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Waifu Dreams
            </span>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
