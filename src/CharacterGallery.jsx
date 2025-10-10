import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useTranslation } from './hooks/useTranslation';
import 'swiper/css';
import 'swiper/css/navigation';

const CharacterGallery = ({ character }) => {
  const { t, language } = useTranslation();

  // Получаем локализованное имя
  const getName = () => {
    if (typeof character.name === 'object') {
      return character.name[language] || character.name.ru;
    }
    return character.name;
  };

  const name = getName();

  if (!character.gallery || character.gallery.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {language === 'en' ? 'Gallery not available' : 'Галерея не доступна'}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-4 text-center text-purple-400">
        {language === 'en' ? 'Character Gallery' : 'Галерея персонажа'}
      </h3>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        className="w-full max-w-4xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800"
      >
        {character.gallery.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-auto max-h-[80vh] flex items-center justify-center">
              <img 
                src={img} 
                alt={`Галерея ${name}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg" 
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-lg z-20 cursor-pointer transition-all duration-300 border border-white/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-lg z-20 cursor-pointer transition-all duration-300 border border-white/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>
    </div>
  );
};

export default CharacterGallery;
