export function getRiskLevel(score) {
    if (score == null) return { label: 'Unknown', color: '#94a3b8', css: '', emoji: '⚪', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' }
    if (score < 30) return { label: 'Low', color: '#10B981', css: 'risk-low', emoji: '🟢', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' }
    if (score < 60) return { label: 'Moderate', color: '#F59E0B', css: 'risk-moderate', emoji: '🟡', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' }
    if (score < 80) return { label: 'High', color: '#EF4444', css: 'risk-high', emoji: '🔴', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' }
    return { label: 'Critical', color: '#FF1744', css: 'risk-critical', emoji: '🚨', bg: 'rgba(255,23,68,0.12)', border: 'rgba(255,23,68,0.3)' }
}

export function getRiskFromLabel(label) {
    if (!label) return getRiskLevel(null)
    const l = label.toLowerCase()
    if (l.includes('low')) return getRiskLevel(15)
    if (l.includes('moderate') || l.includes('medium')) return getRiskLevel(45)
    if (l.includes('high')) return getRiskLevel(65)
    if (l.includes('critical')) return getRiskLevel(90)
    return getRiskLevel(null)
}

export const BIOMARKER_RANGES = {
    hba1c: { name: 'HbA1c', unit: '%', normal: [4, 5.7], warning: [5.7, 6.4], danger: [6.4, 15] },
    fasting_glucose: { name: 'Fasting Glucose', unit: 'mg/dL', normal: [70, 100], warning: [100, 126], danger: [126, 400] },
    systolic_bp: { name: 'Systolic BP', unit: 'mmHg', normal: [90, 120], warning: [120, 140], danger: [140, 200] },
    diastolic_bp: { name: 'Diastolic BP', unit: 'mmHg', normal: [60, 80], warning: [80, 90], danger: [90, 130] },
    ldl: { name: 'LDL Cholesterol', unit: 'mg/dL', normal: [0, 100], warning: [100, 160], danger: [160, 300] },
    hdl: { name: 'HDL Cholesterol', unit: 'mg/dL', normal: [60, 100], warning: [40, 60], danger: [0, 40] },
    triglycerides: { name: 'Triglycerides', unit: 'mg/dL', normal: [0, 150], warning: [150, 200], danger: [200, 500] },
    creatinine: { name: 'Creatinine', unit: 'mg/dL', normal: [0.6, 1.2], warning: [1.2, 2.0], danger: [2.0, 10] },
    tsh: { name: 'TSH', unit: 'mIU/L', normal: [0.4, 4.0], warning: [4.0, 10], danger: [10, 50] },
    vitamin_d: { name: 'Vitamin D', unit: 'ng/mL', normal: [30, 100], warning: [20, 30], danger: [0, 20] },
    uric_acid: { name: 'Uric Acid', unit: 'mg/dL', normal: [2.4, 6.0], warning: [6.0, 7.0], danger: [7.0, 15] },
    hemoglobin: { name: 'Hemoglobin', unit: 'g/dL', normal: [12, 17], warning: [10, 12], danger: [0, 10] },
}

export function getBiomarkerZone(key, value) {
    const range = BIOMARKER_RANGES[key]
    if (!range || value == null) return 'unknown'
    if (value >= range.normal[0] && value <= range.normal[1]) return 'normal'
    if (key === 'hdl') {
        if (value >= 60) return 'normal'
        if (value >= 40) return 'warning'
        return 'danger'
    }
    if (value >= range.warning[0] && value <= range.warning[1]) return 'warning'
    if (value >= range.danger[0]) return 'danger'
    return 'normal'
}

export const INDIAN_LANGUAGES = [
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🏛️' },
    { code: 'te', name: 'Telugu', flag: '🌺' },
    { code: 'mr', name: 'Marathi', flag: '🎭' },
    { code: 'bn', name: 'Bengali', flag: '🌊' },
    { code: 'kn', name: 'Kannada', flag: '🏔️' },
    { code: 'gu', name: 'Gujarati', flag: '🦁' },
    { code: 'pa', name: 'Punjabi', flag: '🌾' },
]
