import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Factory, Truck, GraduationCap } from 'lucide-react';
import { GROUP_COMPANIES } from '../data/siteData';

const iconMap = {
    factory: Factory,
    truck: Truck,
    'graduation-cap': GraduationCap,
};

export default function OurCompanies() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="group" className="relative py-24 overflow-hidden" aria-labelledby="group-title">
            <div
                className="absolute inset-0 blueprint-bg"
                style={{ backgroundSize: '50px 50px', opacity: 0.25 }}
                aria-hidden="true"
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(10,15,24,0.95) 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-orange" />
                        <span className="font-rajdhani text-orange uppercase tracking-widest text-sm font-semibold">The Group</span>
                        <div className="h-px w-12 bg-orange" />
                    </div>
                    <h2 id="group-title" className="section-title mb-4">
                        Our <span className="text-orange">Companies</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        A diversified group spanning manufacturing, agro-trading, and education
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {GROUP_COMPANIES.map((company, i) => {
                        const Icon = iconMap[company.icon] || Factory;
                        return (
                            <motion.article
                                key={company.name}
                                initial={{ opacity: 0, y: 40 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                whileHover={{ y: -8 }}
                                className="glass-card p-8 flex flex-col gap-4 group relative overflow-hidden cursor-default"
                                aria-label={`Company: ${company.name}`}
                            >
                                {/* Accent top border */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(90deg, transparent, ${company.accent}, transparent)`, opacity: 0.6 }}
                                    aria-hidden="true"
                                />

                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                                    style={{ background: `${company.accent}20`, border: `1px solid ${company.accent}40` }}
                                >
                                    <Icon size={26} color={company.accent} />
                                </div>

                                <div>
                                    <h3
                                        className="font-rajdhani font-bold text-xl mb-1 transition-colors duration-300"
                                        style={{ color: company.accent }}
                                    >
                                        {company.name}
                                    </h3>
                                    <p className="font-source text-silver/70 text-sm leading-relaxed mb-2">
                                        {company.desc}
                                    </p>
                                    <span
                                        className="inline-block px-3 py-0.5 rounded-full text-xs font-rajdhani font-semibold"
                                        style={{
                                            background: `${company.accent}15`,
                                            color: company.accent,
                                            border: `1px solid ${company.accent}30`,
                                        }}
                                    >
                                        {company.units}
                                    </span>
                                </div>

                                {/* Corner accent */}
                                <div
                                    className="absolute bottom-0 right-0 w-16 h-16 opacity-10"
                                    style={{
                                        background: `radial-gradient(circle at bottom right, ${company.accent}, transparent)`,
                                    }}
                                    aria-hidden="true"
                                />
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
