import { Link } from 'react-router-dom'

const roles = [
  {
    to: '/student',
    label: 'Student',
    title: 'Student Portal',
    blurb: 'Track tuition, submit assignments, follow your routine, and grab past papers in one place.',
    accent: 'from-orange-500/20 to-orange-500/5',
    badge: 'bg-orange-500/15 text-orange-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    to: '/teacher',
    label: 'Teacher',
    title: 'Teacher Portal',
    blurb: 'Mark attendance live, post homework, and keep every batch on track without spreadsheets.',
    accent: 'from-cyan-500/20 to-cyan-500/5',
    badge: 'bg-cyan-500/15 text-cyan-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    to: '/parent',
    label: 'Parent',
    title: 'Parent Portal',
    blurb: 'See attendance, grades, teacher remarks, and pay fees without chasing updates over chat.',
    accent: 'from-violet-500/20 to-violet-500/5',
    badge: 'bg-violet-500/15 text-violet-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/admin',
    label: 'Admin',
    title: 'Admin ERP',
    blurb: 'Run the whole academy — students, fees, timetable, and exports — from one operations desk.',
    accent: 'from-slate-500/20 to-slate-500/5',
    badge: 'bg-slate-500/15 text-slate-700',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
]

export function ExperienceAs() {
  return (
    <section id="explore" className="relative -mt-16 mx-auto w-[min(100%-1.5rem,1120px)] scroll-mt-28 pt-4 pb-16 sm:pb-20">
      <div className="scroll-reveal mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[0.14em] text-orange-600 uppercase">Live demo</p>
        <h2 className="ink mt-2 text-[clamp(1.6rem,3.5vw,2.25rem)] font-bold tracking-tight">
          Pick a role and jump into the live demo
        </h2>
        <p className="muted mt-3 text-base font-medium">
          Each portal is interactive — change data in one place and it syncs across the others.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
        {roles.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className={`scroll-reveal glass group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 sm:p-7 ${r.accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${r.badge}`}>
                <span className="ink">{r.icon}</span>
                {r.label}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-500 text-white shadow-[0_10px_24px_rgba(249,115,22,0.35)] transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <h3 className="ink mt-5 text-2xl font-bold tracking-tight">{r.title}</h3>
            <p className="muted mt-2 flex-1 text-sm leading-relaxed font-medium sm:text-[0.95rem]">{r.blurb}</p>
            <p className="mt-5 text-sm font-bold text-orange-600">
              Open {r.label} experience
              <span className="ml-1 inline-block transition group-hover:translate-x-1">→</span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
