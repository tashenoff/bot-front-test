import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaQuestionCircle, FaGlobe, FaChevronDown, FaStar, FaUser, FaPlus } from 'react-icons/fa';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './contexts/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, switchLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [crystalBalance, setCrystalBalance] = useState(0);
  const [messagesLeft, setMessagesLeft] = useState(0);
  const [messageLimit, setMessageLimit] = useState(0);
  const [userId, setUserId] = useState(null);

  const menuItems = [
    { to: '/', label: t('home'), icon: <FaHome /> },
    { to: '/characters', label: t('characters'), icon: <FaUsers /> },
    { to: '/subscription', label: t('premium'), icon: <FaStar />, premium: true },
    { to: '/help', label: t('help'), icon: <FaQuestionCircle /> }
  ];

  const mobileMenuItems = menuItems.filter(item => item.to !== '/');

  const languages = [
    { code: 'ru', name: t('russian'), flag: '🇷🇺' },
    { code: 'en', name: t('english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    // Инициализация и получение пользователя из Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const webAppUser = tg.initDataUnsafe?.user;
      const webAppChat = tg.initDataUnsafe?.chat;
      
      let currentUserId = null;
      if (webAppChat) {
        currentUserId = webAppChat.id;
      } else if (webAppUser) {
        currentUserId = webAppUser.id;
      }
      
      if (currentUserId) {
        setUserId(currentUserId);
        loadUserData(currentUserId);
      }
    }
  }, []);

  const loadUserData = async (user_id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/user/${user_id}/profile`);
      
      if (response.ok) {
        const userData = await response.json();
        setCrystalBalance(userData.crystal_balance || 0);
        
        // Проверяем премиум статус
        const isPremium = userData.subscription?.is_premium || false;
        
        if (isPremium) {
          // Премиум пользователи - безлимит
          setMessageLimit(999);  // "Безлимит"
          setMessagesLeft(999);
        } else {
          // Обычные пользователи - ограничение
          const limit = userData.free_messages_limit || 10;
          const used = userData.messages_today || 0;
          const left = Math.max(0, limit - used);
          
          setMessageLimit(limit);
          setMessagesLeft(left);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setCrystalBalance(0);
      setMessageLimit(10);
      setMessagesLeft(10);
    }
  };

  const handleCrystalClick = () => {
    navigate('/gifts');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Компонент отображения счетчика сообщений
  const MessageDisplay = ({ isMobile = false }) => {
    const isPremium = messageLimit === 999;
    const isLow = messagesLeft <= 2 && !isPremium;
    const progressPercent = isPremium ? 100 : (messageLimit > 0 ? (messagesLeft / messageLimit) * 100 : 0);
    
    return (
      <div className={`flex items-center space-x-2 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} ${
        isPremium 
          ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' 
          : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
      } rounded-lg relative overflow-hidden`}>
        {/* Прогресс-бар фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div 
            className={`h-full transition-all duration-500 ${
              isPremium 
                ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30'
                : isLow 
                  ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30' 
                  : 'bg-gradient-to-r from-green-500/30 to-emerald-500/30'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <span className="text-lg relative z-10">💬</span>
        <span className={`font-semibold relative z-10 ${
          isPremium 
            ? 'text-yellow-400' 
            : isLow 
              ? 'text-red-400' 
              : 'text-green-400'
        } ${isMobile ? 'text-sm' : 'text-sm'}`}>
          {isPremium ? '∞' : `${messagesLeft}/${messageLimit}`}
        </span>
      </div>
    );
  };

  // Компонент отображения кристаллов
  const CrystalDisplay = ({ isMobile = false }) => (
    <div className={`flex items-center space-x-2 ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg`}>
      <span className="text-lg">💎</span>
      <span className={`font-semibold text-blue-400 ${isMobile ? 'text-sm' : 'text-sm'}`}>
        {crystalBalance}
      </span>
      <button
        onClick={handleCrystalClick}
        className="ml-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
      >
        <FaPlus className="text-xs text-white" />
      </button>
    </div>
  );

  return (
    <>
      {/* Десктопный навбар (верхний) */}
      <nav className="hidden md:block bg-gray-950/80 backdrop-blur-lg shadow-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2">
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
              
              {/* Счетчик сообщений */}
              <MessageDisplay />
              
              {/* Кристаллы */}
              <CrystalDisplay />
              
              {/* Профиль */}
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  isActive('/profile')
                    ? 'text-purple-400 bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FaUser />
              </Link>

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
          {mobileMenuItems.map((item) => (
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
      <header className="md:hidden bg-gray-950/80 backdrop-blur-lg shadow-lg border-b border-gray-800/50">
        <div className="flex justify-between items-center h-16 px-4">
          <Link to="/" className="flex items-center space-x-2">
          </Link>
          
          {/* Мобильный профиль и переключатель языка */}
          <div className="flex items-center space-x-2">
            {/* Счетчик сообщений мобильная версия */}
            <MessageDisplay isMobile={true} />
            
            {/* Кристаллы мобильная версия */}
            <CrystalDisplay isMobile={true} />
            
            <Link
              to="/profile"
              className={`flex items-center px-2 py-1 rounded-md transition duration-300 ${
                isActive('/profile')
                  ? 'text-purple-400 bg-gray-700'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <FaUser className="text-lg" />
            </Link>
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
        </div>
      </header>
    </>
  );
};

export default Navbar;
