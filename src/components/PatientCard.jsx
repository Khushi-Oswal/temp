import { Link } from 'react-router-dom'
import { RiskBadge } from './Layout'

export function PatientCard({ patient, index = 0 }) {
    const { patient_id, name, age, sex, city, overall_risk, biomarkers_count, created_at } = patient

    return (
        <Link
            to={`/patient/${patient_id}`}
            className="card glass-hover block no-underline relative overflow-hidden group"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Decorative corner glow */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/15 transition-colors duration-500" />

            <div className="flex items-start justify-between mb-5 relative z-10">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:scale-110 duration-300"
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white' }}>
                        {(name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-100 text-base leading-tight truncate group-hover:text-indigo-300 transition-colors">
                            {name || `Patient ${patient_id}`}
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold font-mono">
                            ID: {patient_id}
                        </p>
                    </div>
                </div>
                <div className="shrink-0">
                    <RiskBadge risk={overall_risk} size="sm" />
                </div>
            </div>

            {/* Info grid - Responsive Columns */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 relative z-10">
                {[
                    { label: 'Age', value: age ? `${age}y` : '—' },
                    { label: 'Sex', value: sex || '—' },
                    { label: 'City', value: city || '—' },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center rounded-xl py-2.5 px-1"
                        style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
                        <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-widest font-bold">{label}</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-200 truncate">{value}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-indigo-950/20 pt-4 relative z-10">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="opacity-70">🧬</span> {biomarkers_count ?? '—'} <span className="hidden sm:inline">Markers</span></span>
                    {created_at && <span className="hidden sm:flex items-center gap-1.5"><span className="opacity-70">📅</span> {new Date(created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                </div>
                <span className="text-indigo-400 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">View Details</span>
            </div>
        </Link>
    )
}

export function StatCard({ icon, label, value, color = '#60a5fa', sub }) {
    return (
        <div className="card relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            style={{ borderLeft: `4px solid ${color}` }}>

            {/* Background icon blur */}
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] select-none">
                {icon}
            </div>

            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl filter drop-shadow-md">{icon}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.14em] font-black">{label}</span>
                </div>
                <p className="text-4xl font-black tracking-tighter" style={{ color }}>{value}</p>
            </div>

            {sub && <p className="text-[11px] text-slate-400 font-medium mt-auto opacity-70">{sub}</p>}
        </div>
    )
}
