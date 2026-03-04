import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from 'recharts'
import { BIOMARKER_RANGES } from '../utils/health'

const ZONE_COLORS = {
    normal: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
}

function getValueColor(key, value) {
    const range = BIOMARKER_RANGES[key]
    if (!range) return '#60a5fa'
    if (key === 'hdl') {
        if (value >= 60) return ZONE_COLORS.normal
        if (value >= 40) return ZONE_COLORS.warning
        return ZONE_COLORS.danger
    }
    if (value >= range.danger[0]) return ZONE_COLORS.danger
    if (value >= range.warning[0]) return ZONE_COLORS.warning
    return ZONE_COLORS.normal
}

const CustomTooltip = ({ active, payload, label, bioKey }) => {
    if (!active || !payload?.length) return null
    const val = payload[0]?.value
    const color = getValueColor(bioKey, val)
    const range = BIOMARKER_RANGES[bioKey]
    return (
        <div className="glass rounded-xl p-3 text-sm" style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
            <p className="text-slate-400 text-xs mb-1">{label}</p>
            <p className="font-bold text-base" style={{ color }}>{val} {range?.unit}</p>
            <p className="text-xs mt-1" style={{ color }}>
                {val >= (range?.danger?.[0] || Infinity) ? '⚠️ High Risk Zone'
                    : val >= (range?.warning?.[0] || Infinity) ? '⚡ Pre-disease Zone'
                        : '✅ Normal Range'}
            </p>
        </div>
    )
}

export function BiomarkerTrendChart({ bioKey, data, title }) {
    const range = BIOMARKER_RANGES[bioKey] || {}
    if (!data || data.length === 0) {
        return (
            <div className="card flex items-center justify-center" style={{ minHeight: 200 }}>
                <p className="text-slate-500 text-sm">No trend data available</p>
            </div>
        )
    }

    const values = data.map(d => d.value).filter(Boolean)
    const minVal = Math.min(...values, range.normal?.[0] || 0) * 0.85
    const maxVal = Math.max(...values, range.danger?.[1] || 0, range.normal?.[1] || 0) * 1.1

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="font-semibold text-slate-100 text-sm">{title || range.name || bioKey}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Normal: {range.normal?.[0]}–{range.normal?.[1]} {range.unit}</p>
                </div>
                {values.length > 0 && (
                    <div className="text-right">
                        <span className="text-lg font-bold" style={{ color: getValueColor(bioKey, values[values.length - 1]) }}>
                            {values[values.length - 1]}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">{range.unit}</span>
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <defs>
                        <linearGradient id={`grad-${bioKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[minVal, maxVal]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<CustomTooltip bioKey={bioKey} />} />

                    {/* Normal zone reference lines */}
                    {range.normal && (
                        <>
                            <ReferenceLine y={range.normal[0]} stroke={ZONE_COLORS.normal} strokeDasharray="5 3" strokeOpacity={0.5} />
                            <ReferenceLine y={range.normal[1]} stroke={ZONE_COLORS.warning} strokeDasharray="5 3" strokeOpacity={0.5} />
                        </>
                    )}
                    {range.danger && (
                        <ReferenceLine y={range.danger[0]} stroke={ZONE_COLORS.danger} strokeDasharray="5 3" strokeOpacity={0.5} />
                    )}

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        fill={`url(#grad-${bioKey})`}
                        dot={(props) => {
                            const color = getValueColor(bioKey, props.payload.value)
                            return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill={color} stroke="#0a1628" strokeWidth={2} />
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function DiseasePredictionChart({ predictions }) {
    if (!predictions || predictions.length === 0) {
        return (
            <div className="card flex items-center justify-center" style={{ minHeight: 200 }}>
                <p className="text-slate-500 text-sm">No predictions available</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h4 className="font-semibold text-slate-100 mb-4">Disease Risk Timeline</h4>
            <div className="space-y-4">
                {predictions.map((pred, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-slate-200">{pred.disease}</span>
                            <div className="flex gap-3 text-xs">
                                {pred.timeline && Object.entries(pred.timeline).map(([yr, prob]) => (
                                    <span key={yr} className="text-slate-400">
                                        <span className="font-semibold" style={{ color: prob > 60 ? '#EF4444' : prob > 30 ? '#F59E0B' : '#10B981' }}>
                                            {prob}%
                                        </span>
                                        <span className="ml-0.5 text-slate-600">/{yr}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Probability bar (5yr as indicator) */}
                        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(30,64,175,0.15)' }}>
                            <div
                                className="h-2 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${pred.probability || pred.timeline?.['5yr'] || 0}%`,
                                    background: (pred.probability || pred.timeline?.['5yr'] || 0) > 60
                                        ? 'linear-gradient(90deg, #EF4444, #FF6B6B)'
                                        : (pred.probability || pred.timeline?.['5yr'] || 0) > 30
                                            ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                            : 'linear-gradient(90deg, #10B981, #34D399)',
                                }}
                            />
                        </div>
                        {pred.drivers && (
                            <p className="text-xs text-slate-500 mt-1">Key drivers: {pred.drivers.join(', ')}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
