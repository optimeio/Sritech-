import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClipboardList, DraftingCompass, Layers, Factory, Truck } from 'lucide-react';
import { PROCESS_STEPS } from '../data/siteData';

const iconMap = {
    'clipboard-list': ClipboardList,
    'drafting-compass': DraftingCompass,
    layers: Layers,
    factory: Factory,
    truck: Truck,
};

export default function HowWeWork() {
    const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section id="how-we-work" className="relative py-24 overflow-hidden" aria-labelledby="process-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, #0a0f18 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-orange" />
                        <span className="font-rajdhani text-orange uppercase tracking-widest text-sm font-semibold">Our Process</span>
                        <div className="h-px w-12 bg-orange" />
                    </div>
                    <h2 id="process-title" className="section-title mb-4">
                        How We <span className="text-orange">Work</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        A systematic 5-step engineering process ensuring quality, precision, and on-time delivery
                    </p>
                </motion.div>

                {/* Steps — horizontal on desktop, vertical on mobile */}
                <div className="relative">
                    {/* Horizontal connector line (desktop) */}
                    <div
                        className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-px"
                        style={{ background: 'rgba(255,107,43,0.15)' }}
                        aria-hidden="true"
                    >
                        {/* Animated glow traveling through line */}
                        <motion.div
                            className="absolute top-0 h-full"
                            style={{ width: '20%', background: 'linear-gradient(90deg, transparent, rgba(255,107,43,0.5), transparent)' }}
                            animate={{ left: ['0%', '80%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
                        {PROCESS_STEPS.map((step, i) => {
                            const Icon = iconMap[step.icon] || Factory;
                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: i * 0.12 }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    {/* Step bubble */}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="relative mb-4"
                                    >
                                        {/* Number badge */}
                                        <div
                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange flex items-center justify-center font-rajdhani font-bold text-xs text-white z-10"
                                            aria-hidden="true"
                                        >
                                            {step.step}
                                        </div>
                                        <div
                                            className="w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                                            style={{
                                                background: 'rgba(30,58,95,0.3)',
                                                border: '1px solid rgba(255,107,43,0.2)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            <div
                                                className="w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-orange/20"
                                                style={{ background: 'rgba(30,58,95,0.5)' }}
                                            >
                                                <Icon size={36} color="#ff6b2b" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Connector line below icon (desktop) */}
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div
                                            className="hidden lg:block absolute"
                                            style={{ top: '56px', left: `${((i + 1) / PROCESS_STEPS.length) * 100 - 10}%` }}
                                            aria-hidden="true"
                                        />
                                    )}

                                    <h3 className="font-rajdhani font-bold text-lg text-offwhite mb-2 group-hover:text-orange transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="font-source text-silver/70 text-sm leading-relaxed max-w-[180px]">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Mobile vertical dashed connector */}
                    <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px" style={{ background: 'repeating-linear-gradient(to bottom, rgba(255,107,43,0.4) 0, rgba(255,107,43,0.4) 8px, transparent 8px, transparent 16px)' }} aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}
