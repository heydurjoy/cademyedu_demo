import { useEffect, useState } from 'react'

const SEEN_KEY = 'cademy-demo-notice-seen'

export function DemoMessageBubble() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(SEEN_KEY)) {
        const t = window.setTimeout(() => setOpen(true), 700)
        return () => window.clearTimeout(t)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-[9999] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          role="dialog"
          aria-label="Demo notice"
          className="w-[min(100vw-2rem,20.5rem)] animate-[fadeUp_0.28s_ease-out] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">Demo notice</p>
            <button
              type="button"
              onClick={close}
              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed font-medium text-slate-800">
            This is just a demo. The final product will look and work according to the requirements of the organization.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        className="grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-white shadow-[0_12px_32px_rgba(249,115,22,0.5)] ring-4 ring-orange-500/20 transition hover:scale-105 hover:bg-orange-400"
        aria-expanded={open}
        aria-label={open ? 'Close demo message' : 'Open demo message'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
