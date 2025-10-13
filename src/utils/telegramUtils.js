// Утилиты для работы с Telegram диплинками и временными зонами

/**
 * Получает смещение временной зоны в часах
 * @returns {number} Смещение в часах
 */
export const getTimezoneOffset = () => {
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();
  return timezoneOffsetMinutes / -60;
};

/**
 * Создает диплинк для Telegram бота
 * @param {Object} character - Объект персонажа
 * @param {Object} scene - Объект сцены
 * @param {string} botUsername - Имя пользователя бота
 * @returns {string} Диплинк для Telegram
 */
export const createTelegramDeepLink = (character, scene, botUsername) => {
  if (!character || !scene || !botUsername) {
    console.error('Недостаточно данных для создания диплинка');
    return null;
  }

  const timezoneOffset = getTimezoneOffset();
  const param = `char-${character.id}-world-${character.world_id}-scene-${scene.id}-free-${timezoneOffset}`;
  
  return `https://t.me/${botUsername}?start=${encodeURIComponent(param)}`;
};

/**
 * Открывает диплинк в Telegram
 * @param {string} deepLink - Диплинк для открытия
 */
export const openTelegramLink = (deepLink) => {
  if (!deepLink) {
    console.error('Диплинк не предоставлен');
    return;
  }

  // Проверяем, доступен ли API Telegram Web App
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.openTelegramLink(deepLink);
    window.Telegram.WebApp.close();
  } else {
    // Фоллбэк для открытия в обычном браузере
    window.location.href = deepLink;
  }
};

/**
 * Обрабатывает выбор сцены и открывает диплинк
 * @param {Object} character - Объект персонажа
 * @param {Object} scene - Объект сцены
 * @param {string} botUsername - Имя пользователя бота
 */
export const handleSceneSelection = (character, scene, botUsername) => {
  const deepLink = createTelegramDeepLink(character, scene, botUsername);
  if (deepLink) {
    openTelegramLink(deepLink);
  }
};

/**
 * Отправляет данные боту через Telegram WebApp
 * @param {Object} data - Данные для отправки
 */
export const sendDataToBot = (data) => {
  try {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Отправка данных боту:', data);
      window.Telegram.WebApp.sendData(JSON.stringify(data));
    } else {
      console.error('Telegram WebApp API недоступен');
      // Фоллбэк - можно показать ошибку пользователю
      alert('Ошибка: Telegram WebApp API недоступен');
    }
  } catch (error) {
    console.error('Ошибка при отправке данных боту:', error);
    alert('Произошла ошибка при отправке данных');
  }
};

/**
 * Создает диплинк для открытия профиля пользователя
 * @param {number} userId - ID пользователя
 * @param {string} botUsername - Имя пользователя бота
 * @returns {string} Диплинк для Telegram
 */
export const createProfileDeepLink = (userId, botUsername) => {
  if (!userId || !botUsername) {
    console.error('Недостаточно данных для создания диплинка профиля');
    return null;
  }

  return `https://t.me/${botUsername}?start=profile_${userId}`;
};

/**
 * Получает ID пользователя из Telegram WebApp или URL параметров
 * @returns {number|null} ID пользователя или null если не найден
 */
export const extractUserIdFromTelegram = () => {
  // Проверяем доступность Telegram WebApp API
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (user && user.id) {
      return user.id;
    }
  }
  
  // Фоллбэк для разработки - извлечение из URL параметров
  const urlParams = new URLSearchParams(window.location.search);
  const userIdParam = urlParams.get('user_id');
  if (userIdParam && !isNaN(parseInt(userIdParam))) {
    return parseInt(userIdParam);
  }
  
  return null;
};

/**
 * Открывает диплинк профиля в Telegram
 * @param {number} userId - ID пользователя  
 * @param {string} botUsername - Имя пользователя бота
 */
export const openProfileInTelegram = (userId, botUsername) => {
  const deepLink = createProfileDeepLink(userId, botUsername);
  if (deepLink) {
    openTelegramLink(deepLink);
  }
};
