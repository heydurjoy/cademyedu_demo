import { type FormEvent, useState } from 'react'

export function HeroSearch() {
  const [q, setQ] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert(q.trim() ? `Demo search: “${q.trim()}”` : 'Type a question to search (demo).')
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass-strong mx-auto flex w-full max-w-xl flex-col gap-3 rounded-[2.15rem] p-4 text-left"
      role="search"
    >
      <label className="sr-only" htmlFor="ai-query">
        Ask Cademy AI
      </label>
      <textarea
        id="ai-query"
        rows={2}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ask anything — past papers, topics, routines…"
        className="ink w-full resize-none bg-transparent px-1 text-base font-medium outline-none placeholder:text-[color:var(--placeholder)]"
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="chip muted grid h-9 w-9 place-items-center rounded-full text-base" aria-hidden>
            +
          </span>
          <span className="chip inline-flex rounded-full p-1 text-xs font-semibold">
            <span className="ink rounded-full bg-[color:var(--chip-bg)] px-3 py-1.5 shadow-sm">Ask</span>
            <span className="muted px-3 py-1.5">Papers</span>
          </span>
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="grid h-11 w-11 place-items-center rounded-full bg-orange-500 text-white shadow-[0_8px_22px_rgba(249,115,22,0.4)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>
    </form>
  )
}
