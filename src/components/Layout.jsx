import { NavLink, useNavigate } from 'react-router-dom'
import { useToasts } from '../utils/toast'
import { useAuth } from '../utils/auth'

const navItems = [
    { path: '/', label: 'Home', icon: '🏠', exact: true },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/input', label: 'New Patient', icon: '➕' },
]

export function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-blue-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 bg-blue-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center justify-center w-full h-full text-xl">🧬</div>
                        </div>
                        <div>
                            <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>BioClock</span>
                            <div className="text-xs text-slate-500 leading-none hidden sm:block">Predictive Health AI</div>
                        </div>
                    </NavLink>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        {navItems.map(({ path, label, icon }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === '/'}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span>{icon}</span>
                                <span className="hidden sm:inline">{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Auth section */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* User info */}
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                                        {user.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <span className="text-slate-300">{user.name || user.email}</span>
                                </div>

                                {/* AI Online badge */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                    AI Online
                                </div>

                                {/* Logout */}
                                <button onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:bg-red-500/10"
                                    style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                    AI Online
                                </div>
                                <NavLink to="/login"
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all">
                                    🔐 Login
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export function ToastContainer() {
    const { toasts, remove } = useToasts()
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }
    const colors = {
        success: { border: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.08)' },
        error: { border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.08)' },
        info: { border: 'rgba(59,130,246,0.4)', bg: 'rgba(59,130,246,0.08)' },
        warning: { border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)' },
    }
    return (
        <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="animate-toast glass rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer"
                    style={{ border: `1px solid ${colors[t.type]?.border || '#333'}`, background: colors[t.type]?.bg }}
                    onClick={() => remove(t.id)}
                >
                    <span className="text-lg">{icons[t.type]}</span>
                    <span className="text-sm text-slate-200 flex-1">{t.msg}</span>
                    <button className="text-slate-500 hover:text-slate-300 text-lg leading-none">×</button>
                </div>
            ))}
        </div>
    )
}

export function PageWrapper({ children }) {
    return (
        <div className="min-h-screen bg-grid" style={{ paddingTop: '4rem' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    )
}

export function SectionTitle({ icon, title, subtitle }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
                {icon && <span className="text-2xl">{icon}</span>}
                <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            </div>
            {subtitle && <p className="text-slate-400 text-sm ml-0">{subtitle}</p>}
        </div>
    )
}

export function Spinner({ label = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-blue-900" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            </div>
            <p className="text-slate-400 text-sm animate-pulse">{label}</p>
        </div>
    )
}

export function RiskBadge({ risk, size = 'md' }) {
    const configs = {
        Low: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', emoji: '🟢' },
        Moderate: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', emoji: '🟡' },
        High: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', emoji: '🔴' },
        Critical: { color: '#FF1744', bg: 'rgba(255,23,68,0.12)', border: 'rgba(255,23,68,0.3)', emoji: '🚨' },
    }
    const label = typeof risk === 'string' ? risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase() : 'Unknown'
    const cfg = configs[label] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', emoji: '⚪' }
    const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad}`}
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            {cfg.emoji} {label}
        </span>
    )
}
