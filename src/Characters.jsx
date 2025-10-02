import React, { useState, useEffect, useRef, useCallback } from 'react';
import CharacterCard from './CharacterCard';
import characters from './data/characters';

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showArrow, setShowArrow] = useState(false);
  const observer = useRef(null);
  const sentinelRef = useRef(null);

  const filteredCharacters = characters.filter(character => character.enabled !== false).filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMore = useCallback(() => {
    setVisibleCount(prev => prev + 4);
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < filteredCharacters.length) {
        loadMore();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
      observer.current.disconnect();
    }
  };
}, [filteredCharacters.length, visibleCount, loadMore]);

  useEffect(() => {
    setVisibleCount(6);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const visibleCharacters = filteredCharacters.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCharacters.length;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">Все персонажи</h1>
        <div className="mb-6 relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск по персонажам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCharacters.map(character => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="h-10"></div>
            )}
          </>
        )}
      </div>
      {showArrow && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg z-50 transition-opacity duration-300"
          aria-label="Наверх"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Characters;
