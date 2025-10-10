import React from 'react';
import { useTranslation } from './hooks/useTranslation';

const Help = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-950 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t('botGuideTitle')}</h1>
          <p className="text-lg text-gray-300 mb-6">
            {t('botGuideDescription')}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('introductionTitle')}</h2>
            <p className="text-gray-300 mb-4">
              {t('introductionText')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t('introInstructions').map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('charactersTitle')}</h2>
            <p className="text-gray-300 mb-4">
              {t('charactersText')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t('charactersInstructions').map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('giftsTitle')}</h2>
            <p className="text-gray-300 mb-4">
              {t('giftsText')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t('giftsInstructions').map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('additionalFeaturesTitle')}</h2>
            <p className="text-gray-300 mb-4">
              {t('additionalFeaturesText')}
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              {t('additionalInstructions').map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('botCommandsTitle')}</h2>
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">{t('basicCommandsTitle')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {t('basicCommands').map((command, index) => (
                    <li key={index}>{command}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{t('imageCommandsTitle')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {t('imageCommands').map((command, index) => (
                    <li key={index}>{command}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{t('giftCommandsTitle')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {t('giftCommands').map((command, index) => (
                    <li key={index}>{command}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{t('botFeaturesTitle')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {t('botFeatures').map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">{t('troubleshootingTitle')}</h3>
                <p className="text-gray-300">{t('troubleshootingText')}</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">{t('supportTitle')}</h2>
            <p className="text-gray-300 mb-4">
              {t('supportText')}
            </p>
            <p className="text-gray-300">
              {t('supportLinkText')} <a href="/" className="text-purple-400 hover:text-purple-300">{t('mainPageLink')}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Help;
