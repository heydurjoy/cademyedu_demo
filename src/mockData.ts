export type PaymentStatus = 'Paid' | 'Due' | 'Overdue'
export type Board = 'Edexcel' | 'Cambridge'
export type AttendanceMark = 'Present' | 'Absent' | 'Late'

export interface Student {
  id: string
  name: string
  level: string
  board: Board
  batch: string
  campus: string
  monthlyFee: number
  paymentStatus: PaymentStatus
  dueLabel: string
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
}

export interface Material {
  id: string
  title: string
  type: 'Homework' | 'Past Paper Solution' | 'Notes'
  batch: string
  postedAt: string
  dueDate?: string
}

export interface AssignmentSubmission {
  materialId: string
  submittedAt: string
  note: string
}

export interface Remark {
  id: string
  teacher: string
  subject: string
  text: string
  date: string
}

export interface Invoice {
  id: string
  month: string
  amount: number
  dueDate: string
  status: PaymentStatus
}

export interface PaperResource {
  id: string
  title: string
  board: Board
  subject: string
  year: string
  kind: 'Question Paper' | 'Mark Scheme' | 'Lecture Notes'
}

export interface ScheduleSlot {
  room: string
  time: string
  batch: string
  teacher: string
}

export const DEMO_STUDENT_ID = 'CAD-2026-089'
export const DEMO_TEACHER = {
  name: 'Dr. Naveed Rahman',
  title: 'Senior Faculty, Mathematics (IAL & O Level)',
}

export const seedStudents: Student[] = [
  {
    id: DEMO_STUDENT_ID,
    name: 'Farhan Ahmed',
    level: 'IAL',
    board: 'Edexcel',
    batch: 'Batch A: Pure Math P3',
    campus: 'Wari Campus',
    monthlyFee: 4500,
    paymentStatus: 'Due',
    dueLabel: '৳ 4,500 Due (October 2026)',
  },
  {
    id: 'CAD-2026-012',
    name: 'Nusrat Jahan',
    level: 'IGCSE',
    board: 'Cambridge',
    batch: 'Batch B: Mechanics M1',
    campus: 'Wari Campus',
    monthlyFee: 4000,
    paymentStatus: 'Paid',
    dueLabel: 'Paid',
  },
  {
    id: 'CAD-2026-034',
    name: 'Arif Hassan',
    level: 'IAL',
    board: 'Edexcel',
    batch: 'Batch A: Pure Math P3',
    campus: 'Wari Campus',
    monthlyFee: 4500,
    paymentStatus: 'Overdue',
    dueLabel: '৳ 4,500 Overdue (September 2026)',
  },
  {
    id: 'CAD-2026-057',
    name: 'Sadia Islam',
    level: 'IGCSE',
    board: 'Cambridge',
    batch: 'Batch B: Mechanics M1',
    campus: 'Dhanmondi Campus',
    monthlyFee: 4000,
    paymentStatus: 'Due',
    dueLabel: '৳ 4,000 Due (October 2026)',
  },
  {
    id: 'CAD-2026-071',
    name: 'Karim Hossain',
    level: 'IAL',
    board: 'Cambridge',
    batch: 'Batch A: Pure Math P3',
    campus: 'Wari Campus',
    monthlyFee: 4500,
    paymentStatus: 'Paid',
    dueLabel: 'Paid',
  },
  {
    id: 'CAD-2026-088',
    name: 'Fatima Rahman',
    level: 'IAL',
    board: 'Edexcel',
    batch: 'Batch B: Mechanics M1',
    campus: 'Wari Campus',
    monthlyFee: 4500,
    paymentStatus: 'Due',
    dueLabel: '৳ 4,500 Due (October 2026)',
  },
  {
    id: 'CAD-2026-101',
    name: 'Rashid Ahmed',
    level: 'IGCSE',
    board: 'Edexcel',
    batch: 'Batch A: Pure Math P3',
    campus: 'Mirpur Campus',
    monthlyFee: 3800,
    paymentStatus: 'Paid',
    dueLabel: 'Paid',
  },
  {
    id: 'CAD-2026-115',
    name: 'Maliha Chowdhury',
    level: 'IAL',
    board: 'Cambridge',
    batch: 'Batch B: Mechanics M1',
    campus: 'Wari Campus',
    monthlyFee: 4500,
    paymentStatus: 'Due',
    dueLabel: '৳ 4,500 Due (October 2026)',
  },
]

export const seedTodos: TodoItem[] = [
  { id: 't1', text: 'Complete Chem Unit 2 Past Paper 2024', done: false },
  { id: 't2', text: 'Solve M1 Kinematics revision', done: false },
  { id: 't3', text: 'Review Integration notes before P3 class', done: true },
]

export const seedAttendance: Record<string, Record<string, AttendanceMark>> = {
  'Batch A: Pure Math P3': {
    [DEMO_STUDENT_ID]: 'Present',
    'CAD-2026-034': 'Present',
    'CAD-2026-071': 'Late',
    'CAD-2026-101': 'Present',
  },
  'Batch B: Mechanics M1': {
    'CAD-2026-012': 'Present',
    'CAD-2026-057': 'Absent',
    'CAD-2026-088': 'Present',
    'CAD-2026-115': 'Present',
  },
}

export const seedMaterials: Material[] = [
  {
    id: 'm1',
    title: 'P3 Integration Worksheet',
    type: 'Homework',
    batch: 'Batch A: Pure Math P3',
    postedAt: '2026-09-22',
    dueDate: '2026-09-28',
  },
  {
    id: 'm2',
    title: 'M1 Kinematics Mark Scheme Walkthrough',
    type: 'Past Paper Solution',
    batch: 'Batch B: Mechanics M1',
    postedAt: '2026-09-20',
    dueDate: '2026-09-27',
  },
  {
    id: 'm3',
    title: 'Chem Unit 2 Past Paper 2024',
    type: 'Homework',
    batch: 'Batch A: Pure Math P3',
    postedAt: '2026-09-18',
    dueDate: '2026-09-26',
  },
  {
    id: 'm4',
    title: 'P3 Differentiation Drill Set',
    type: 'Homework',
    batch: 'Batch A: Pure Math P3',
    postedAt: '2026-09-15',
    dueDate: '2026-09-24',
  },
  {
    id: 'm5',
    title: 'Integration Revision Notes',
    type: 'Notes',
    batch: 'Batch A: Pure Math P3',
    postedAt: '2026-09-14',
  },
]

export const seedRemarks: Remark[] = [
  {
    id: 'r1',
    teacher: 'Dr. Naveed Rahman',
    subject: 'Pure Math P3',
    text: 'Farhan showed good improvement in Integration this week.',
    date: '2026-09-21',
  },
  {
    id: 'r2',
    teacher: 'Ms. Tahmina Akter',
    subject: 'Physics Unit 4',
    text: 'Encourage more practice on electric fields past papers.',
    date: '2026-09-18',
  },
]

export const seedInvoices: Invoice[] = [
  { id: 'inv-jul', month: 'July 2026', amount: 4500, dueDate: '2026-07-05', status: 'Paid' },
  { id: 'inv-aug', month: 'August 2026', amount: 4500, dueDate: '2026-08-05', status: 'Paid' },
  { id: 'inv-sep', month: 'September 2026', amount: 4500, dueDate: '2026-09-05', status: 'Paid' },
  { id: 'inv-oct', month: 'October 2026', amount: 4500, dueDate: '2026-10-05', status: 'Due' },
]

export const seedPapers: PaperResource[] = [
  {
    id: 'p1',
    title: 'Pure Mathematics P3 — May/June 2024',
    board: 'Edexcel',
    subject: 'Mathematics',
    year: '2024',
    kind: 'Question Paper',
  },
  {
    id: 'p2',
    title: 'Mechanics M1 — Mark Scheme Oct/Nov 2023',
    board: 'Edexcel',
    subject: 'Mathematics',
    year: '2023',
    kind: 'Mark Scheme',
  },
  {
    id: 'p3',
    title: 'Physics Unit 4 — Lecture Notes (Fields)',
    board: 'Edexcel',
    subject: 'Physics',
    year: '2025',
    kind: 'Lecture Notes',
  },
  {
    id: 'p4',
    title: 'Chemistry Unit 2 — Past Paper 2024',
    board: 'Cambridge',
    subject: 'Chemistry',
    year: '2024',
    kind: 'Question Paper',
  },
]

export const seedSchedule: ScheduleSlot[] = [
  { room: 'Room 101', time: '16:30–17:45', batch: 'Batch A: Pure Math P3', teacher: 'Sir Naveed' },
  { room: 'Lab', time: '18:00–19:15', batch: 'Physics Unit 4', teacher: 'Ms. Tahmina' },
  { room: 'Room 102', time: '16:30–17:45', batch: 'Batch B: Mechanics M1', teacher: 'Sir Naveed' },
  { room: 'Online', time: '20:00–21:00', batch: 'Chem Catch-up', teacher: 'Mr. Rafiq' },
]

export const studentRoutine = [
  { subject: 'Pure Math P3', time: '4:30 PM', room: 'Room 101', teacher: 'Sir Naveed' },
  { subject: 'Physics Unit 4', time: '6:00 PM', room: 'Lab', teacher: 'Ms. Tahmina' },
]

export const mockMarks = [
  { subject: 'Pure Math P3', score: '88/100', grade: 'A*' },
  { subject: 'Mechanics M1', score: '82/100', grade: 'A' },
]

export const teacherBatches = ['Batch A: Pure Math P3', 'Batch B: Mechanics M1'] as const

export function formatBdt(n: number) {
  return `৳ ${n.toLocaleString('en-BD')}`
}

export function createSeedState() {
  return {
    students: structuredClone(seedStudents),
    todos: structuredClone(seedTodos),
    attendanceByBatch: structuredClone(seedAttendance),
    materials: structuredClone(seedMaterials),
    remarks: structuredClone(seedRemarks),
    invoices: structuredClone(seedInvoices),
    submissions: [] as AssignmentSubmission[],
  }
}
