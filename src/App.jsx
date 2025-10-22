import React from 'react';
import Layout from './Layout';
import Home from './Home';
import Help from './Help';
import Characters from './Characters';
import SceneSelection from './SceneSelection';
import CharacterPage from './CharacterPage';
import Gifts from './Gifts';
import Crystals from './Crystals';
import Subscription from './Subscription';
import Profile from './Profile';
import AgeVerificationModal from './AgeVerificationModal';
import AnnouncementPage from './AnnouncementPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { useAgeVerification } from './hooks/useAgeVerification';
import { AgeVerificationProvider } from './contexts/AgeVerificationContext';

function AppContent() {
  const {
    showModal,
    isLoading,
    handleAgeConfirmation,
    includeAdultContent
  } = useAgeVerification();

  console.log('🎯 AppContent: Состояние возрастной проверки:', {
    showModal,
    isLoading,
    includeAdultContent,
    localStorage: localStorage.getItem('ageVerificationStatus')
  });

  // Показываем загрузку пока определяется статус возраста
  if (isLoading) {
    console.log('⏳ AppContent: Показываем загрузку...');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Загрузка...</p>
        </div>
      </div>
    );
  }

  console.log('🚀 AppContent: Рендерим основное приложение с includeAdultContent =', includeAdultContent);

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Characters includeAdultContent={includeAdultContent} />} />
            <Route path="/home" element={<Home includeAdultContent={includeAdultContent} />} />
            <Route path="/help" element={<Help />} />
            <Route path="/characters" element={<Characters includeAdultContent={includeAdultContent} />} />
            <Route path="/character/:characterId" element={<CharacterPage includeAdultContent={includeAdultContent} />} />
            <Route path="/character/:characterId/scenes" element={<SceneSelection includeAdultContent={includeAdultContent} />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/crystals" element={<Crystals />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/announcement/:id" element={<AnnouncementPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      
      {/* Модальное окно проверки возраста */}
      <AgeVerificationModal
        isOpen={showModal}
        onConfirm={() => {
          console.log('🎯 App: Передаем handleAgeConfirmation(true) - пользователь взрослый');
          handleAgeConfirmation(true);
        }}
        onDecline={() => {
          console.log('🎯 App: Передаем handleAgeConfirmation(false) - пользователь несовершеннолетний');
          handleAgeConfirmation(false);
        }}
      />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AgeVerificationProvider>
        <AppContent />
      </AgeVerificationProvider>
    </LanguageProvider>
  );
}

export default App;
