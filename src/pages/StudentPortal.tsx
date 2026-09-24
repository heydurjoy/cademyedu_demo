import { useMemo, useState } from 'react'
import { formatBdt, seedPapers, studentRoutine } from '../mockData'
import { useDemoStore } from '../store/useDemoStore'

export function StudentPortal() {
  const student = useDemoStore((s) => s.getDemoStudent())
  const invoices = useDemoStore((s) => s.invoices)
  const submissions = useDemoStore((s) => s.submissions) || []
  const materials = useDemoStore((s) => s.materials)
  const payDemoDues = useDemoStore((s) => s.payDemoDues)
  const submitAssignment = useDemoStore((s) => s.submitAssignment)
  const [board, setBoard] = useState('All')

  const papers = useMemo(
    () => seedPapers.filter((p) => board === 'All' || p.board === board),
    [board],
  )

  const feeStats = useMemo(() => {
    if (!student) return { paid: 0, total: 0, remaining: 0, pct: 0 }
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const paid = invoices.reduce((sum, inv) => {
      const status = inv.id === 'inv-oct' ? student.paymentStatus : inv.status
      return sum + (status === 'Paid' ? inv.amount : 0)
    }, 0)
    const remaining = total - paid
    const pct = total ? Math.round((paid / total) * 100) : 0
    return { paid, total, remaining, pct }
  }, [invoices, student])

  const assignments = useMemo(() => {
    if (!student) return []
    return materials
      .filter((m) => m.batch === student.batch && (m.type === 'Homework' || m.type === 'Notes'))
      .map((m) => ({
        ...m,
        submission: submissions.find((s) => s.materialId === m.id),
      }))
      .sort((a, b) => Number(Boolean(a.submission)) - Number(Boolean(b.submission)))
  }, [materials, submissions, student])

  if (!student) return null

  const isPaid = student.paymentStatus === 'Paid'

  return (
    <div className="mx-auto w-[min(100%-1.5rem,1120px)] space-y-5 py-6">
      <header className="scroll-reveal glass rounded-3xl p-5">
        <p className="text-sm font-medium text-orange-600">Student Portal</p>
        <h1 className="ink mt-1 text-2xl font-semibold">
          {student.name} — {student.board} {student.level} ({student.campus})
        </h1>
        <p className="muted mt-1">Student ID: {student.id}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="scroll-reveal glass flex flex-col rounded-3xl p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <h2 className="ink text-xl font-bold tracking-tight">Tuition &amp; Dues</h2>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                isPaid
                  ? 'bg-emerald-500/15 text-emerald-700'
                  : student.paymentStatus === 'Overdue'
                    ? 'bg-red-500/15 text-red-700'
                    : 'bg-orange-500/15 text-orange-700'
              }`}
            >
              {isPaid ? 'Cleared' : student.paymentStatus}
            </span>
          </div>

          <div className="mt-6 flex-1">
            <p className="muted text-sm font-semibold tracking-wide uppercase">This term</p>
            <p className="ink mt-2 text-[clamp(1.75rem,4.5vw,2.35rem)] leading-none font-extrabold tracking-tight">
              Paid {formatBdt(feeStats.paid)}
            </p>
            <p className="muted mt-2 text-lg font-semibold">
              out of <span className="ink">{formatBdt(feeStats.total)}</span>
            </p>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200/90">
              <div
                className={`h-full rounded-full transition-all ${
                  isPaid ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.max(feeStats.pct, 4)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm font-semibold">
              <span className="muted">{feeStats.pct}% paid</span>
              <span className={isPaid ? 'text-emerald-700' : 'text-orange-700'}>
                {isPaid ? 'All clear' : `${formatBdt(feeStats.remaining)} left`}
              </span>
            </div>

            {!isPaid && (
              <p className="mt-4 rounded-2xl bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-800">
                {student.dueLabel}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={isPaid}
              onClick={payDemoDues}
              className="flex-1 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-[0_12px_32px_rgba(249,115,22,0.4)] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {isPaid ? 'Paid in Full' : `Pay Now — ${formatBdt(feeStats.remaining)}`}
            </button>
            <button
              type="button"
              onClick={() => alert('Demo invoice receipt downloaded (stub).')}
              className="glass muted rounded-2xl px-5 py-4 text-sm font-bold sm:w-auto"
            >
              Download Invoice
            </button>
          </div>
        </section>

        <section className="scroll-reveal glass rounded-3xl p-5">
          <h2 className="ink text-lg font-semibold">Classes &amp; Routine</h2>
          <p className="muted mt-1 text-sm">Attendance: 94% present</p>
          <ul className="mt-3 space-y-2">
            {studentRoutine.map((r) => (
              <li key={r.subject} className="chip rounded-2xl px-3 py-2.5">
                <p className="ink font-semibold">{r.subject}</p>
                <p className="muted text-sm">
                  {r.time} · {r.room} · {r.teacher}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="scroll-reveal glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="ink text-xl font-bold tracking-tight">Study To-Do</h2>
            <p className="muted mt-1 text-sm">Assignments from your teachers — submit when ready</p>
          </div>
          <p className="text-sm font-semibold text-orange-700">
            {assignments.filter((a) => !a.submission).length} pending
          </p>
        </div>

        <ul className="mt-5 space-y-3">
          {assignments.length === 0 && (
            <li className="chip rounded-2xl px-4 py-6 text-center">
              <p className="muted text-sm">No assignments for your batch yet.</p>
            </li>
          )}
          {assignments.map((a) => {
            const submitted = Boolean(a.submission)
            return (
              <li key={a.id} className="chip rounded-2xl p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          a.type === 'Homework'
                            ? 'bg-orange-500/15 text-orange-700'
                            : a.type === 'Notes'
                              ? 'bg-cyan-500/15 text-cyan-700'
                              : 'bg-violet-500/15 text-violet-700'
                        }`}
                      >
                        {a.type}
                      </span>
                      {submitted ? (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                          Submitted
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                          Due {a.dueDate || 'soon'}
                        </span>
                      )}
                    </div>
                    <p className="ink mt-2 text-base font-semibold">{a.title}</p>
                    <p className="muted mt-0.5 text-xs">
                      Posted {a.postedAt}
                      {a.submission ? ` · Turned in ${a.submission.submittedAt}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Demo open: ${a.title}`)}
                      className="glass muted rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      disabled={submitted}
                      onClick={() => submitAssignment(a.id)}
                      className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(249,115,22,0.3)] disabled:cursor-not-allowed disabled:bg-emerald-500 disabled:shadow-none"
                    >
                      {submitted ? 'Submitted ✓' : 'Submit'}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="ink text-lg font-semibold">Past Papers &amp; Resources</h2>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="glass ink rounded-full px-3 py-2 text-sm"
          >
            <option value="All">All boards</option>
            <option value="Edexcel">Edexcel</option>
            <option value="Cambridge">Cambridge</option>
          </select>
        </div>
        <ul className="mt-3 space-y-2">
          {papers.map((p) => (
            <li key={p.id} className="chip flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2.5">
              <div>
                <p className="ink font-medium">{p.title}</p>
                <p className="muted text-xs">
                  {p.board} · {p.subject} · {p.kind}
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert(`Demo download: ${p.title}`)}
                className="rounded-full bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-700"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
