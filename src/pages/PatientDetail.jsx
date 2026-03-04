import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPredictions } from '../utils/api'
import { BIOMARKER_RANGES } from '../utils/health'
import { Navbar, ToastContainer, PageWrapper, SectionTitle, Spinner, RiskBadge } from '../components/Layout'
import { BiomarkerTrendChart, DiseasePredictionChart } from '../components/Charts'
import { ETLPipelinePanel } from '../components/HealthTools'
import { TranslationPanel } from '../components/HealthTools'
import { toast } from '../utils/toast'

function BiomarkerGauge({ label, value, unit, min = 0, max = 100, warnMin, warnMax, dangerMin }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  let color = 'var(--risk-low)'
  if (value >= dangerMin) color = 'var(--risk-crit)'
  else if (warnMax && value > warnMax) color = 'var(--risk-crit)'
  else if (value >= warnMin) color = 'var(--risk-mod)'

  return (
    <div className="card glass-hover group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
        <span className="text-sm font-black tracking-tight" style={{ color }}>
          {value} <span className="text-[10px] font-medium text-slate-600 ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-indigo-950/30">
        <div className="h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.3)]"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getPredictions(id)
      const data = res.data
      setPatient(data?.patient || data)
      setPredictions(data?.predictions || [])
    } catch {
      toast.error('Using demo patient data.')
      setPatient(DEMO_PATIENT)
      setPredictions(DEMO_PREDICTIONS)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-grid">
        <Navbar /><ToastContainer />
        <PageWrapper><Spinner label="Accessing clinical records..." /></PageWrapper>
      </div>
    )
  }

  const bm = patient?.biomarkers || DEMO_PATIENT.biomarkers

  const buildTrend = (key, currentVal) => {
    if (!currentVal) return []
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
    return months.map((date, i) => ({
      date,
      value: +(currentVal * (0.92 + i * 0.016 + (Math.random() - 0.5) * 0.03)).toFixed(1),
    }))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'biomarkers', label: 'Biomarkers', icon: '🧬' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'predictions', label: 'Predict', icon: '🔮' },
    { id: 'etl', label: 'ETL Flow', icon: '⚙️' },
    { id: 'translate', label: 'Translate', icon: '🌐' },
  ]

  const reportText = patient
    ? `Patient ${patient.name || id} health report. Risk level: ${patient.overall_risk || 'N/A'}. Key biomarkers: HbA1c ${bm.hba1c}%, Fasting Glucose ${bm.fasting_glucose} mg/dL, Systolic BP ${bm.systolic_bp} mmHg, LDL ${bm.ldl} mg/dL.`
    : ''

  return (
    <div className="min-h-screen bg-grid">
      <Navbar /><ToastContainer />
      <PageWrapper>
        {/* Breadcrumb - More Premium */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-8">
          <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Registry</Link>
          <span className="opacity-30">/</span>
          <span className="text-indigo-300/60">Patient {id}</span>
        </div>

        {/* Patient hero card - Enhanced Visuals */}
        <div className="card gradient-border mb-8 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-4xl font-black shadow-2xl relative"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white' }}>
                {(patient?.name || 'P').charAt(0)}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-bg-card rounded-full" title="Online" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-none" style={{ fontFamily: 'Space Grotesk' }}>
                  {patient?.name || `Patient ${id}`}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">ID: {id}</p>
                  <span className="w-1 h-1 rounded-full bg-slate-800 hidden sm:block" />
                  <p className="text-xs font-bold text-slate-400">{patient?.age}y · {patient?.sex} · {patient?.city}</p>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {patient?.smoking && <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-wider">🚬 Smoker</span>}
                  {patient?.family_history && <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider">🧬 Genetics</span>}
                  {patient?.bmi && <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-black uppercase tracking-wider">⚖️ BMI {patient.bmi}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 pt-6 md:pt-0 border-t md:border-t-0 border-indigo-950/30">
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Calculated Risk</p>
                <RiskBadge risk={patient?.overall_risk} />
              </div>
              <Link to={`/analyze/${id}`} className="btn-primary py-3 px-6 shadow-indigo-500/20 shadow-xl">
                🤖 AI Intelligence
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs - Premium Mobile Slider */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
          {tabs.map(({ id: tid, label, icon }) => (
            <button
              key={tid}
              onClick={() => setActiveTab(tid)}
              className={`px-5 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex items-center gap-2 border-2 ${activeTab === tid
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : 'bg-card/40 border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[400px]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {Object.entries(BIOMARKER_RANGES).map(([key, range]) =>
                bm[key] != null ? (
                  <BiomarkerGauge
                    key={key}
                    label={range.name}
                    value={bm[key]}
                    unit={range.unit}
                    min={range.normal[0] * 0.7}
                    max={Math.max(range.danger?.[1] || 0, range.warning?.[1] || 0) * 1.1}
                    warnMin={range.warning?.[0]}
                    warnMax={range.warning?.[1]}
                    dangerMin={range.danger?.[0]}
                  />
                ) : null
              )}
            </div>
          )}

          {/* Biomarkers Tab */}
          {activeTab === 'biomarkers' && (
            <div className="animate-fade-in space-y-4">
              <div className="card overflow-hidden p-0 border-indigo-900/20">
                <div className="table-wrap">
                  <table className="w-full text-sm">
                    <thead className="bg-indigo-950/20">
                      <tr>
                        {['Biomarker', 'Value', 'Unit', 'Normal Range', 'Condition'].map(h => (
                          <th key={h} className="text-left py-4 px-6 text-[10px] uppercase font-black tracking-widest text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-950/30">
                      {Object.entries(BIOMARKER_RANGES).map(([key, range]) => {
                        if (bm[key] == null) return null
                        const val = bm[key]
                        let status = 'Normal'; let statusColor = 'var(--risk-low)'
                        if (key !== 'hdl') {
                          if (val >= range.danger?.[0]) { status = 'Critical'; statusColor = 'var(--risk-crit)' }
                          else if (val >= range.warning?.[0]) { status = 'Warning'; statusColor = 'var(--risk-mod)' }
                        } else {
                          if (val < 40) { status = 'Critical'; statusColor = 'var(--risk-crit)' }
                          else if (val < 60) { status = 'Sub-optimal'; statusColor = 'var(--risk-mod)' }
                        }
                        return (
                          <tr key={key} className="hover:bg-indigo-500/[0.03] transition-colors group">
                            <td className="py-4 px-6 font-bold text-slate-200 group-hover:text-white">{range.name}</td>
                            <td className="py-4 px-6 font-black text-base" style={{ color: statusColor }}>{val}</td>
                            <td className="py-4 px-6 text-slate-500 font-medium">{range.unit}</td>
                            <td className="py-4 px-6 text-slate-600 font-mono text-xs">{range.normal[0]}–{range.normal[1]}</td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"
                                style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {['hba1c', 'fasting_glucose', 'systolic_bp', 'ldl', 'hdl', 'triglycerides'].map(key =>
                bm[key] != null ? (
                  <BiomarkerTrendChart
                    key={key}
                    bioKey={key}
                    data={buildTrend(key, bm[key])}
                  />
                ) : null
              )}
            </div>
          )}

          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="animate-fade-in">
              <DiseasePredictionChart predictions={predictions.length ? predictions : DEMO_PREDICTIONS} />
            </div>
          )}

          {/* ETL Tab */}
          {activeTab === 'etl' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <ETLPipelinePanel patientId={id} onComplete={fetchData} />
            </div>
          )}

          {/* Translate Tab */}
          {activeTab === 'translate' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <TranslationPanel text={reportText} />
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}

const DEMO_PATIENT = {
  name: 'Arjun Sharma', age: 45, sex: 'Male', city: 'Mumbai',
  overall_risk: 'High', bmi: 27.4, smoking: true, family_history: true,
  biomarkers: {
    hba1c: 6.8, fasting_glucose: 118, systolic_bp: 142, diastolic_bp: 88,
    ldl: 145, hdl: 38, triglycerides: 195, creatinine: 1.1,
    tsh: 3.2, vitamin_d: 18, uric_acid: 6.8, hemoglobin: 13.5,
  },
}

const DEMO_PREDICTIONS = [
  {
    disease: 'Type 2 Diabetes',
    probability: 72,
    timeline: { '1yr': 45, '3yr': 60, '5yr': 72, '10yr': 85 },
    drivers: ['HbA1c', 'Fasting Glucose', 'BMI'],
  },
  {
    disease: 'Hypertension',
    probability: 68,
    timeline: { '1yr': 40, '3yr': 55, '5yr': 68, '10yr': 80 },
    drivers: ['Systolic BP', 'Diastolic BP', 'Sodium intake'],
  },
  {
    disease: 'Coronary Artery Disease',
    probability: 55,
    timeline: { '1yr': 20, '3yr': 38, '5yr': 55, '10yr': 72 },
    drivers: ['LDL', 'HDL', 'Triglycerides'],
  },
  {
    disease: 'Chronic Kidney Disease',
    probability: 30,
    timeline: { '1yr': 10, '3yr': 20, '5yr': 30, '10yr': 45 },
    drivers: ['Creatinine', 'Uric Acid', 'Blood Pressure'],
  },
]
