# EJJAR Supplier Portal
Type: Web application (browser)
Stack: React 18 + TypeScript, Vite, TailwindCSS v3,
shadcn/ui, React Router v6, Zustand, Recharts,
i18next + react-i18next
Primary: #1A4FBA | Sidebar: #0F172A
Mock data: ../../shared/mock/
Masking: Contractor always "Contractor #XXXX"
Language: EN/AR, RTL via document dir,
Cairo font for Arabic, localStorage: ejjar_supplier_lang
Pages: /login /dashboard /rfqs /rfqs/:id
/resources /jobs /reviews /settings

Setup steps:
1. npm create vite@latest . -- --template react-ts
2. npm install tailwindcss postcss autoprefixer
   react-router-dom zustand recharts axios
   lucide-react date-fns i18next react-i18next
3. npx tailwindcss init -p
4. npx shadcn@latest init
   style: default, base: slate, CSS vars: yes
5. npx shadcn@latest add button card input label
   select table badge tabs dialog sheet skeleton
   toast separator avatar progress
6. tailwind.config.js extend colors: primary #1A4FBA
7. index.html: add Cairo Google Font link
8. Create src/pages/ src/components/layout/
   src/store/ src/utils/ src/types/
   src/i18n/ src/i18n/locales/
9. i18n: en.json + ar.json with all page strings
10. LanguageSwitcher.tsx:
    "EN | عربي" button in navbar
    On switch:
      i18n.changeLanguage(lang)
      document.documentElement.dir = lang==='ar' ? 'rtl' : 'ltr'
      document.body.style.fontFamily = lang==='ar' ? 'Cairo,sans-serif' : 'inherit'
      localStorage.setItem('ejjar_supplier_lang', lang)
11. Sidebar.tsx: dark #0F172A, lucide icons nav links
12. Navbar.tsx: LanguageSwitcher + user name + logout
13. Layout.tsx: Sidebar + Navbar + main area
14. App.tsx: all routes setup
