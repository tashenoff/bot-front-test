import React from 'react';

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Справка по боту</h1>
          <p className="text-lg text-gray-700 mb-6">
            Добро пожаловать в справку по использованию бота. Здесь вы найдете всю необходимую информацию о функциях бота.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Введение</h2>
            <p className="text-gray-700 mb-4">
              Этот бот позволяет общаться с различными персонажами, отправлять подарки и исследовать разные миры и сцены.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Выберите персонажа из меню для начала чата.</li>
              <li>Используйте кнопки меню для навигации.</li>
              <li>Отправляйте подарки, чтобы улучшить взаимодействие.</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Персонажи</h2>
            <p className="text-gray-700 mb-4">
              Доступны различные персонажи с уникальными историями и личностями.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Нажмите на карточку персонажа, чтобы начать общение.</li>
              <li>Каждый персонаж имеет свой фон и стиль разговора.</li>
              <li>Используйте /start для возврата к выбору персонажей.</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Подарки</h2>
            <p className="text-gray-700 mb-4">
              Отправьте подарки персонажам, чтобы сделать взаимодействие более увлекательным.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Выберите подарок из меню подарков.</li>
              <li>Подарки влияют на настроение и ответы персонажа.</li>
              <li>Доступные подарки: вино, розы, белье и т.д.</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Дополнительные функции</h2>
            <p className="text-gray-700 mb-4">
              Бот поддерживает дополнительные возможности для улучшения опыта.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Генерация изображений по запросу.</li>
              <li>Случайные сцены и миры.</li>
              <li>Настройка доверия и отношений с персонажами.</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Команды бота</h2>
            <div className="text-gray-700 space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">🌟 Основные команды:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>/start - Начать общение с персонажем</li>
                  <li>/reset - Очистить историю и выбрать нового персонажа</li>
                  <li>/gifts - Посмотреть доступные подарки</li>
                  <li>/give [id подарка] - Отправить подарок персонажу</li>
                  <li>/style [инструкция] - Задать временную инструкцию для персонажа</li>
                  <li>/memory - Показать краткосрочную память</li>
                  <li>/lewdness [0-100] - Установить уровень пошлости</li>
                  <li>/lore - Узнать о связях персонажа</li>
                  <li>/world - Переключить мир (сохраняет память)</li>
                  <li>/story - Начать исторический режим</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">🎨 Генерация изображений:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>/force_image [описание] - Принудительно сгенерировать изображение</li>
                  <li>Нажмите 🔄 в ответе персонажа для регенерации</li>
                  <li>Кнопка 📸 "Сгенерировать изображение" в меню</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">💝 Подарки и платежи:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Подарки влияют на настроение персонажа</li>
                  <li>После оплаты подарок отправляется автоматически</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">🤖 Функции бота:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Живой чат с AI-персонажами на русском языке</li>
                  <li>Динамическая память и уникальные личности</li>
                  <li>Генерация изображений по контексту диалога</li>
                  <li>Сцены, миры и подарки для immersion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">❓ Если что-то не работает:</h3>
                <p className="text-gray-700">Попробуйте /reset или обратитесь к администратору.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Поддержка</h2>
            <p className="text-gray-700 mb-4">
              Если у вас возникли проблемы, обратитесь к администратору или используйте /help в боте.
            </p>
            <p className="text-gray-700">
              Для вопросов по фронтенду посетите <a href="/" className="text-blue-600 hover:underline">главную страницу</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
