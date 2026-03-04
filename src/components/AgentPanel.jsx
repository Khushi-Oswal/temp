import { useState } from 'react'

const AGENTS = [
    {
        id: 1,
        name: 'Temporal Pattern Analysis',
        icon: '📈',
        color: '#3B82F6',
        description: 'Analyzes biomarker trends, rate of change, and concerning trajectories over time.',
    },
    {
        id: 2,
        name: 'Biomarker Correlations',
        icon: '🔗',
        color: '#8B5CF6',
        description: 'Detects clusters and correlations across 50 biomarkers for compound risk assessment.',
    },
    {
        id: 3,
        name: 'Disease Predictions',
        icon: '🔮',
        color: '#EC4899',
        description: 'Predicts disease probabilities across 1, 3, 5, and 10-year timelines.',
    },
    {
        id: 4,
        name: 'Intervention Plan',
        icon: '💊',
        color: '#10B981',
        description: 'Generates personalized diet, exercise, and monitoring interventions.',
    },
]

function AgentNode({ agent, status, isActive }) {
    const statColors = {
        complete: '#10B981',
        running: '#3B82F6',
        pending: '#475569',
        skipped: '#F59E0B',
    }
    const color = statColors[status] || '#475569'

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500"
                    style={{
                        background: status === 'running' ? `radial-gradient(circle, ${agent.color}40, ${agent.color}20)` : `${agent.color}20`,
                        border: `2px solid ${status === 'complete' ? agent.color : status === 'running' ? agent.color : '#1e3a8a'}`,
                        boxShadow: status === 'running' ? `0 0 16px ${agent.color}60` : 'none',
                        animation: status === 'running' ? 'pulse-ring 2s infinite' : 'none',
                    }}
                >
                    {status === 'complete' ? '✓' : agent.icon}
                </div>
            </div>
            <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">Agent {agent.id}</p>
                <p className="text-xs text-slate-500">{status}</p>
            </div>
        </div>
    )
}

function SupervisorNode({ status }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <div
                className="px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{
                    background: status === 'complete' ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.05)',
                    border: `1px solid ${status === 'complete' ? 'rgba(245,158,11,0.5)' : 'rgba(245,158,11,0.2)'}`,
                    color: '#F59E0B',
                }}
            >
                🧠 Supervisor
            </div>
        </div>
    )
}

export function AgentFlowDiagram({ agentStatuses = {} }) {
    const flow = ['agent1', 'supervisor', 'agent2', 'agent3', 'agent4']
    return (
        <div className="card mb-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">Agent Processing Chain</h4>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {AGENTS.map((agent, i) => (
                    <div key={agent.id} className="flex items-center gap-1">
                        <AgentNode
                            agent={agent}
                            status={agentStatuses[`agent${agent.id}`] || 'pending'}
                        />
                        {i < AGENTS.length - 1 && (
                            <>
                                <div className="h-0.5 w-4 sm:w-8" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), rgba(59,130,246,0.1))' }} />
                                {i === 0 && <SupervisorNode status={agentStatuses.supervisor || 'pending'} />}
                                {i === 0 && <div className="h-0.5 w-4 sm:w-8" style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.3), rgba(59,130,246,0.2))' }} />}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export function AgentProgressSteps({ currentStep, steps }) {
    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <h4 className="font-semibold text-slate-200">AI Analysis in Progress</h4>
            </div>
            <div className="space-y-3">
                {steps.map((step, i) => {
                    const done = i < currentStep
                    const active = i === currentStep
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-500"
                                style={{
                                    background: done ? '#10B981' : active ? '#3B82F6' : 'rgba(30,64,175,0.2)',
                                    border: `2px solid ${done ? '#10B981' : active ? '#60a5fa' : '#1e3a8a'}`,
                                }}
                            >
                                {done ? '✓' : active ? <span className="animate-pulse">●</span> : ''}
                            </div>
                            <span className={`text-sm transition-colors duration-300 ${done ? 'text-slate-400 line-through' : active ? 'text-slate-100 font-medium' : 'text-slate-600'}`}>
                                {step}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function AgentReasoningPanel({ agentId, agentName, icon, color, content, isLoading }) {
    const [open, setOpen] = useState(true)

    return (
        <div
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{ border: `1px solid ${color}30`, background: `${color}06` }}
        >
            {/* Header */}
            <button
                className="w-full flex items-center justify-between p-4 text-left hover:opacity-90 transition-opacity"
                onClick={() => setOpen(!open)}
                style={{ background: `linear-gradient(135deg, ${color}12, transparent)` }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-100 text-sm">Agent {agentId}: {agentName}</p>
                        {isLoading && <p className="text-xs animate-pulse" style={{ color }}>Processing...</p>}
                        {!isLoading && content && <p className="text-xs text-slate-500">Click to {open ? 'collapse' : 'expand'}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isLoading && <div className="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: color }} />}
                    {!isLoading && content && (
                        <div className="w-5 h-5 rounded flex items-center justify-center text-xs transition-transform duration-300"
                            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color }}>
                            ▼
                        </div>
                    )}
                    {!isLoading && !content && <span className="text-xs text-slate-600">Pending</span>}
                </div>
            </button>

            {/* Body */}
            {open && (isLoading || content) && (
                <div className="p-4 pt-0">
                    {isLoading ? (
                        <div className="space-y-2">
                            {[80, 60, 90, 50].map((w, i) => (
                                <div key={i} className="skeleton h-3 rounded" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap rounded-lg p-3"
                            style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(59,130,246,0.08)' }}
                        >
                            {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export { AGENTS }
