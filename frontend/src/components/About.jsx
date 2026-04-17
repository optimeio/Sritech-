import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Cpu, Truck, CheckCircle2 } from 'lucide-react';
import { COMPANY, MILESTONE_TIMELINE } from '../data/siteData';

const pillars = [
    { icon: Target, title: 'Design', desc: 'CAD/CAM validated designs' },
    { icon: Cpu, title: 'Manufacture', desc: '2 precision units' },
    { icon: Truck, title: 'Deliver', desc: 'On-time, every time' },
];

/* ─── Animated spinning gears ─── */
function GearDiagram() {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{ height: '320px' }}
            aria-hidden="true"
        >
            {/* Glow orb */}
            <div
                className="absolute"
                style={{
                    width: '200px', height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
                }}
            />

            {/* Large central gear */}
            <motion.svg
                width="140" height="140" viewBox="0 0 140 140"
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
                <defs>
                    <filter id="glow1">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="70" cy="70" r="40" fill="none" stroke="#333333" strokeWidth="10" filter="url(#glow1)" />
                <circle cx="70" cy="70" r="16" fill="#0f1117" stroke="#ef4444" strokeWidth="2.5" />
                {[...Array(8)].map((_, i) => (
                    <rect key={i} x="64" y="10" width="12" height="20" fill="#333333" rx="3"
                        transform={`rotate(${i * 45} 70 70)`} />
                ))}
            </motion.svg>

            {/* Left gear — orange accent */}
            <motion.svg
                width="90" height="90" viewBox="0 0 90 90"
                className="absolute"
                style={{ left: '18%', top: '28%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
                <circle cx="45" cy="45" r="27" fill="none" stroke="#22c55e" strokeWidth="6" strokeOpacity="0.6" />
                <circle cx="45" cy="45" r="10" fill="#0f1117" stroke="#22c55e" strokeWidth="2" />
                {[...Array(6)].map((_, i) => (
                    <rect key={i} x="40" y="7" width="10" height="16" fill="rgba(34, 197, 94, 0.6)" rx="2"
                        transform={`rotate(${i * 60} 45 45)`} />
                ))}
            </motion.svg>

            {/* Right gear */}
            <motion.svg
                width="80" height="80" viewBox="0 0 80 80"
                className="absolute"
                style={{ right: '16%', top: '32%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
                <circle cx="40" cy="40" r="23" fill="none" stroke="#444444" strokeWidth="7" />
                <circle cx="40" cy="40" r="9" fill="#0f1117" stroke="#c0c8d8" strokeWidth="1.5" strokeOpacity="0.5" />
                {[...Array(7)].map((_, i) => (
                    <rect key={i} x="36" y="6" width="8" height="15" fill="#444444" rx="2"
                        transform={`rotate(${i * 51.4} 40 40)`} />
                ))}
            </motion.svg>

            {/* Bottom small gear */}
            <motion.svg
                width="70" height="70" viewBox="0 0 70 70"
                className="absolute"
                style={{ bottom: '10%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            >
                <circle cx="35" cy="35" r="20" fill="none" stroke="rgba(192,200,216,0.3)" strokeWidth="5" />
                <circle cx="35" cy="35" r="8" fill="#0f1117" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.5" />
                {[...Array(6)].map((_, i) => (
                    <rect key={i} x="31" y="6" width="8" height="13" fill="rgba(192,200,216,0.25)" rx="2"
                        transform={`rotate(${i * 60} 35 35)`} />
                ))}
            </motion.svg>

            {/* Animated dashed connector lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="32%" y1="45%" x2="44%" y2="50%" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                </line>
                <line x1="56%" y1="50%" x2="72%" y2="46%" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.2s" repeatCount="indefinite" />
                </line>
            </svg>

            <p className="absolute bottom-0 left-0 right-0 text-center font-rajdhani text-xs tracking-widest" style={{ color: 'rgba(192,200,216,0.35)' }}>
                PRECISION ENGINEERING SYSTEMS
            </p>
        </div>
    );
}

export default function About() {
    const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });
    const [tlRef, tlInView] = useInView({ threshold: 0.08, triggerOnce: true });

    return (
        <section id="about" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="about-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.8) 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-10" style={{ background: '#ef4444' }} />
                        <span className="font-rajdhani font-semibold text-sm uppercase tracking-widest" style={{ color: '#22c55e' }}>
                            Our Story
                        </span>
                        <div className="h-px w-10" style={{ background: '#ef4444' }} />
                    </div>
                    <h2 id="about-title" className="section-title mb-3">
                        Premier <span style={{ color: '#ef4444' }}>Engineering & Manufacturing</span> in Namakkal
                    </h2>
                    <p className="section-subtitle max-w-xl mx-auto">
                        Pioneering precision manufacturing from the heart of Namakkal, Tamil Nadu
                    </p>
                </motion.div>

                {/* Split layout */}
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
                    {/* Left — Gear Diagram */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="glass-card p-6 md:p-10"
                    >
                        <GearDiagram />
                    </motion.div>

                    {/* Right — Company story */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.25 }}
                    >
                        <p className="font-source text-lg leading-relaxed mb-4" style={{ color: '#c0c8d8' }}>
                            <span className="font-semibold" style={{ color: '#ef4444' }}>Sri Tech Engineering</span> is a precision manufacturing
                            company founded in 2020, specializing in Agro, Food &amp; Poultry Machineries, Material
                            Fabrication and Engineering Works.
                        </p>
                        <p className="font-source leading-relaxed mb-4" style={{ color: 'rgba(192,200,216,0.75)' }}>
                            Based in <strong style={{ color: '#f4f6f9' }}>Namakkal, Tamil Nadu</strong>, we operate two advanced manufacturing units in <strong style={{ color: '#f4f6f9' }}>Athanoor</strong> and{' '}
                            <strong style={{ color: '#f4f6f9' }}>Vaiyappamalai</strong>. Our prestigious portfolio includes national-scale projects for Indian Railways, IOCL, SIDCO, and Smart City Highway infrastructures.
                        </p>
                        <p className="font-source leading-relaxed mb-7" style={{ color: 'rgba(192,200,216,0.75)' }}>
                            Led by <span className="font-medium" style={{ color: '#ef4444' }}>Sankarganesh R</span> (CEO) and <span className="font-medium" style={{ color: '#ef4444' }}>Ganga</span> (MD), SM Group and Sri Tech Engineering focus on Delivering excellence through Innovation, Sustainability & Excellence. We bridge the gap between students and industry through technical skill development.
                        </p>

                        {/* Quick achievements */}
                        <div className="space-y-2 mb-7">
                            {[
                                '10+ years of precision engineering experience',
                                'IOCL, SIDCO, Indian Railways projects delivered',
                                'First PEB structure at SIDCO Industrial Estate',
                                'Pioneer in EV Design & 3D Printing in Namakkal',
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2 size={16} style={{ color: '#22c55e', marginTop: 3, flexShrink: 0 }} />
                                    <span className="font-source text-sm" style={{ color: 'rgba(192,200,216,0.8)' }}>{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pillars */}
                        <div className="grid grid-cols-3 gap-3">
                            {pillars.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    whileHover={{ scale: 1.05, borderColor: i % 2 === 0 ? '#ef4444' : '#22c55e' }}
                                    className="glass-card p-4 flex flex-col items-center gap-2 text-center cursor-default transition-all duration-300"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ background: i % 2 === 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', border: `1px solid ${i % 2 === 0 ? '#ef444444' : '#22c55e44'}` }}
                                    >
                                        <Icon size={18} color={i % 2 === 0 ? '#ef4444' : '#22c55e'} />
                                    </div>
                                    <div className="font-rajdhani font-bold text-sm" style={{ color: '#f4f6f9' }}>{title}</div>
                                    <div className="font-source text-xs leading-tight hidden sm:block" style={{ color: 'rgba(192,200,216,0.6)' }}>{desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div ref={tlRef}>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={tlInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="font-rajdhani font-bold text-center mb-10"
                        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#f4f6f9' }}
                    >
                        Our <span style={{ color: '#ef4444' }}>Journey</span>
                    </motion.h3>

                    {/* Mobile: vertical list | Desktop: alternating */}
                    <div className="space-y-4 md:space-y-0 md:relative">
                        {/* Desktop center line */}
                        <div
                            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                            style={{ background: 'linear-gradient(to bottom, transparent, rgba(239, 68, 68, 0.35), transparent)' }}
                            aria-hidden="true"
                        />

                        {MILESTONE_TIMELINE.map((m, i) => (
                            <motion.div
                                key={m.year}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                animate={tlInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.12 }}
                                className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className="glass-card p-4 md:p-5 inline-block w-full">
                                        <div className="font-rajdhani font-bold text-xl mb-0.5" style={{ color: i % 2 === 0 ? '#ef4444' : '#22c55e' }}>
                                            {m.year}
                                        </div>
                                        <div className="font-rajdhani font-bold text-lg" style={{ color: '#f4f6f9' }}>
                                            {m.title}
                                        </div>
                                        <div className="font-source text-sm mt-1 leading-relaxed" style={{ color: 'rgba(192,200,216,0.7)' }}>
                                            {m.desc}
                                        </div>
                                    </div>
                                </div>
                                {/* Center dot (desktop) */}
                                <div
                                    className="hidden md:block w-4 h-4 rounded-full flex-shrink-0 z-10"
                                    style={{ background: i % 2 === 0 ? '#ef4444' : '#22c55e', boxShadow: `0 0 14px ${i % 2 === 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)'}`, border: '3px solid #0f1117' }}
                                    aria-hidden="true"
                                />
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
