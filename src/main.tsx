import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

// Set dir + lang before React renders so there's no LTR→RTL flash on Arabic sessions
const _lang =
  localStorage.getItem('ejjar_supplier_lang') ||
  localStorage.getItem('i18nextLng') ||
  'en'
document.documentElement.setAttribute('dir', _lang === 'ar' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', _lang)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
