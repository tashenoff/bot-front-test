import React from 'react';
import Layout from './Layout';
import Home from './Home';
import Help from './Help';
import Characters from './Characters';
import SceneSelection from './SceneSelection';
import CharacterPage from './CharacterPage';
import Gifts from './Gifts';
import Subscription from './Subscription';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/character/:characterId" element={<CharacterPage />} />
            <Route path="/character/:characterId/scenes" element={<SceneSelection />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
