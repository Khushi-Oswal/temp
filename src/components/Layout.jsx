import { NavLink, useLocation } from 'react-router-dom'
import { useToasts } from '../utils/toast'

/* ─── Navigation items ───────────────────────── */
const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: '🏠', mobileIcon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', mobileIcon: '📊' },
    { path: '/input', label: 'New Patient', icon: '➕', mobileIcon: '➕' },
]

/* ─── Desktop / Tablet Navbar ────────────────── */
export function Navbar() {
    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50"
            style={{ borderBottom: '1px solid rgba(99,102,241,0.18)', height: 'var(--nav-h)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-3 shrink-0 group" style={{ textDecoration: 'none' }}>
                    <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'linear-gradient(135deg,#4338CA,#2563EB)', boxShadow: '0 0 18px rgba(79,70,229,.4)' }}>
                        🧬
                    </div>
                    <div className="hidden sm:block">
                        <p className="font-bold text-lg leading-none" style={{ fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg,#818CF8,#60A5FA,#34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            BioClock
                        </p>
                        <p className="text-[10px] text-slate-500 leading-none mt-0.5 tracking-wide">Predictive Health AI</p>
                    </div>
                </NavLink>

                {/* Desktop nav links — hidden on mobile */}
                <div className="desktop-only items-center gap-1">
                    {NAV_ITEMS.map(({ path, label, icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span>{icon}</span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Status pill */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(5,214,160,.1)', color: '#05D6A0', border: '1px solid rgba(5,214,160,.3)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        <span className="hidden sm:inline">AI Online</span>
                        <span className="sm:hidden">●</span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

/* ─── Mobile Bottom Navigation Bar ──────────── */
export function MobileBottomNav() {
    const loc = useLocation()
    return (
        /* Only render on mobile via CSS; shown as grid with 3 cols */
        <nav className="mobile-nav mobile-only" style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length},1fr)` }}>
            {NAV_ITEMS.map(({ path, label, mobileIcon }) => {
                const isActive = path === '/' ? loc.pathname === '/' : loc.pathname.startsWith(path)
                return (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{mobileIcon}</span>
                        <span>{label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}

/* ─── Toast Container ────────────────────────── */
export function ToastContainer() {
    const { toasts, remove } = useToasts()
    const configs = {
        success: { border: 'rgba(5,214,160,.4)', bg: 'rgba(5,214,160,.07)', icon: '✅' },
        error: { border: 'rgba(244,63,94,.4)', bg: 'rgba(244,63,94,.07)', icon: '❌' },
        info: { border: 'rgba(99,102,241,.4)', bg: 'rgba(99,102,241,.07)', icon: 'ℹ️' },
        warning: { border: 'rgba(251,191,36,.4)', bg: 'rgba(251,191,36,.07)', icon: '⚠️' },
    }
    return (
        <div className="fixed top-20 right-3 z-[100] flex flex-col gap-2 max-w-xs w-[calc(100vw-1.5rem)] sm:max-w-sm">
            {toasts.map((t) => {
                const c = configs[t.type] || configs.info
                return (
                    <div key={t.id}
                        className="animate-toast glass rounded-2xl px-4 py-3 flex items-start gap-3 cursor-pointer shadow-xl"
                        style={{ border: `1px solid ${c.border}`, background: c.bg }}
                        onClick={() => remove(t.id)}>
                        <span className="text-lg mt-0.5 shrink-0">{c.icon}</span>
                        <span className="text-sm text-slate-200 flex-1 leading-relaxed">{t.msg}</span>
                        <button className="text-slate-500 hover:text-slate-300 text-xl leading-none shrink-0 ml-1">×</button>
                    </div>
                )
            })}
        </div>
    )
}

/* ─── Page Wrapper (replaces old PageWrapper) ─ */
export function PageWrapper({ children }) {
    return (
        <div className="page-wrapper bg-grid" style={{ backgroundSize: '60px 60px', backgroundImage: 'linear-gradient(rgba(37,99,235,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.04) 1px, transparent 1px)' }}>
            <div className="page-inner">
                {children}
            </div>
        </div>
    )
}

/* ─── Section Title ──────────────────────────── */
export function SectionTitle({ icon, title, subtitle }) {
    return (
        <div className="mb-5 sm:mb-7">
            <div className="flex items-center gap-3 mb-1">
                {icon && <span className="text-2xl">{icon}</span>}
                <h2 className="text-xl sm:text-2xl font-bold gradient-text">{title}</h2>
            </div>
            {subtitle && <p className="text-slate-400 text-sm leading-relaxed">{subtitle}</p>}
        </div>
    )
}

/* ─── Spinner ────────────────────────────────── */
export function Spinner({ label = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-14">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-900" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500 animate-spin"
                    style={{ animationDuration: '1.4s', animationDirection: 'reverse' }} />
            </div>
            <p className="text-slate-400 text-sm animate-pulse">{label}</p>
        </div>
    )
}

/* ─── Risk Badge ─────────────────────────────── */
export function RiskBadge({ risk, size = 'md' }) {
    const map = {
        Low: { color: '#05D6A0', bg: 'rgba(5,214,160,.1)', border: 'rgba(5,214,160,.3)', emoji: '🟢' },
        Moderate: { color: '#FBBF24', bg: 'rgba(251,191,36,.1)', border: 'rgba(251,191,36,.3)', emoji: '🟡' },
        High: { color: '#F43F5E', bg: 'rgba(244,63,94,.1)', border: 'rgba(244,63,94,.3)', emoji: '🔴' },
        Critical: { color: '#FF1744', bg: 'rgba(255,23,68,.1)', border: 'rgba(255,23,68,.35)', emoji: '🚨' },
    }
    const label = typeof risk === 'string'
        ? risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase()
        : 'Unknown'
    const cfg = map[label] || { color: '#8898AA', bg: 'rgba(136,152,170,.1)', border: 'rgba(136,152,170,.3)', emoji: '⚪' }
    const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad}`}
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            {cfg.emoji} {label}
        </span>
    )
}
