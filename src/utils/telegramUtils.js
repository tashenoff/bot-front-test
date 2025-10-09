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
