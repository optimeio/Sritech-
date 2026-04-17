import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CLIENTS } from '../data/siteData';

function MarqueRow({ items, reverse = false }) {
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden relative" aria-hidden="true">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, #0f1117, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(-90deg, #0f1117, transparent)' }} />

            <div
                className="flex gap-6 py-2"
                style={{
                    animation: `${reverse ? 'marquee-reverse' : 'marquee'} 35s linear infinite`,
                    width: 'max-content',
                }}
                onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused'; }}
                onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running'; }}
            >
                {doubled.map((client, i) => (
                    <div
                        key={`${client}-${i}`}
                        className="flex-shrink-0 px-5 py-2.5 rounded-lg font-rajdhani font-semibold text-sm text-silver whitespace-nowrap cursor-default hover:text-green transition-colors duration-200"
                        style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            minWidth: '180px',
                            textAlign: 'center',
                        }}
                    >
                        {client}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Clients() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    const half = Math.ceil(CLIENTS.length / 2);
    const row1 = CLIENTS.slice(0, half);
    const row2 = CLIENTS.slice(half);

    return (
        <section id="clients" className="relative py-24 overflow-hidden" aria-labelledby="clients-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.85) 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-red" />
                            <span className="font-rajdhani text-green uppercase tracking-widest text-sm font-semibold">Our Network</span>
                            <div className="h-px w-12 bg-red" />
                        </div>
                        <h2 id="clients-title" className="section-title mb-4">
                            Trusted By <span className="text-red">Industry Leaders</span>
                        </h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            A growing network of clients and partners across manufacturing, education, and construction sectors
                        </p>
                    </motion.div>
                </div>

                {/* Marquee rows */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="space-y-4"
                >
                    <MarqueRow items={row1} reverse={false} />
                    <MarqueRow items={row2} reverse={true} />
                </motion.div>

                {/* Client count */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-8 text-center"
                    >
                        <div>
                            <div className="font-rajdhani font-bold text-3xl text-red">18+</div>
                            <div className="font-source text-silver/60 text-sm">Partner Companies</div>
                        </div>
                        <div className="w-px bg-silver/20 hidden sm:block" />
                        <div>
                            <div className="font-rajdhani font-bold text-3xl text-green">6+</div>
                            <div className="font-source text-silver/60 text-sm">Cities Covered</div>
                        </div>
                        <div className="w-px bg-silver/20 hidden sm:block" />
                        <div>
                            <div className="font-rajdhani font-bold text-3xl text-red">100%</div>
                            <div className="font-source text-silver/60 text-sm">Client Satisfaction</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
