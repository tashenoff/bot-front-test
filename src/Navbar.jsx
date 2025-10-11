import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaQuestionCircle, FaGlobe, FaChevronDown, FaStar } from 'react-icons/fa';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { language, switchLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const menuItems = [
    { to: '/', label: t('home'), icon: <FaHome /> },
    { to: '/characters', label: t('characters'), icon: <FaUsers /> },
    { to: '/subscription', label: t('premium'), icon: <FaStar />, premium: true },
    { to: '/help', label: t('help'), icon: <FaQuestionCircle /> }
  ];

  const languages = [
    { code: 'ru', name: t('russian'), flag: '🇷🇺' },
    { code: 'en', name: t('english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Десктопный навбар (верхний) */}
      <nav className="hidden md:block bg-gray-950/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Waifu Dreams
              </span>
            </Link>

            {/* Десктопное меню */}
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                    item.premium
                      ? isActive(item.to)
                        ? 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                        : 'text-yellow-400 hover:text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 hover:border hover:border-yellow-500/20'
                      : isActive(item.to)
                        ? 'text-purple-400 bg-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Переключатель языка */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-300"
                >
                  <FaGlobe />
                  <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
                  <FaChevronDown className={`transform transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          switchLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition duration-300 flex items-center space-x-2 ${
                          language === lang.code
                            ? 'text-purple-400 bg-gray-700'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Мобильный навбар (нижний) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg border-t border-gray-800/50 z-50">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition duration-300 ${
                item.premium
                  ? isActive(item.to)
                    ? 'text-yellow-400'
                    : 'text-yellow-400 hover:text-yellow-300'
                  : isActive(item.to)
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

      {/* Мобильный хедер (логотип + переключатель языка) */}
      <header className="md:hidden bg-gray-950/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-800/50">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Waifu Dreams
            </span>
          </Link>
          
          {/* Мобильный переключатель языка */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-300"
            >
              <FaGlobe className="text-lg" />
              <span className="text-lg">{currentLanguage?.flag}</span>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      switchLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition duration-300 flex items-center space-x-2 ${
                      language === lang.code
                        ? 'text-purple-400 bg-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
