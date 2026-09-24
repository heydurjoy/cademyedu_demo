import { HashRouter, Route, Routes } from 'react-router-dom'
import { DemoMessageBubble } from './components/DemoMessageBubble'
import { ScrollRevealRoot } from './components/ScrollRevealRoot'
import { ScrollToTop } from './components/ScrollToTop'
import { AppShell } from './components/layout/AppShell'
import { AdminPortal } from './pages/AdminPortal'
import { HomePage } from './pages/HomePage'
import { ParentPortal } from './pages/ParentPortal'
import { StudentPortal } from './pages/StudentPortal'
import { TeacherPortal } from './pages/TeacherPortal'

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppShell>
        <ScrollRevealRoot>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/teacher" element={<TeacherPortal />} />
            <Route path="/parent" element={<ParentPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </ScrollRevealRoot>
      </AppShell>
      <DemoMessageBubble />
    </HashRouter>
  )
}
