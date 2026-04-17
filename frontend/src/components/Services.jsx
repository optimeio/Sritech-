import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Tractor, UtensilsCrossed, Hammer, Building2, Layers, Zap, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/siteData';

const iconMap = {
    tractor: Tractor, utensils: UtensilsCrossed,
    hammer: Hammer, building: Building2, layers: Layers, zap: Zap,
};

const GRADIENTS = [
    'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(15,17,23,0))',
    'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(15,17,23,0))',
    'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(15,17,23,0))',
    'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(15,17,23,0))',
    'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(15,17,23,0))',
    'linear-gradient(110deg, rgba(34,197,94,0.15), rgba(15,17,23,0))',
];

export default function Services() {
    const [hoveredId, setHoveredId] = useState(null);
    const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });

    return (
        <section id="services" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="services-title">
            {/* Animated blueprint grid */}
            <div className="absolute inset-0 blueprint-bg" style={{ opacity: 0.35 }} aria-hidden="true" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.85) 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-10" style={{ background: '#ef4444' }} />
                        <span className="font-rajdhani font-semibold text-sm uppercase tracking-widest" style={{ color: '#22c55e' }}>
                            What We Do
                        </span>
                        <div className="h-px w-10" style={{ background: '#ef4444' }} />
                    </div>
                    <h2 id="services-title" className="section-title mb-3">
                        Industrial <span style={{ color: '#ef4444' }}>Manufacturing & Engineering</span> Solutions
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        End-to-end engineering solutions from concept to commissioning across diverse industries
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SERVICES.map((service, i) => {
                        const Icon = iconMap[service.icon] || Hammer;
                        const isHov = hoveredId === service.id;
                        return (
                            <motion.article
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.55, delay: i * 0.08 }}
                                onMouseEnter={() => setHoveredId(service.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative flex flex-col gap-4 p-6 rounded-2xl cursor-default overflow-hidden transition-all duration-300"
                                style={{
                                    background: isHov
                                        ? `${GRADIENTS[i]}, rgba(239,68,68,0.08)`
                                        : 'rgba(26,26,26,0.6)',
                                    border: `1px solid ${isHov ? (i % 2 === 0 ? '#ef4444' : '#22c55e') : 'rgba(192,200,216,0.1)'}`,
                                    backdropFilter: 'blur(14px)',
                                    boxShadow: isHov ? `0 8px 40px ${i % 2 === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}` : '0 4px 20px rgba(0,0,0,0.3)',
                                }}
                                aria-label={`Service: ${service.title}`}
                            >
                                {/* Top accent line */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#ef4444' : '#22c55e'}, transparent)`,
                                        opacity: isHov ? 1 : 0,
                                    }}
                                    aria-hidden="true"
                                />

                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                    style={{
                                        background: isHov ? (i % 2 === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)') : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${isHov ? (i % 2 === 0 ? '#ef4444' : '#22c55e') : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: isHov ? `0 0 18px ${i % 2 === 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` : 'none',
                                    }}
                                >
                                    <Icon
                                        size={26}
                                        style={{ color: isHov ? '#ff6b2b' : '#c0c8d8', transition: 'color 0.3s' }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3
                                        className="font-rajdhani font-bold text-xl mb-2 transition-colors duration-300"
                                        style={{ color: isHov ? (i % 2 === 0 ? '#ef4444' : '#22c55e') : '#f4f6f9' }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p className="font-source text-sm leading-relaxed" style={{ color: 'rgba(192,200,216,0.72)' }}>
                                        {service.desc}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ x: 4 }}
                                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    aria-label={`Learn more about ${service.title}`}
                                    className="flex items-center gap-1.5 font-rajdhani font-semibold text-sm self-start transition-all duration-200"
                                    style={{ color: i % 2 === 0 ? '#ef4444' : '#22c55e' }}
                                >
                                    Learn More <ArrowRight size={14} />
                                </motion.button>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
