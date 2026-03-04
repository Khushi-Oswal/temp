import { useState } from 'react'
import { translateText } from '../utils/api'
import { toast } from '../utils/toast'
import { INDIAN_LANGUAGES } from '../utils/health'
import { Spinner } from './Layout'

export function TranslationPanel({ text }) {
    const [lang, setLang] = useState('')
    const [translated, setTranslated] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTranslate = async () => {
        if (!lang || !text) return
        setLoading(true)
        setTranslated('')
        try {
            const res = await translateText(text, lang)
            setTranslated(res.data?.translated_text || res.data?.result || JSON.stringify(res.data))
            toast.success(`Translated to ${INDIAN_LANGUAGES.find(l => l.code === lang)?.name}!`)
        } catch (err) {
            toast.error('Translation failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🌐</span>
                <h3 className="font-semibold text-slate-100">Multilingual Translation</h3>
            </div>
            <div className="flex gap-3 flex-wrap mb-4">
                {INDIAN_LANGUAGES.map((l) => (
                    <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                            background: lang === l.code ? 'rgba(59,130,246,0.2)' : 'rgba(30,64,175,0.08)',
                            border: `1px solid ${lang === l.code ? '#60a5fa' : 'rgba(30,64,175,0.2)'}`,
                            color: lang === l.code ? '#93c5fd' : '#94a3b8',
                        }}
                    >
                        {l.flag} {l.name}
                    </button>
                ))}
            </div>
            <button
                className="btn-primary mb-4"
                onClick={handleTranslate}
                disabled={!lang || loading}
            >
                {loading ? '⏳' : '🔄'} {loading ? 'Translating...' : 'Translate Report'}
            </button>
            {loading && <Spinner label="Translating..." />}
            {translated && (
                <div
                    className="rounded-xl p-4 text-sm text-slate-200 leading-relaxed"
                    style={{ background: 'rgba(30,64,175,0.08)', border: '1px solid rgba(30,64,175,0.2)' }}
                >
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
                        {INDIAN_LANGUAGES.find(l => l.code === lang)?.flag} Translated ({INDIAN_LANGUAGES.find(l => l.code === lang)?.name})
                    </p>
                    <p>{translated}</p>
                </div>
            )}
        </div>
    )
}

export function ETLPipelinePanel({ patientId, onComplete }) {
    const [status, setStatus] = useState('idle') // idle | running | done | error
    const [step, setStep] = useState(0)

    const steps = [
        { key: 'bronze', label: 'Bronze Layer', icon: '🥉', desc: 'Ingesting raw biomarker data' },
        { key: 'silver', label: 'Silver Layer', icon: '🥈', desc: 'Cleaning & normalizing data' },
        { key: 'gold', label: 'Gold Layer', icon: '🥇', desc: 'Aggregating analytical datasets' },
    ]

    const runPipeline = async () => {
        setStatus('running')
        setStep(0)
        try {
            const { runETL } = await import('../utils/api')

            // Simulate step-by-step progress
            for (let i = 0; i < steps.length; i++) {
                setStep(i)
                await new Promise((r) => setTimeout(r, 1200))
            }

            await runETL(patientId)
            setStep(3)
            setStatus('done')
            toast.success('ETL pipeline completed successfully!')
            onComplete?.()
        } catch {
            toast.error('ETL pipeline failed.')
            setStatus('error')
        }
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚙️</span>
                    <div>
                        <h3 className="font-semibold text-slate-100">ETL Medallion Pipeline</h3>
                        <p className="text-xs text-slate-500">Bronze → Silver → Gold architecture</p>
                    </div>
                </div>
                <button
                    className="btn-secondary text-sm"
                    onClick={runPipeline}
                    disabled={status === 'running'}
                >
                    {status === 'running' ? '⏳ Running...' : '▶️ Run ETL'}
                </button>
            </div>

            <div className="flex gap-3">
                {steps.map((s, i) => {
                    const isDone = status === 'done' || (status === 'running' && i < step)
                    const isActive = status === 'running' && i === step
                    return (
                        <div key={s.key} className="flex-1">
                            <div
                                className="rounded-xl p-3 text-center transition-all duration-500"
                                style={{
                                    background: isDone ? `rgba(16,185,129,0.1)` : isActive ? 'rgba(59,130,246,0.1)' : 'rgba(30,64,175,0.05)',
                                    border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : isActive ? 'rgba(59,130,246,0.3)' : 'rgba(30,64,175,0.1)'}`,
                                    boxShadow: isActive ? '0 0 16px rgba(59,130,246,0.2)' : 'none',
                                }}
                            >
                                <div className="text-2xl mb-1">
                                    {isDone ? s.icon : isActive ? <span className="animate-pulse">{s.icon}</span> : s.icon}
                                </div>
                                <p className="text-xs font-semibold text-slate-300">{s.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                                {isDone && <p className="text-xs text-emerald-400 mt-1 font-medium">✓ Done</p>}
                                {isActive && <p className="text-xs text-blue-400 mt-1 font-medium animate-pulse">Processing...</p>}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="hidden sm:flex items-center justify-center mt-2 text-slate-600 text-xs">→</div>
                            )}
                        </div>
                    )
                })}
            </div>

            {status === 'done' && (
                <div className="mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
                    ✅ Pipeline complete! Data is ready for AI analysis.
                </div>
            )}
            {status === 'error' && (
                <div className="mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
                    ❌ Pipeline failed. Please check logs and retry.
                </div>
            )}
        </div>
    )
}
