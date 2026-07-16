import React from 'react'

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0c10] text-zinc-100">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 8l10 6 10-6-10-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M2 16l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M2 12l10 6 10-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/80">Perplexity</span>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#0f1218] p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_60px_-20px_rgba(0,0,0,0.6)]">
            {eyebrow && (
              <span className="mb-3 inline-block rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-teal-300">
                {eyebrow}
              </span>
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-white/45">{subtitle}</p>}

            <div className="mt-7">{children}</div>
          </div>

          {footer && <div className="mt-6 text-center text-sm text-white/45">{footer}</div>}
        </div>
      </div>
    </section>
  )
}

export default AuthLayout