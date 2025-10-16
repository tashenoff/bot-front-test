import React from 'react';

const LoadingButton = ({ 
  onClick, 
  isLoading, 
  children, 
  className = '',
  loadingText = { en: 'Processing...', ru: 'Обработка...' },
  disabled = false,
  language = 'ru'
}) => {
  const baseClassName = "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all";
  const loadingClassName = "cursor-not-allowed opacity-75";
  
  return (
    <button 
      className={`${baseClassName} ${isLoading ? loadingClassName : ''} ${className}`}
      onClick={async (e) => {
        if (isLoading || disabled) return;
        if (onClick) {
          await onClick(e);
        }
      }}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText[language]}
        </div>
      ) : children}
    </button>
  );
};

export default LoadingButton;
