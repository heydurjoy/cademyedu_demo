import { type FormEvent, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { formatBdt, seedSchedule, teacherBatches, type Board } from '../mockData'
import { useDemoStore } from '../store/useDemoStore'

type AdminSection = 'dashboard' | 'students' | 'schedule'

const mainNav: { id: AdminSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Overview', icon: 'overview' },
  { id: 'students', label: 'Students', icon: 'students' },
  { id: 'schedule', label: 'Timetable', icon: 'schedule' },
]

const portals = [
  { to: '/student', label: 'Student Portal' },
  { to: '/teacher', label: 'Teacher Portal' },
  { to: '/parent', label: 'Parent Portal' },
]

function Icon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  const c = className
  switch (name) {
    case 'overview':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'students':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'schedule':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case 'search':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
      )
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'home':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      )
    default:
      return null
  }
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 36 - ((v - min) / range) * 28
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 40" className="h-10 w-full" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

export function AdminPortal() {
  const students = useDemoStore((s) => s.students)
  const togglePayment = useDemoStore((s) => s.togglePayment)
  const addStudent = useDemoStore((s) => s.addStudent)
  const exportStudentsCsv = useDemoStore((s) => s.exportStudentsCsv)
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const getKpis = useDemoStore((s) => s.getKpis)
  const kpis = getKpis()

  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [q, setQ] = useState('')
  const [board, setBoard] = useState<'All' | Board>('All')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    level: 'IAL',
    board: 'Edexcel' as Board,
    batch: teacherBatches[0] as string,
    monthlyFee: 4500,
  })

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return students.filter((s) => {
      const matchBoard = board === 'All' || s.board === board
      const matchQ =
        !query || s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)
      return matchBoard && matchQ
    })
  }, [students, q, board])

  const paidCount = students.filter((s) => s.paymentStatus === 'Paid').length
  const dueCount = students.filter((s) => s.paymentStatus !== 'Paid').length
  const paidPct = kpis.target ? Math.round((kpis.collected / kpis.target) * 1000) / 10 : 0
  const avgFee = kpis.totalStudents ? Math.round(kpis.target / kpis.totalStudents) : 0
  const edexcelPct = students.length
    ? Math.round((students.filter((s) => s.board === 'Edexcel').length / students.length) * 1000) / 10
    : 0
  const cambridgePct = students.length
    ? Math.round((students.filter((s) => s.board === 'Cambridge').length / students.length) * 1000) / 10
    : 0

  const batchDist = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>()
    for (const s of students) {
      const cur = map.get(s.batch) || { count: 0, revenue: 0 }
      cur.count += 1
      cur.revenue += s.paymentStatus === 'Paid' ? s.monthlyFee : 0
      map.set(s.batch, cur)
    }
    return [...map.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [students])

  const collectionTrend = [62, 68, 71, 74, 70, 78, 82, 79, 85, paidPct || 72, 76, 80]
  const orderBars = [40, 55, 48, 62, 58, 70, 66, 78, 72, 85, 80, 90]
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const onAdd = (e: FormEvent) => {
    e.preventDefault()
    addStudent(form)
    setOpen(false)
    setForm({ name: '', level: 'IAL', board: 'Edexcel', batch: teacherBatches[0], monthlyFee: 4500 })
  }

  const goSection = (id: AdminSection) => {
    setSection(id)
    setSidebarOpen(false)
  }

  const rooms = [...new Set(seedSchedule.map((s) => s.room))]

  return (
    <div className="min-h-screen bg-[#eef1f4] text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Dark sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[272px] flex-col overflow-y-auto bg-[#030b17] text-slate-300 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <img src="./assets/logo.png" alt="" className="h-8 w-auto rounded-lg bg-white/10 px-2 py-1" />
          <div>
            <p className="text-sm font-bold tracking-tight text-white">CademyOS</p>
            <p className="text-[10px] font-medium tracking-wider text-orange-400/80 uppercase">Core Admin</p>
          </div>
        </div>

        {/* Shortcut tiles */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={() => goSection('dashboard')}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition ${
              section === 'dashboard'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                : 'bg-[#051426] text-slate-400 hover:bg-[#0a1f38] hover:text-white'
            }`}
          >
            <Icon name="overview" className="h-5 w-5" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => goSection('students')}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition ${
              section === 'students'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/40'
                : 'bg-[#051426] text-slate-400 hover:bg-[#0a1f38] hover:text-white'
            }`}
          >
            <Icon name="students" className="h-5 w-5" />
            All Students
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">Main</p>
          <ul className="space-y-0.5">
            {mainNav.map((item) => {
              const active = section === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goSection(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-white/5 text-orange-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon name={item.icon} className={`h-4 w-4 ${active ? 'text-orange-400' : ''}`} />
                    {item.label}
                  </button>
                </li>
              )
            })}
            <li>
              <button
                type="button"
                onClick={exportStudentsCsv}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <span className="grid h-4 w-4 place-items-center text-[11px]">CSV</span>
                Export CSV
                <span className="ml-auto rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-amber-300">
                  NEW
                </span>
              </button>
            </li>
          </ul>

          <p className="mt-5 mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            Portals
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <Icon name="home" />
                Marketing Home
              </Link>
            </li>
            {portals.map((p) => (
              <li key={p.to}>
                <NavLink
                  to={p.to}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  {p.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-white/5 p-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Demo storage</span>
              <span className="font-semibold text-slate-300">68.4 / 100 GB</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#051426]">
              <div className="h-full w-[68%] rounded-full bg-orange-500" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all demo data to factory state?')) resetDemo()
              }}
              className="mt-2 text-[11px] font-semibold text-orange-400 hover:text-orange-300"
            >
              Reset demo data
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#051426] px-3 py-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-xs font-bold text-white">
              CA
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Cademy Admin</p>
              <p className="truncate text-[11px] text-slate-500">Product Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main — this column scrolls; sidebar stays viewport-fixed */}
      <div className="min-h-dvh lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-[#eef1f4]/90 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          <div className="relative hidden max-w-sm flex-1 md:block">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                if (section !== 'students') setSection('students')
              }}
              placeholder="Search students, batches…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-12 pl-9 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
              <Icon name="search" className="h-3.5 w-3.5" />
            </span>
            <kbd className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-600"
            >
              <Icon name="home" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-500/25 hover:bg-orange-400 sm:inline-flex"
            >
              Quick Create
              <Icon name="plus" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500"
              aria-label="Notifications"
            >
              <Icon name="bell" className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pr-3 pl-1">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                CA
              </span>
              <span className="hidden text-xs font-semibold text-slate-700 sm:inline">Cademy Admin</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <p className="mb-4 text-xs font-medium text-slate-400">
            Dashboards <span className="text-slate-300">/</span>{' '}
            <span className="text-slate-600">
              {section === 'dashboard' ? 'Overview' : section === 'students' ? 'Students' : 'Timetable'}
            </span>
          </p>

          {section === 'dashboard' && (
            <div className="space-y-5">
              {/* Welcome banner */}
              <section
                className="relative overflow-hidden rounded-2xl px-6 py-6 text-white sm:px-8 sm:py-7"
                style={{
                  background:
                    'linear-gradient(135deg, #051426 0%, #0a1f38 50%, #030b17 100%)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Admin</h1>
                    <p className="mt-1.5 text-sm text-slate-200/90">
                      Fee collection is at <strong className="text-white">{paidPct}%</strong> of target —{' '}
                      {paidPct >= 70 ? 'ahead of last month.' : 'follow up on overdue invoices.'}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-6 sm:gap-8">
                      <div>
                        <p className="text-[11px] font-medium tracking-wide text-cyan-200/70 uppercase">
                          Collected
                        </p>
                        <p className="mt-0.5 text-lg font-bold">{formatBdt(kpis.collected)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium tracking-wide text-cyan-200/70 uppercase">
                          Students
                        </p>
                        <p className="mt-0.5 text-lg font-bold">{kpis.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium tracking-wide text-cyan-200/70 uppercase">
                          Active batches
                        </p>
                        <p className="mt-0.5 text-lg font-bold">{kpis.activeBatches}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {['FA', 'SR', 'NK', 'RA'].map((ini) => (
                          <span
                            key={ini}
                            className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#051426] bg-orange-500/40 text-[9px] font-bold"
                          >
                            {ini}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-300/70">viewing this dashboard</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={exportStudentsCsv}
                        className="rounded-xl border border-white/25 bg-white/5 px-3.5 py-2 text-sm font-semibold backdrop-blur hover:bg-white/10"
                      >
                        Export Report
                      </button>
                      <button
                        type="button"
                        onClick={() => goSection('students')}
                        className="rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 hover:bg-orange-50"
                      >
                        Refresh Data
                      </button>
                    </div>
                    <p className="text-xs text-slate-300/60">{today}</p>
                  </div>
                </div>
              </section>

              {/* KPI grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-500">Revenue collected</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                      +{paidPct}%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{formatBdt(kpis.collected)}</p>
                  <div className="mt-3">
                    <Sparkline values={collectionTrend} color="#f97316" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-500">Students enrolled</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                      +{kpis.activeBatches} batches
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{kpis.totalStudents}</p>
                  <div className="mt-3 flex h-10 items-end gap-1">
                    {orderBars.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-cyan-400/80"
                        style={{ height: `${v}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:col-span-2">
                  <p className="text-sm font-medium text-slate-500">Campus & collection health</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {paidCount} paid · {dueCount} outstanding · target {formatBdt(kpis.target)} this month.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: 'Paid', value: String(paidCount) },
                      { label: 'Collection', value: `${paidPct}%` },
                      { label: 'Unpaid', value: formatBdt(kpis.unpaid) },
                      { label: 'Avg fee', value: formatBdt(avgFee) },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-[11px] font-medium text-slate-400">{s.label}</p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-500">Average monthly fee</p>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                      live
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{formatBdt(avgFee)}</p>
                  <div className="mt-3">
                    <Sparkline values={[42, 48, 45, 55, 58, 52, 60, 64]} color="#f59e0b" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Collection rate</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{paidPct}%</p>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${Math.min(100, paidPct)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatBdt(kpis.collected)} of {formatBdt(kpis.target)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                  <p className="text-sm font-medium text-slate-500">Curriculum mix</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {edexcelPct}% <span className="text-base font-medium text-slate-400">Edexcel</span>
                  </p>
                  <div className="mt-4 space-y-2.5">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">Edexcel</span>
                        <span className="font-semibold text-slate-700">{edexcelPct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${edexcelPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">Cambridge</span>
                        <span className="font-semibold text-slate-700">{cambridgePct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-cyan-400" style={{ width: `${cambridgePct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: table + distribution */}
              <div className="grid gap-4 xl:grid-cols-5">
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm xl:col-span-3">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">Top students by fee</h2>
                    <button
                      type="button"
                      onClick={() => goSection('students')}
                      className="text-sm font-semibold text-orange-600 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="bg-slate-50/80 text-xs font-medium text-slate-400">
                        <tr>
                          <th className="px-5 py-3">Student</th>
                          <th className="px-4 py-3">Batch</th>
                          <th className="px-4 py-3">Fee</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-5 py-3">Board</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...students]
                          .sort((a, b) => b.monthlyFee - a.monthlyFee)
                          .slice(0, 6)
                          .map((s) => (
                            <tr key={s.id} className="border-t border-slate-100">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-[10px] font-bold text-orange-600">
                                    {s.name
                                      .split(' ')
                                      .map((w) => w[0])
                                      .slice(0, 2)
                                      .join('')}
                                  </span>
                                  <div>
                                    <p className="font-medium text-slate-900">{s.name}</p>
                                    <p className="text-[11px] text-slate-400">{s.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600">{s.batch.replace('Batch ', '')}</td>
                              <td className="px-4 py-3 font-medium text-slate-800">{formatBdt(s.monthlyFee)}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                    s.paymentStatus === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : s.paymentStatus === 'Overdue'
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {s.paymentStatus}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-slate-500">{s.board}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
                  <h2 className="text-base font-semibold text-slate-900">Batch revenue share</h2>
                  <p className="mt-1 text-sm text-slate-500">Paid fees by cohort this month</p>
                  <ul className="mt-5 space-y-4">
                    {batchDist.map((b, i) => {
                      const colors = ['bg-orange-500', 'bg-cyan-400', 'bg-amber-400', 'bg-violet-400', 'bg-rose-400']
                      const pct = kpis.collected ? Math.round((b.revenue / kpis.collected) * 1000) / 10 : 0
                      return (
                        <li key={b.name}>
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className={`h-2.5 w-2.5 shrink-0 rounded-md ${colors[i % colors.length]}`} />
                              <span className="truncate text-sm font-medium text-slate-700">
                                {b.name.replace('Batch ', '')}
                              </span>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-slate-800">{pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${colors[i % colors.length]}`}
                              style={{ width: `${Math.max(4, pct)}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {section === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Students</h1>
                  <p className="text-sm text-slate-500">Master directory replacing Excel sheets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Add Student
                  </button>
                  <button
                    type="button"
                    onClick={exportStudentsCsv}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name or ID…"
                  className="min-w-[200px] flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
                />
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value as typeof board)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="All">All curricula</option>
                  <option value="Edexcel">Edexcel</option>
                  <option value="Cambridge">Cambridge</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Level</th>
                      <th className="px-4 py-3 font-medium">Batch</th>
                      <th className="px-4 py-3 font-medium">Fee</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-500">{s.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {s.board} {s.level}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{s.batch.replace('Batch ', '')}</td>
                        <td className="px-4 py-3 text-slate-600">{formatBdt(s.monthlyFee)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              s.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : s.paymentStatus === 'Overdue'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {s.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => togglePayment(s.id)}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-orange-500 hover:text-white"
                          >
                            Toggle Due/Paid
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === 'schedule' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
                <p className="text-sm text-cyan-600">No double-booking detected across rooms.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {rooms.map((room) => (
                  <div key={room} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                    <p className="font-semibold text-orange-600">{room}</p>
                    <ul className="mt-3 space-y-3">
                      {seedSchedule
                        .filter((s) => s.room === room)
                        .map((s) => (
                          <li key={`${s.room}-${s.time}`} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                            <p className="font-semibold text-slate-900">{s.time}</p>
                            <p className="text-slate-600">
                              {s.batch} · {s.teacher}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4">
          <form
            onSubmit={onAdd}
            className="w-full max-w-md space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">Add Student</h3>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                placeholder="Level"
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
              />
              <select
                value={form.board}
                onChange={(e) => setForm({ ...form, board: e.target.value as Board })}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              >
                <option value="Edexcel">Edexcel</option>
                <option value="Cambridge">Cambridge</option>
              </select>
            </div>
            <select
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {teacherBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1000}
              value={form.monthlyFee}
              onChange={(e) => setForm({ ...form, monthlyFee: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-4 py-2 text-sm text-slate-500">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
