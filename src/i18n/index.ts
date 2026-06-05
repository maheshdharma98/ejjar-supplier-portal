import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

const savedLang = localStorage.getItem('ejjar_supplier_lang') || 'en'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

if (savedLang === 'ar') {
  document.documentElement.dir = 'rtl'
  document.body.style.fontFamily = 'Cairo, sans-serif'
}

export default i18n
