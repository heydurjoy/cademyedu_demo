import { type FormEvent, useMemo, useState } from 'react'
import { DEMO_TEACHER, teacherBatches, type AttendanceMark } from '../mockData'
import { useDemoStore } from '../store/useDemoStore'

const marks: AttendanceMark[] = ['Present', 'Absent', 'Late']

export function TeacherPortal() {
  const students = useDemoStore((s) => s.students)
  const attendanceByBatch = useDemoStore((s) => s.attendanceByBatch)
  const setAttendance = useDemoStore((s) => s.setAttendance)
  const getAttendancePercent = useDemoStore((s) => s.getAttendancePercent)
  const materials = useDemoStore((s) => s.materials)
  const addMaterial = useDemoStore((s) => s.addMaterial)

  const [batch, setBatch] = useState<string>(teacherBatches[0])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'Homework' | 'Past Paper Solution' | 'Notes'>('Homework')

  const roster = useMemo(
    () => students.filter((s) => s.batch === batch),
    [students, batch],
  )
  const pct = getAttendancePercent(batch)

  const onPost = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addMaterial({ title: title.trim(), type, batch })
    setTitle('')
    setOpen(false)
  }

  return (
    <div className="mx-auto w-[min(100%-1.5rem,1120px)] space-y-5 py-6">
      <header className="scroll-reveal glass rounded-3xl p-5">
        <p className="text-sm font-medium text-orange-600">Teacher Portal</p>
        <h1 className="ink mt-1 text-2xl font-semibold">{DEMO_TEACHER.name}</h1>
        <p className="muted mt-1">{DEMO_TEACHER.title}</p>
      </header>

      <section className="scroll-reveal grid gap-3 sm:grid-cols-2">
        {teacherBatches.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBatch(b)}
            className={`rounded-3xl p-4 text-left transition ${
              batch === b ? 'bg-orange-500 text-white' : 'glass muted hover:bg-black/5'
            }`}
          >
            <p className="text-sm opacity-80">Today&apos;s batch</p>
            <p className="mt-1 font-semibold">{b}</p>
          </button>
        ))}
      </section>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="ink text-lg font-semibold">Attendance Register</h2>
          <p className="text-sm font-medium text-cyan-700">Live attendance: {pct}%</p>
        </div>
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="glass ink mt-3 rounded-full px-3 py-2 text-sm"
        >
          {teacherBatches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="muted">
              <tr>
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Mark</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => {
                const current = attendanceByBatch[batch]?.[s.id] || 'Present'
                return (
                  <tr key={s.id} className="border-t stroke">
                    <td className="ink py-3">{s.name}</td>
                    <td className="muted py-3">{s.id}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {marks.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setAttendance(batch, s.id, m)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              current === m
                                ? m === 'Present'
                                  ? 'bg-emerald-500 text-white'
                                  : m === 'Late'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-red-500 text-white'
                                : 'chip muted'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scroll-reveal glass rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="ink text-lg font-semibold">Posted Materials</h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Post Material
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {materials.map((m) => (
            <li key={m.id} className="chip rounded-2xl px-3 py-2.5">
              <p className="ink font-medium">{m.title}</p>
              <p className="muted text-xs">
                {m.type} · {m.batch} · {m.postedAt}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
          <form onSubmit={onPost} className="glass-strong w-full max-w-md rounded-3xl p-5">
            <h3 className="ink text-lg font-semibold">Post Material / Assignment</h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="glass ink mt-3 w-full rounded-2xl px-3 py-2.5 text-sm outline-none"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="glass ink mt-2 w-full rounded-2xl px-3 py-2.5 text-sm"
            >
              <option value="Homework">Homework</option>
              <option value="Past Paper Solution">Past Paper Solution</option>
              <option value="Notes">Notes</option>
            </select>
            <p className="muted mt-2 text-xs">Publishing to: {batch}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="muted rounded-full px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                Publish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
