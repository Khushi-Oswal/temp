import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ingestPatient } from '../utils/api'
import { Navbar, ToastContainer, PageWrapper, MobileBottomNav } from '../components/Layout'
import { toast } from '../utils/toast'

/* ─── Deterministic Patient-ID generator ─────────────────────
   Same name + age + sex → always the same ID.
   Stored in localStorage so refreshing doesn't change it.
────────────────────────────────────────────────────────────── */
function makePatientId(name, age, sex) {
    const key = `${(name || '').trim().toLowerCase()}|${age}|${(sex || '').toLowerCase()}`
    const stored = localStorage.getItem(`pid:${key}`)
    if (stored) return stored
    // Simple djb2 hash → deterministic short ID
    let h = 5381
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h) ^ key.charCodeAt(i)
    const pid = `BIO${Math.abs(h).toString(36).toUpperCase().padStart(6, '0')}`
    localStorage.setItem(`pid:${key}`, pid)
    return pid
}

const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Ahmedabad', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Agra',
]

const BIOMARKER_TIERS = [
    {
        tier: 'Metabolic Markers', icon: '🍬',
        fields: [
            { key: 'hba1c', label: 'HbA1c', unit: '%', placeholder: '5.7', min: 3, max: 15 },
            { key: 'fasting_glucose', label: 'Fasting Glucose', unit: 'mg/dL', placeholder: '95', min: 50, max: 500 },
            { key: 'uric_acid', label: 'Uric Acid', unit: 'mg/dL', placeholder: '5.0', min: 1, max: 15 },
        ],
    },
    {
        tier: 'Cardiovascular', icon: '❤️',
        fields: [
            { key: 'systolic_bp', label: 'Systolic BP', unit: 'mmHg', placeholder: '120', min: 80, max: 220 },
            { key: 'diastolic_bp', label: 'Diastolic BP', unit: 'mmHg', placeholder: '80', min: 50, max: 140 },
            { key: 'ldl', label: 'LDL Cholesterol', unit: 'mg/dL', placeholder: '100', min: 0, max: 400 },
            { key: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', placeholder: '60', min: 0, max: 120 },
            { key: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', placeholder: '150', min: 0, max: 1000 },
        ],
    },
    {
        tier: 'Renal Markers', icon: '🫘',
        fields: [
            { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', placeholder: '1.0', min: 0.1, max: 15 },
        ],
    },
    {
        tier: 'Hormonal Markers', icon: '⚗️',
        fields: [
            { key: 'tsh', label: 'TSH', unit: 'mIU/L', placeholder: '2.0', min: 0.01, max: 50 },
        ],
    },
    {
        tier: 'Micronutrients', icon: '💊',
        fields: [
            { key: 'vitamin_d', label: 'Vitamin D', unit: 'ng/mL', placeholder: '30', min: 0, max: 100 },
        ],
    },
    {
        tier: 'Hematology', icon: '🩸',
        fields: [
            { key: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL', placeholder: '14', min: 3, max: 20 },
        ],
    },
]

const TOTAL_BIOMARKERS = BIOMARKER_TIERS.reduce((s, t) => s + t.fields.length, 0)

export default function PatientInput() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        patient_id: '', name: '', age: '', sex: '', bmi: '',
        city: '', smoking: false, family_history: false,
        biomarkers: {},
    })

    /* Recompute patient_id whenever name / age / sex changes */
    useEffect(() => {
        if (form.name.trim() && form.age && form.sex) {
            const pid = makePatientId(form.name, form.age, form.sex)
            setForm(f => ({ ...f, patient_id: pid }))
        } else {
            setForm(f => ({ ...f, patient_id: '' }))
        }
    }, [form.name, form.age, form.sex])

    const setField = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), [])
    const setBm = useCallback((k, v) => setForm(f => ({ ...f, biomarkers: { ...f.biomarkers, [k]: v } })), [])

    const filledCount = Object.values(form.biomarkers).filter(v => v !== '').length
    const canStep2 = form.name.trim() && form.age && form.sex

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (filledCount < 5) { toast.warning('Please fill in at least 5 biomarker values.'); return }
        setSubmitting(true)
        const payload = {
            patient_id: form.patient_id,
            name: form.name,
            age: Number(form.age),
            sex: form.sex,
            bmi: form.bmi ? Number(form.bmi) : undefined,
            city: form.city || undefined,
            smoking: form.smoking,
            family_history: form.family_history,
            biomarkers: Object.fromEntries(
                Object.entries(form.biomarkers)
                    .filter(([, v]) => v !== '')
                    .map(([k, v]) => [k, Number(v)])
            ),
        }
        try {
            await ingestPatient(payload)
            toast.success('Patient data submitted successfully!')
        } catch {
            toast.info('Submission attempted — navigating to patient detail.')
        }
        setTimeout(() => navigate(`/patient/${form.patient_id}`), 1200)
        setSubmitting(false)
    }

    /* ── Step indicator ── */
    const StepDot = ({ n, label }) => (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0"
                style={{
                    background: step >= n ? 'linear-gradient(135deg,#4338CA,#2563EB)' : 'rgba(99,102,241,.1)',
                    border: `2px solid ${step >= n ? '#6366F1' : 'rgba(99,102,241,.25)'}`,
                    color: step >= n ? '#fff' : '#4A5568',
                    boxShadow: step >= n ? '0 0 14px rgba(99,102,241,.35)' : 'none',
                }}>
                {step > n ? '✓' : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? 'text-slate-200' : 'text-slate-600'}`}>{label}</span>
        </div>
    )

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>
            <Navbar />
            <ToastContainer />
            <div className="page-wrapper">
                <div className="page-inner">
                    {/* ── Header ── */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl sm:text-4xl font-black gradient-text mb-2">New Patient Entry</h1>
                        <p className="text-slate-400 text-sm">Enter health data to begin AI-powered risk prediction</p>
                    </div>

                    {/* ── Step dots ── */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
                        <StepDot n={1} label="Demographics" />
                        <div className="flex-1 max-w-16 h-0.5 rounded-full transition-all duration-500"
                            style={{ background: step > 1 ? 'linear-gradient(90deg,#6366F1,#2563EB)' : 'rgba(99,102,241,.15)' }} />
                        <StepDot n={2} label="Biomarkers" />
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">

                        {/* ════ Step 1: Demographics ════ */}
                        {step === 1 && (
                            <div className="card animate-fade-in">
                                <h2 className="text-base sm:text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
                                    👤 Patient Demographics
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="sm:col-span-2">
                                        <label>Full Name *</label>
                                        <input className="input-field" placeholder="e.g. Arjun Sharma" required
                                            value={form.name} onChange={e => setField('name', e.target.value)} />
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label>Age * (years)</label>
                                        <input className="input-field" type="number" placeholder="45" min={1} max={120}
                                            value={form.age} onChange={e => setField('age', e.target.value)} />
                                    </div>

                                    {/* Sex */}
                                    <div>
                                        <label>Biological Sex *</label>
                                        <select className="input-field" value={form.sex} onChange={e => setField('sex', e.target.value)}>
                                            <option value="">Select...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Patient ID — read-only, auto-computed */}
                                    <div className="sm:col-span-2">
                                        <label>Patient ID <span className="normal-case text-indigo-400 font-normal">(auto-generated · unique per patient)</span></label>
                                        <div className="relative">
                                            <input
                                                className="input-field pr-10"
                                                value={form.patient_id || (canStep2 ? 'Computing…' : 'Fill name, age & sex above')}
                                                readOnly
                                                disabled={false}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">🔒</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Same patient details will always produce the same ID — no duplicates.
                                        </p>
                                    </div>

                                    {/* BMI */}
                                    <div>
                                        <label>BMI (kg/m²)</label>
                                        <input className="input-field" type="number" step="0.1" placeholder="22.5" min={10} max={60}
                                            value={form.bmi} onChange={e => setField('bmi', e.target.value)} />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label>City</label>
                                        <select className="input-field" value={form.city} onChange={e => setField('city', e.target.value)}>
                                            <option value="">Select city...</option>
                                            {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div className="flex flex-wrap gap-4 mt-5">
                                    {[
                                        { key: 'smoking', label: '🚬 Current Smoker' },
                                        { key: 'family_history', label: '🧬 Family History of Chronic Disease' },
                                    ].map(({ key, label }) => (
                                        <button type="button" key={key}
                                            onClick={() => setField(key, !form[key])}
                                            className="flex items-center gap-2.5 cursor-pointer text-sm transition-all duration-200"
                                            style={{ color: form[key] ? '#A5B4FC' : '#4A5568', background: 'none', border: 'none', padding: 0 }}>
                                            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-200"
                                                style={{
                                                    background: form[key] ? 'linear-gradient(135deg,#4338CA,#6366F1)' : 'rgba(99,102,241,.08)',
                                                    border: `2px solid ${form[key] ? '#6366F1' : 'rgba(99,102,241,.25)'}`,
                                                    boxShadow: form[key] ? '0 0 10px rgba(99,102,241,.3)' : 'none',
                                                }}>
                                                {form[key] && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end mt-7">
                                    <button type="button" className="btn-primary px-8"
                                        onClick={() => setStep(2)} disabled={!canStep2}>
                                        Next: Biomarkers →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ════ Step 2: Biomarkers ════ */}
                        {step === 2 && (
                            <div className="space-y-5 animate-fade-in">
                                {/* Sub-header */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                style={{ background: 'rgba(99,102,241,.15)', color: '#A5B4FC', border: '1px solid rgba(99,102,241,.25)' }}>
                                                {form.patient_id}
                                            </span>
                                            <span className="text-xs text-slate-500">{form.name} · {form.age}y · {form.sex}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Fill at least 5 biomarkers. Empty fields are skipped.</p>
                                    </div>
                                    <button type="button" className="btn-secondary text-sm" onClick={() => setStep(1)}>← Back</button>
                                </div>

                                {/* Tier cards */}
                                {BIOMARKER_TIERS.map(({ tier, icon, fields }) => (
                                    <div key={tier} className="card">
                                        <h3 className="font-semibold text-slate-100 text-sm mb-4 flex items-center gap-2">
                                            <span className="text-xl">{icon}</span>{tier}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {fields.map(({ key, label, unit, placeholder, min, max }) => (
                                                <div key={key}>
                                                    <label>{label} <span className="text-slate-600 normal-case font-normal">({unit})</span></label>
                                                    <div className="relative">
                                                        <input
                                                            className="input-field pr-16"
                                                            type="number" step="0.01"
                                                            placeholder={placeholder} min={min} max={max}
                                                            value={form.biomarkers[key] || ''}
                                                            onChange={e => setBm(key, e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">{unit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Submit footer */}
                                <div className="card">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        {/* Progress */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                                                <span>Biomarkers filled</span>
                                                <span className="font-bold" style={{ color: filledCount >= 5 ? '#05D6A0' : '#FBBF24' }}>
                                                    {filledCount} / {TOTAL_BIOMARKERS}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,.1)' }}>
                                                <div className="h-2 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${(filledCount / TOTAL_BIOMARKERS) * 100}%`,
                                                        background: filledCount >= 5
                                                            ? 'linear-gradient(90deg,#4338CA,#05D6A0)'
                                                            : 'linear-gradient(90deg,#4338CA,#FBBF24)',
                                                    }} />
                                            </div>
                                            {filledCount < 5 && (
                                                <p className="text-xs text-amber-400 mt-1">⚠️ Need {5 - filledCount} more biomarker{5 - filledCount > 1 ? 's' : ''}</p>
                                            )}
                                        </div>

                                        <button type="submit" className="btn-primary px-7 py-3 text-base shrink-0" disabled={submitting || filledCount < 5}>
                                            {submitting ? '⏳ Submitting…' : '🚀 Submit & Analyze'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
