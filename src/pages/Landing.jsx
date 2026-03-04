import { Link } from 'react-router-dom'
import { Navbar, ToastContainer } from '../components/Layout'

const features = [
    { icon: '🧬', title: '50 Biomarker Analysis', desc: 'Comprehensive analysis across 6 tiers including metabolic, cardiac, and hormonal markers.' },
    { icon: '🤖', title: '4 AI Agents', desc: 'Amazon Bedrock Nova powers temporal analysis, correlation detection, predictions, and interventions.' },
    { icon: '📊', title: 'Disease Timeline', desc: 'Predict chronic disease risk at 1, 3, 5, and 10-year horizons with probability scores.' },
    { icon: '🌐', title: 'Multilingual Reports', desc: 'Translate health reports to Hindi, Tamil, Telugu, Marathi, Bengali, and more.' },
    { icon: '⚙️', title: 'Medallion Pipeline', desc: 'Bronze → Silver → Gold data architecture for enterprise-grade data quality.' },
    { icon: '🏥', title: 'India-Focused', desc: 'Calibrated for the Indian population with region-specific risk factors and interventions.' },
]

const stats = [
    { num: '50+', label: 'Biomarkers' },
    { num: '4', label: 'AI Agents' },
    { num: '8', label: 'Languages' },
    { num: '10yr', label: 'Predictions' },
]

export default function Landing() {
    return (
        <div className="min-h-screen bg-grid">
            <Navbar />
            <ToastContainer />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
                {/* Animated background orbs - using enhanced palette */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[15%] -left-32 w-[30rem] h-[30rem] rounded-full blur-[100px] opacity-[0.18] animate-float"
                        style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
                    <div className="absolute bottom-[20%] -right-32 w-[35rem] h-[35rem] rounded-full blur-[120px] opacity-[0.12] animate-float"
                        style={{ background: 'radial-gradient(circle, var(--accent), transparent)', animationDelay: '1.5s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full blur-[150px] opacity-[0.04]"
                        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 text-center animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold mb-8 uppercase tracking-widest"
                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#A5B4FC' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                        Amazon Bedrock Nova Powered
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-8xl font-black mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="gradient-text">Predict.</span>{' '}
                        <span className="text-white">Prevent.</span><br />
                        <span className="gradient-text-green">Thrive.</span>
                    </h1>
                    <p className="text-lg sm:text-2xl text-slate-400 mb-6 font-medium max-w-2xl mx-auto leading-relaxed">
                        Next-gen health intelligence calibrated for the Indian population.
                    </p>
                    <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                        Analyze 50 biomarkers across 6 health tiers to detect chronic disease risk years before symptoms appear.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 px-8">
                        <Link to="/input" className="btn-primary w-full sm:w-auto text-base px-10 py-3.5 shadow-2xl">
                            🚀 Start Your Analysis
                        </Link>
                        <Link to="/dashboard" className="btn-secondary w-full sm:w-auto text-base px-10 py-3.5">
                            📊 View Dashboard
                        </Link>
                    </div>

                    {/* Stats - Horizontal scroll on mobile */}
                    <div className="flex sm:grid sm:grid-cols-4 gap-4 max-w-3xl mx-auto overflow-x-auto pb-4 sm:pb-0 px-4 no-scrollbar">
                        {stats.map(({ num, label }) => (
                            <div key={label} className="glass rounded-2xl p-5 text-center min-w-[140px] flex-shrink-0 sm:min-w-0 transition-transform hover:scale-105 duration-300">
                                <p className="text-3xl font-black gradient-text-blue mb-1">{num}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            <span className="gradient-text">Medical-Grade</span> Precision
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                            Harnessing 4 specialized AI agents to deliver hyper-personalized health insights.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon, title, desc }, i) => (
                            <div
                                key={title}
                                className="card glass-hover animate-slide-up group"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110 duration-300"
                                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(37,99,235,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    {icon}
                                </div>
                                <h3 className="font-bold text-slate-100 text-lg mb-3 tracking-wide">{title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Flow Visual - More impact */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Multi-Agent AI Ecosystem
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm uppercase tracking-widest font-bold">Amazon Bedrock Nova processing chain</p>
                    </div>
                    <div className="card gradient-border p-8 sm:p-12">
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            {[
                                { n: '1', label: 'Temporal\nAnalysis', icon: '📈', color: '#3B82F6' },
                                { arrow: true },
                                { n: '🧠', label: 'Supervisor\nLogic', icon: '', color: '#FBBF24', sup: true },
                                { arrow: true },
                                { n: '2', label: 'Correlations\nEngine', icon: '🔗', color: '#818CF8' },
                                { arrow: true },
                                { n: '3', label: 'Risk\nForecast', icon: '🔮', color: '#EC4899' },
                                { arrow: true },
                                { n: '4', label: 'Bio-Action\nPlan', icon: '💊', color: '#05D6A0' },
                            ].map((item, i) =>
                                item.arrow ? (
                                    <div key={i} className="text-slate-700 text-2xl font-black hidden sm:block">→</div>
                                ) : (
                                    <div key={i} className="flex flex-col items-center gap-3 px-2 min-w-[100px]">
                                        <div
                                            className="w-16 h-16 rounded-[22px] flex items-center justify-center text-2xl font-bold transition-all duration-300"
                                            style={{
                                                background: `linear-gradient(135deg, ${item.color}25, ${item.color}10)`,
                                                border: `1px solid ${item.color}35`,
                                                color: item.color,
                                                boxShadow: `0 0 20px ${item.color}15`
                                            }}
                                        >
                                            {item.sup ? '🧠' : item.icon}
                                        </div>
                                        <p className="text-[10px] text-center text-slate-400 font-black leading-tight uppercase tracking-wider whitespace-pre">
                                            {item.label}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto glass rounded-[2.5rem] p-12 sm:p-20 shadow-[0_0_100px_rgba(37,99,235,0.1)] relative overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

                    <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                        <span className="gradient-text">Ready to know</span><br />
                        <span className="text-white">your BioClock?</span>
                    </h2>
                    <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto">Take 2 minutes to enter your biomarkers and see your health future.</p>
                    <Link to="/input" className="btn-primary text-lg px-12 py-4 shadow-[0_20px_40px_rgba(37,99,235,0.3)]">
                        🧬 Start Free Analysis
                    </Link>
                </div>
            </section>

            <footer className="py-12 text-center border-t border-indigo-950/30">
                <p className="text-[10px] text-slate-600 uppercase tracking-[.3em] font-black mb-4">BioClock Technical Stack</p>
                <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 mb-8">
                    <span className="text-white font-bold text-xs tracking-tighter">AMAZON BEDROCK</span>
                    <span className="text-white font-bold text-xs tracking-tighter">REACT + VITE</span>
                    <span className="text-white font-bold text-xs tracking-tighter">TAILWIND CSS</span>
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                    © 2025 BioClock · Designed for India · Distributed Intelligence
                </p>
            </footer>
        </div>
    )
}
