// EJJAR Design System v1.0 — single source of truth for all tokens
// Brand: Navy (trust) · Orange (action) · Sky Blue (clarity)
// Rule 16: ALL colors defined here — no inline hex in components

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // ── EJJAR v1.0 Brand Tokens ─────────────────────────────────────
      colors: {
        // Core brand — 70 / 20 / 10 usage ratio enforced
        navy:         '#101828',   // trust — navigation, headers, logo

        // Prefixed to avoid collision with Tailwind's built-in orange-* / sky-*
        'brand-orange': '#E67E3A', // action — CTA, active states (≤1 per screen)
        'brand-sky':    '#4DA8C7', // clarity — charts, info, secondary actions

        // Semantic
        'sem-success': '#22C55E',
        'sem-warning': '#F59E0B',
        'sem-error':   '#EF4444',
        'sem-info':    '#4DA8C7',

        // Surface tokens
        page:          '#F8FAFC',  // web page background (always)
        'card-border': '#E2E8F0',  // all card borders

        // Text scale — use ink-* classes
        ink: {
          DEFAULT: '#0F172A',  // text-ink       — primary body
          sub:     '#475569',  // text-ink-sub   — secondary / captions
          dim:     '#64748B',  // text-ink-dim   — muted / placeholders
        },

        // ── Status badge pairs (FIXED across all screens) ────────────
        // Usage: bg-badge-success-bg text-badge-success-fg
        badge: {
          'success-bg':  '#DCFCE7',  'success-fg':  '#166534',
          'warning-bg':  '#FEF9C3',  'warning-fg':  '#854D0E',
          'info-bg':     '#E0F2FE',  'info-fg':     '#0369A1',
          'pending-bg':  '#F1F5F9',  'pending-fg':  '#475569',
          'error-bg':    '#FEE2E2',  'error-fg':    '#991B1B',
        },

        // ── Chart palette (always sky-primary, orange-secondary) ─────
        'chart-primary':   '#4DA8C7',  // Sky Blue
        'chart-secondary': '#E67E3A',  // Orange
        'chart-muted':     '#94A3B8',  // Slate

        // ── shadcn/ui pass-through tokens — do not remove ────────────
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // ── Radius scale ─────────────────────────────────────────────────
      borderRadius: {
        card:   '16px',
        button: '12px',
        input:  '12px',
        badge:  '9999px',
        // shadcn pass-throughs
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ── Shadow scale ─────────────────────────────────────────────────
      boxShadow: {
        card:    '0 1px 6px rgba(0,0,0,0.06)',
        cta:     '0 2px 12px rgba(230,126,58,0.20)',
        // nothing heavier per spec
      },

      // ── Typography ───────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ["'SF Mono'", "'Fira Mono'", 'Menlo', 'monospace'],
      },

      // ── Spacing: 8px base grid ───────────────────────────────────────
      // Tailwind's default 4px base * 2 = 8px grid: p-2=8px, p-4=16px, p-6=24px ✓

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
