import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Tractor, UtensilsCrossed, Droplets, Train, Map, Building2, Zap, Factory,
} from 'lucide-react';
import { INDUSTRIES } from '../data/siteData';

const iconMap = {
    tractor: Tractor,
    utensils: UtensilsCrossed,
    droplets: Droplets,
    train: Train,
    map: Map,
    building2: Building2,
    zap: Zap,
    factory: Factory,
};

export default function Industries() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="industries" className="relative py-24 overflow-hidden" aria-labelledby="industries-title">
            <div
                className="absolute inset-0 blueprint-bg"
                style={{ backgroundSize: '40px 40px', opacity: 0.3 }}
                aria-hidden="true"
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.9) 50%, #0f1117 100%)' }}
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
                        <div className="h-px w-12 bg-red" />
                        <span className="font-rajdhani text-green uppercase tracking-widest text-sm font-semibold">Sectors We Serve</span>
                        <div className="h-px w-12 bg-red" />
                    </div>
                    <h2 id="industries-title" className="section-title mb-4">
                        Industries We <span className="text-red">Serve</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Delivering precision engineering solutions across diverse and demanding industrial sectors
                    </p>
                </motion.div>

                {/* Hexagonal/angled grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {INDUSTRIES.map((industry, i) => {
                        const Icon = iconMap[industry.icon] || Factory;
                        return (
                            <motion.div
                                key={industry.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                whileHover={{ scale: 1.05, y: -6 }}
                                className="group relative glass-card p-6 flex flex-col items-center justify-center gap-4 cursor-default text-center transition-all duration-300"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                                }}
                                aria-label={`Industry: ${industry.name}`}
                            >
                                {/* Icon container */}
                                <div
                                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        background: `${industry.color}20`,
                                        border: `1px solid ${industry.color}40`,
                                    }}
                                >
                                    <Icon size={28} color={industry.color} />
                                </div>

                                <span className="font-rajdhani font-bold text-sm text-offwhite group-hover:text-green transition-colors duration-300 leading-tight">
                                    {industry.name}
                                </span>

                                {/* Hover glow */}
                                <div
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{ boxShadow: `inset 0 0 30px ${industry.color}15` }}
                                    aria-hidden="true"
                                />
                                <div
                                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(90deg, transparent, ${industry.color}, transparent)` }}
                                    aria-hidden="true"
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
