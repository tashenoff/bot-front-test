// Утилиты для оптимизации производительности

// Debounce функция для ограничения частоты вызовов
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle функция для ограничения частоты вызовов
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Функция для предзагрузки изображений
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Пакетная предзагрузка изображений
export const preloadImages = async (urls, { 
  maxConcurrent = 3,
  timeout = 10000 
} = {}) => {
  const results = [];
  
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const promises = batch.map(url => {
      return Promise.race([
        preloadImage(url),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]).catch(error => ({ error, url }));
    });
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }
  
  return results;
};

// Функция для определения поддержки WebP
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Функция для получения оптимального формата изображения
export const getOptimalImageFormat = (originalUrl) => {
  if (!originalUrl) return originalUrl;
  
  // Если поддерживается WebP, пытаемся использовать его
  if (supportsWebP() && !originalUrl.includes('.webp')) {
    const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpUrl;
  }
  
  return originalUrl;
};

// Функция для измерения производительности
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.log(`[Performance] ${name} (error): ${(end - start).toFixed(2)}ms`);
      throw error;
    }
  };
};

// Intersection Observer для ленивой загрузки
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, defaultOptions);
  }

  // Fallback для старых браузеров
  return {
    observe: (element) => {
      // Немедленно вызываем callback для совместимости
      callback([{ target: element, isIntersecting: true }]);
    },
    unobserve: () => {},
    disconnect: () => {}
  };
};

// Функция для оптимизации рендера больших списков
export const createVirtualizer = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const buffer = Math.floor(visibleCount * 0.5);
  
  return (scrollTop) => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + visibleCount + buffer,
      items.length - 1
    );
    const actualStartIndex = Math.max(0, startIndex - buffer);
    
    return {
      startIndex: actualStartIndex,
      endIndex,
      visibleItems: items.slice(actualStartIndex, endIndex + 1),
      offsetY: actualStartIndex * itemHeight,
      totalHeight: items.length * itemHeight
    };
  };
};

// Memory management utilities
export const memoryUtils = {
  // Очистка неиспользуемых ресурсов
  cleanup: () => {
    if (window.gc) {
      window.gc();
    }
  },
  
  // Получение информации об использовании памяти
  getMemoryInfo: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  },
  
  // Мониторинг использования памяти
  startMemoryMonitoring: (interval = 5000) => {
    return setInterval(() => {
      const info = memoryUtils.getMemoryInfo();
      if (info) {
        console.log(`[Memory] Used: ${info.used}MB, Total: ${info.total}MB, Limit: ${info.limit}MB`);
      }
    }, interval);
  }
};

export default {
  debounce,
  throttle,
  preloadImage,
  preloadImages,
  supportsWebP,
  getOptimalImageFormat,
  measurePerformance,
  createIntersectionObserver,
  createVirtualizer,
  memoryUtils
};
