import { formatBdt, mockMarks } from '../mockData'
import { useDemoStore } from '../store/useDemoStore'

export function ParentPortal() {
  const student = useDemoStore((s) => s.getDemoStudent())
  const invoices = useDemoStore((s) => s.invoices)
  const remarks = useDemoStore((s) => s.remarks)
  const payDemoDues = useDemoStore((s) => s.payDemoDues)

  if (!student) return null

  return (
    <div className="mx-auto w-[min(100%-1.5rem,1120px)] space-y-5 py-6">
      <header className="scroll-reveal glass rounded-3xl p-5">
        <p className="text-sm font-medium text-orange-600">Parent Portal</p>
        <h1 className="ink mt-1 text-2xl font-semibold">
          Parent of: {student.name} (Class 11, {student.board} {student.level})
        </h1>
      </header>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <h2 className="ink text-lg font-semibold">Academic &amp; Attendance Oversight</h2>
        <p className="mt-3 rounded-2xl border border-cyan-600/25 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-800">
          Present in 18/19 classes this month (94.7%)
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {mockMarks.map((m) => (
            <div key={m.subject} className="chip rounded-2xl px-3 py-3">
              <p className="ink font-medium">{m.subject}</p>
              <p className="muted text-sm">
                {m.score} — <span className="font-semibold text-orange-600">{m.grade}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="ink text-lg font-semibold">Fee &amp; Payment History</h2>
          <button
            type="button"
            disabled={student.paymentStatus === 'Paid'}
            onClick={payDemoDues}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Pay Tuition Fee (Demo)
          </button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="muted">
              <tr>
                <th className="pb-2">Month</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Due</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t stroke">
                  <td className="ink py-2.5">{inv.month}</td>
                  <td className="muted py-2.5">{formatBdt(inv.amount)}</td>
                  <td className="muted py-2.5">{inv.dueDate}</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-orange-500/15 text-orange-700'
                      }`}
                    >
                      {inv.id === 'inv-oct' ? student.paymentStatus : inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <h2 className="ink text-lg font-semibold">Teacher Remarks &amp; Notes</h2>
        <ul className="mt-3 space-y-2">
          {remarks.map((r) => (
            <li key={r.id} className="chip rounded-2xl px-3 py-2.5">
              <p className="muted text-sm">
                {r.teacher} · {r.subject} · {r.date}
              </p>
              <p className="ink mt-1">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
