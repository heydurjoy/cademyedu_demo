import { Link, NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useDemoStore } from '../../store/useDemoStore'
import { PageTransition } from './PageTransition'

const portals = [
  { to: '/', label: 'Home', end: true },
  { to: '/student', label: 'Student Portal' },
  { to: '/teacher', label: 'Teacher Portal' },
  { to: '/parent', label: 'Parent Portal' },
  { to: '/admin', label: 'Admin ERP' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const { theme, toggleTheme } = useTheme()

  // Admin has its own fixed sidebar — don't wrap it in a transformed page shell
  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen">
      <div className="nav-chrome">
        <div className="nav-scroll-fade" aria-hidden />
        <header className="pointer-events-none relative mx-auto flex w-[min(100%-1.5rem,1120px)] items-center justify-between gap-3 pt-3 pb-2">
          <Link
            to="/"
            className="pointer-events-auto flex min-h-11 items-center rounded-full bg-[#0b1220] px-3.5 py-1.5 shadow-sm"
            aria-label="Cademy home"
          >
            <img
              src="./assets/logo.png"
              alt="Cademy"
              className="h-6 w-auto max-w-[9rem] object-contain"
            />
          </Link>

          <nav className="glass pointer-events-auto hidden min-h-12 items-center gap-1 rounded-full p-1.5 md:flex" aria-label="Primary">
            {portals.map((p) => (
              <NavLink
                key={p.to}
                to={p.to}
                end={p.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-[0_8px_22px_rgba(249,115,22,0.35)]'
                      : 'muted hover:bg-black/5 hover:text-[color:var(--ink)]'
                  }`
                }
              >
                {p.label}
              </NavLink>
            ))}
          </nav>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all demo data to factory state?')) resetDemo()
              }}
              className="glass muted hidden rounded-full px-3.5 py-2 text-sm font-semibold hover:bg-black/5 sm:inline-flex"
            >
              Reset Demo
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`pointer-events-auto grid h-12 w-12 place-items-center rounded-full shadow-sm transition ${
                theme === 'light'
                  ? 'border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  : 'glass text-slate-200 hover:bg-white/10'
              }`}
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              title={theme === 'light' ? 'Dark theme' : 'Light theme'}
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 14.5A8.5 8.5 0 1 1 12.5 3 7 7 0 0 0 21 14.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              )}
            </button>
            <MobileNav />
          </div>
        </header>
      </div>

      <main>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary className="glass muted grid h-12 w-12 list-none place-items-center rounded-full [&::-webkit-details-marker]:hidden">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </summary>
      <div className="glass-strong absolute right-0 mt-2 w-56 rounded-3xl p-2">
        {portals.map((p) => (
          <NavLink
            key={p.to}
            to={p.to}
            end={p.end}
            className={({ isActive }) =>
              `block rounded-2xl px-3 py-2.5 text-sm font-medium ${
                isActive ? 'bg-orange-500 text-white' : 'muted hover:bg-black/5'
              }`
            }
          >
            {p.label}
          </NavLink>
        ))}
        <button
          type="button"
          className="muted mt-1 w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium hover:bg-black/5"
          onClick={() => {
            if (confirm('Reset all demo data to factory state?')) useDemoStore.getState().resetDemo()
          }}
        >
          Reset Demo
        </button>
      </div>
    </details>
  )
}
