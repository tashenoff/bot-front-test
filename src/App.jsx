import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

const Layout = lazy(() => import('./Layout'));
const Help = lazy(() => import('./Help'));
const Characters = lazy(() => import('./Characters'));
const CharacterPage = lazy(() => import('./CharacterPage'));
const SceneSelection = lazy(() => import('./SceneSelection'));
const Gifts = lazy(() => import('./Gifts'));
const Subscription = lazy(() => import('./Subscription'));
const Profile = lazy(() => import('./Profile'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/characters" replace />} />
              <Route path="/help" element={<Help />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/character/:characterId" element={<CharacterPage />} />
              <Route path="/character/:characterId/scenes" element={<SceneSelection />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
