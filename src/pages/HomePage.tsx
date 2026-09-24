import { ExperienceAs } from '../components/home/ExperienceAs'
import { HeroSearch } from '../components/home/HeroSearch'

export function HomePage() {
  return (
    <div className="pb-8">
      <section className="relative -mt-[4.5rem] flex min-h-[92svh] items-center pt-24 pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <img
            src="./assets/hero.jpg"
            alt=""
            className="h-full w-full object-cover object-[center_35%] blur-[12px] saturate-110 brightness-[0.92]"
            style={{ transform: 'scale(1.08)' }}
          />
          <div className="hero-scrim absolute inset-0" />
          {/* Soft dissolve into the explore section (iOS-style) */}
          <div className="hero-bottom-fade absolute inset-x-0 bottom-0 h-40" />
        </div>

        <div className="relative mx-auto w-[min(100%-2rem,42rem)] text-center">
          <h1 className="ink mb-3 text-[clamp(1.85rem,5.2vw,3.15rem)] leading-tight font-semibold tracking-tight">
            Excel in Your <span className="accent-cyan">IGCSE &amp; IAL</span>{' '}
            <span className="accent-orange">Journey</span>
          </h1>
          <p className="muted mx-auto mb-7 max-w-xl text-[clamp(1rem,2vw,1.14rem)] leading-relaxed font-medium">
            Join CADEMY for comprehensive learning resources, expert faculty guidance, and proven strategies to achieve
            your academic goals.
          </p>
          <HeroSearch />
          <a
            href="#explore"
            className="muted mt-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-orange-600"
          >
            Scroll to explore roles
            <svg viewBox="0 0 24 24" className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <ExperienceAs />
    </div>
  )
}
