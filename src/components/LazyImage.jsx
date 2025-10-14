import React, { useState, useCallback, memo } from 'react';

const LazyImage = memo(({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  loadingClassName = 'bg-gray-700 animate-pulse',
  errorSrc = null,
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [imageState, setImageState] = useState('loading');
  const [imageSrc, setImageSrc] = useState('');

  const handleLoad = useCallback((event) => {
    setImageState('loaded');
    if (onLoad) onLoad(event);
  }, [onLoad]);

  const handleError = useCallback((event) => {
    setImageState('error');
    if (errorSrc) {
      setImageSrc(errorSrc);
    }
    if (onError) onError(event);
  }, [errorSrc, onError]);

  const handleImageLoad = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageState('ready');
    };
    img.onerror = () => {
      setImageState('error');
      if (errorSrc) {
        setImageSrc(errorSrc);
      }
    };
    img.src = src;
  }, [src, errorSrc]);

  React.useEffect(() => {
    if (src) {
      handleImageLoad();
    }
  }, [src, handleImageLoad]);

  // Показываем плейсхолдер во время загрузки
  if (imageState === 'loading' || imageState === 'ready') {
    return (
      <div className={`${loadingClassName} ${className}`} {...props}>
        {placeholder || (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">Загрузка...</span>
          </div>
        )}
        {imageState === 'ready' && (
          <img
            src={imageSrc}
            alt={alt}
            className={`${className} absolute top-0 left-0 w-full h-full object-cover opacity-0`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}
      </div>
    );
  }

  // Показываем изображение или ошибку
  return (
    <img
      src={imageSrc || src}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
