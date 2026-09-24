import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type AssignmentSubmission,
  type AttendanceMark,
  type Board,
  type Invoice,
  type Material,
  type PaymentStatus,
  type Remark,
  type Student,
  type TodoItem,
  DEMO_STUDENT_ID,
  createSeedState,
  formatBdt,
} from '../mockData'

interface DemoState {
  students: Student[]
  todos: TodoItem[]
  attendanceByBatch: Record<string, Record<string, AttendanceMark>>
  materials: Material[]
  remarks: Remark[]
  invoices: Invoice[]
  submissions: AssignmentSubmission[]
  demoStudentId: string
  togglePayment: (id: string) => void
  payDemoDues: () => void
  addStudent: (input: {
    name: string
    level: string
    board: Board
    batch: string
    monthlyFee: number
  }) => void
  setAttendance: (batch: string, studentId: string, mark: AttendanceMark) => void
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  addMaterial: (input: Omit<Material, 'id' | 'postedAt'>) => void
  submitAssignment: (materialId: string, note?: string) => void
  resetDemo: () => void
  exportStudentsCsv: () => void
  getDemoStudent: () => Student | undefined
  getKpis: () => {
    totalStudents: number
    collected: number
    target: number
    unpaid: number
    activeBatches: number
  }
  getAttendancePercent: (batch: string) => number
}

const nextStatus = (s: PaymentStatus): PaymentStatus => {
  if (s === 'Paid') return 'Due'
  if (s === 'Due') return 'Overdue'
  return 'Paid'
}

const applyPaymentLabel = (student: Student, status: PaymentStatus): Student => ({
  ...student,
  paymentStatus: status,
  dueLabel:
    status === 'Paid'
      ? 'Paid'
      : status === 'Overdue'
        ? `${formatBdt(student.monthlyFee)} Overdue`
        : `${formatBdt(student.monthlyFee)} Due (October 2026)`,
})

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...createSeedState(),
      demoStudentId: DEMO_STUDENT_ID,

      getDemoStudent: () => get().students.find((s) => s.id === get().demoStudentId),

      togglePayment: (id) => {
        set((state) => {
          const students = state.students.map((s) => {
            if (s.id !== id) return s
            const status = nextStatus(s.paymentStatus)
            return applyPaymentLabel(s, status)
          })
          const demo = students.find((s) => s.id === state.demoStudentId)
          const invoices =
            demo && id === state.demoStudentId
              ? state.invoices.map((inv) =>
                  inv.id === 'inv-oct'
                    ? { ...inv, status: demo.paymentStatus === 'Paid' ? ('Paid' as const) : ('Due' as const) }
                    : inv,
                )
              : state.invoices
          return { students, invoices }
        })
      },

      payDemoDues: () => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === state.demoStudentId ? applyPaymentLabel(s, 'Paid') : s,
          ),
          invoices: state.invoices.map((inv) =>
            inv.id === 'inv-oct' ? { ...inv, status: 'Paid' as const } : inv,
          ),
        }))
      },

      addStudent: (input) => {
        const id = `CAD-2026-${String(100 + get().students.length).padStart(3, '0')}`
        const student: Student = {
          id,
          name: input.name,
          level: input.level,
          board: input.board,
          batch: input.batch,
          campus: 'Wari Campus',
          monthlyFee: input.monthlyFee,
          paymentStatus: 'Due',
          dueLabel: `${formatBdt(input.monthlyFee)} Due (October 2026)`,
        }
        set((state) => ({ students: [...state.students, student] }))
      },

      setAttendance: (batch, studentId, mark) => {
        set((state) => ({
          attendanceByBatch: {
            ...state.attendanceByBatch,
            [batch]: {
              ...(state.attendanceByBatch[batch] || {}),
              [studentId]: mark,
            },
          },
        }))
      },

      addTodo: (text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        set((state) => ({
          todos: [
            ...state.todos,
            { id: `todo-${Date.now()}`, text: trimmed, done: false },
          ],
        }))
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        }))
      },

      addMaterial: (input) => {
        set((state) => ({
          materials: [
            {
              ...input,
              id: `mat-${Date.now()}`,
              postedAt: new Date().toISOString().slice(0, 10),
              dueDate:
                input.type === 'Homework'
                  ? new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
                  : input.dueDate,
            },
            ...state.materials,
          ],
        }))
      },

      submitAssignment: (materialId, note = '') => {
        set((state) => {
          const list = state.submissions || []
          if (list.some((s) => s.materialId === materialId)) return state
          return {
            submissions: [
              {
                materialId,
                submittedAt: new Date().toISOString().slice(0, 10),
                note: note.trim() || 'Submitted via Student Portal (demo)',
              },
              ...list,
            ],
          }
        })
      },

      resetDemo: () => {
        set({ ...createSeedState(), demoStudentId: DEMO_STUDENT_ID })
      },

      exportStudentsCsv: () => {
        const rows = [
          ['ID', 'Name', 'Level', 'Board', 'Batch', 'Monthly Fee', 'Payment Status'],
          ...get().students.map((s) => [
            s.id,
            s.name,
            s.level,
            s.board,
            s.batch,
            String(s.monthlyFee),
            s.paymentStatus,
          ]),
        ]
        const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cademyos-students.csv'
        a.click()
        URL.revokeObjectURL(url)
      },

      getKpis: () => {
        const { students } = get()
        const totalStudents = students.length
        const target = students.reduce((sum, s) => sum + s.monthlyFee, 0)
        const collected = students
          .filter((s) => s.paymentStatus === 'Paid')
          .reduce((sum, s) => sum + s.monthlyFee, 0)
        const unpaid = target - collected
        const activeBatches = new Set(students.map((s) => s.batch)).size
        return { totalStudents, collected, target, unpaid, activeBatches }
      },

      getAttendancePercent: (batch) => {
        const marks = Object.values(get().attendanceByBatch[batch] || {})
        if (!marks.length) return 0
        const presentish = marks.filter((m) => m === 'Present' || m === 'Late').length
        return Math.round((presentish / marks.length) * 1000) / 10
      },
    }),
    { name: 'cademyos-demo' },
  ),
)
