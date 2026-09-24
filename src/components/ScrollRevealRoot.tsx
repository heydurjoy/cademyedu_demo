import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/** Observes `.scroll-reveal` nodes and toggles `.is-in` as they enter the viewport. */
export function ScrollRevealRoot({ children }: { children: ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    let io: IntersectionObserver | null = null
    let observeFrame = 0

    // Let page-enter finish so homepage doesn't hitch from overlapping motions
    const timer = window.setTimeout(() => {
      observeFrame = window.requestAnimationFrame(() => {
        if (cancelled) return
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal'))
        if (!nodes.length) return

        nodes.forEach((el) => el.classList.remove('is-in'))

        io = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-in')
                io?.unobserve(entry.target)
              }
            }
          },
          { root: null, rootMargin: '0px 0px -4% 0px', threshold: 0.06 },
        )

        nodes.forEach((el, i) => {
          el.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 50}ms`)
          io?.observe(el)
        })
      })
    }, 280)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.cancelAnimationFrame(observeFrame)
      io?.disconnect()
    }
  }, [location.pathname])

  return <>{children}</>
}
