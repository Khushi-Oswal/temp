export default function Dashboard() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterRisk, setFilterRisk] = useState('all')

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        setLoading(true)
        try {
            const res = await getPatients()
            const list = res.data?.patients || res.data || []
            setPatients(Array.isArray(list) ? list : [])
        } catch (err) {
            toast.error('Failed to load patients. Showing demo data.')
            setPatients(DEMO_PATIENTS)
        } finally {
            setLoading(false)
        }
    }

    const filtered = patients.filter((p) => {
        const matchSearch = !search ||
            (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            String(p.patient_id).includes(search) ||
            (p.city || '').toLowerCase().includes(search.toLowerCase())
        const matchRisk = filterRisk === 'all' ||
            (p.overall_risk || '').toLowerCase() === filterRisk.toLowerCase()
        return matchSearch && matchRisk
    })

    // Stats
    const riskCounts = patients.reduce((acc, p) => {
        const r = (p.overall_risk || 'unknown').toLowerCase()
        acc[r] = (acc[r] || 0) + 1
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-grid">
            <Navbar />
            <ToastContainer />
            <PageWrapper>
                {/* Header - More Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <SectionTitle
                        icon="📊"
                        title="Health Dashboard"
                        subtitle="Real-time predictive monitoring for your patient population"
                    />
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={fetchPatients} className="btn-secondary flex-1 sm:flex-none justify-center">
                            🔄 Refresh
                        </button>
                        <Link to="/input" className="btn-primary flex-1 sm:flex-none justify-center">
                            ➕ New Patient
                        </Link>
                    </div>
                </div>

                {/* Stat cards - 4 columns on desktop, 2 on tablet, 1 on small mobile */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard icon="👥" label="Total Registry" value={patients.length} color="var(--primary-light)" sub="Registered patients" />
                    <StatCard icon="🟢" label="Low Risk" value={riskCounts.low || 0} color="var(--risk-low)" sub="Stable biomarkers" />
                    <StatCard icon="🟡" label="Moderate" value={riskCounts.moderate || 0} color="var(--risk-mod)" sub="Needs monitoring" />
                    <StatCard icon="🔴" label="At Risk" value={(riskCounts.high || 0) + (riskCounts.critical || 0)} color="var(--risk-high)" sub="Urgent review" />
                </div>

                {/* Search & Filters - More Premium */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                        <input
                            className="input-field pl-11 py-3.5 bg-card/60"
                            placeholder="Search by name, ID, or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {['all', 'low', 'moderate', 'high', 'critical'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilterRisk(r)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap border-2 ${filterRisk === r
                                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                                        : 'bg-card/40 border-indigo-950/30 text-slate-500 hover:border-indigo-800/50'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Risk distribution bar */}
                {patients.length > 0 && (
                    <div className="card mb-10 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Population Risk Spread</p>
                            <p className="text-[10px] text-indigo-400 font-bold">{patients.length} total</p>
                        </div>
                        <div className="flex h-3.5 rounded-full overflow-hidden gap-0.5 bg-indigo-950/20">
                            {[
                                { key: 'low', color: 'var(--risk-low)' },
                                { key: 'moderate', color: 'var(--risk-mod)' },
                                { key: 'high', color: 'var(--risk-high)' },
                                { key: 'critical', color: 'var(--risk-crit)' },
                            ].map(({ key, color }) => {
                                const pct = ((riskCounts[key] || 0) / patients.length) * 100
                                return pct > 0 ? (
                                    <div key={key} className="h-full rounded-sm transition-all duration-1000 animate-slide-in"
                                        title={`${key}: ${riskCounts[key]}`}
                                        style={{ width: `${pct}%`, background: color, '--w': `${pct}%` }} />
                                ) : null
                            })}
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                            {[
                                { key: 'low', color: 'var(--risk-low)', label: 'Low' },
                                { key: 'moderate', color: 'var(--risk-mod)', label: 'Moderate' },
                                { key: 'high', color: 'var(--risk-high)', label: 'High' },
                                { key: 'critical', color: 'var(--risk-crit)', label: 'Critical' },
                            ].map(({ key, color, label }) =>
                                riskCounts[key] ? (
                                    <div key={key} className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ background: color }} />
                                        {label}: {riskCounts[key]}
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                )}

                {/* Patient grid - Animated entry */}
                {loading ? (
                    <Spinner label="Scanning registry..." />
                ) : filtered.length === 0 ? (
                    <div className="card text-center py-20 border-dashed border-indigo-900/30">
                        <p className="text-5xl mb-6 grayscale opacity-50">👥</p>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">No patients found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed mb-8">
                            We couldn't find any patients matching your current search or risk filters.
                        </p>
                        <button
                            onClick={() => { setSearch(''); setFilterRisk('all'); }}
                            className="btn-secondary px-8"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
                        {filtered.map((p, i) => (
                            <PatientCard key={p.patient_id || i} patient={p} index={i} />
                        ))}
                    </div>
                )}
            </PageWrapper>
        </div>
    )
}

const DEMO_PATIENTS = [
    { patient_id: 'P001', name: 'Arjun Sharma', age: 45, sex: 'Male', city: 'Mumbai', overall_risk: 'High', biomarkers_count: 18, created_at: '2025-01-15' },
    { patient_id: 'P002', name: 'Priya Patel', age: 38, sex: 'Female', city: 'Ahmedabad', overall_risk: 'Moderate', biomarkers_count: 14, created_at: '2025-01-20' },
    { patient_id: 'P003', name: 'Rahul Gupta', age: 52, sex: 'Male', city: 'Delhi', overall_risk: 'Critical', biomarkers_count: 20, created_at: '2025-02-01' },
    { patient_id: 'P004', name: 'Sneha Reddy', age: 29, sex: 'Female', city: 'Hyderabad', overall_risk: 'Low', biomarkers_count: 12, created_at: '2025-02-10' },
    { patient_id: 'P005', name: 'Vikram Singh', age: 61, sex: 'Male', city: 'Chennai', overall_risk: 'High', biomarkers_count: 22, created_at: '2025-02-15' },
    { patient_id: 'P006', name: 'Ananya Iyer', age: 34, sex: 'Female', city: 'Bangalore', overall_risk: 'Low', biomarkers_count: 16, created_at: '2025-02-18' },
]
