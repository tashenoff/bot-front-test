// Performance optimizations and monitoring
export const enableMapSet = () => {
  if (!globalThis.Map) globalThis.Map = Map;
  if (!globalThis.Set) globalThis.Set = Set;
};

export const performanceMonitor = () => {
  const startTime = performance.now();

  return {
    measureStart: (label) => performance.mark(`${label}-start`),
    measureEnd: (label) => {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
        const duration = performance.getEntriesByName(label)[0]?.duration;
        console.log(`Performance: ${label} - ${duration?.toFixed(2)}ms`);
      } catch (e) {
        console.warn('Performance API not available');
      }
    },
    getDuration: () => Math.round(performance.now() - startTime)
  };
};

export const optimizeFontLoading = () => {
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });

    // Fallback for unsupported browsers
    setTimeout(() => {
      if (!document.body.classList.contains('fonts-loaded')) {
        document.body.classList.add('fonts-loaded');
      }
    }, 3000);
  }
};

export const createVirtualList = (items, container, itemHeight) => {
  return {
    render: (startIndex, endIndex) => {
      const visibleItems = items.slice(startIndex, endIndex);
      const offsetTop = startIndex * itemHeight;

      container.style.transform = `translateY(${offsetTop}px)`;
      return visibleItems.map(item => item);
    },
    getStartIndex: () => Math.floor(container.scrollTop / itemHeight),
    getEndIndex: () => Math.floor((container.scrollTop + container.clientHeight) / itemHeight)
  };
};
