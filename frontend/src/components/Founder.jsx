import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Linkedin } from 'lucide-react';
import { COMPANY } from '../data/siteData';

export default function Founder() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="founder" className="relative py-24 overflow-hidden" aria-labelledby="founder-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, #0a0f18 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-orange" />
                        <span className="font-rajdhani text-orange uppercase tracking-widest text-sm font-semibold">Leadership</span>
                        <div className="h-px w-12 bg-orange" />
                    </div>
                    <h2 id="founder-title" className="section-title mb-4">
                        Meet The <span className="text-orange">Founder</span>
                    </h2>
                </motion.div>

                <div className="glass-card overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Left - Avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex flex-col items-center justify-center p-10 relative"
                            style={{ background: 'rgba(30,58,95,0.3)' }}
                        >
                            {/* Blueprint grid bg */}
                            <div className="absolute inset-0 blueprint-bg opacity-30" style={{ backgroundSize: '30px 30px' }} aria-hidden="true" />

                            {/* Avatar */}
                            <div className="relative z-10">
                                <motion.div
                                    animate={{ boxShadow: ['0 0 20px rgba(255,107,43,0.3)', '0 0 40px rgba(255,107,43,0.6)', '0 0 20px rgba(255,107,43,0.3)'] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                    className="w-36 h-36 rounded-full flex items-center justify-center mb-4"
                                    style={{
                                        background: 'linear-gradient(135deg, #1e3a5f, #0f1117)',
                                        border: '3px solid rgba(255,107,43,0.6)',
                                    }}
                                    aria-label="Founder initials avatar"
                                >
                                    <span className="font-rajdhani font-bold text-5xl text-orange">SR</span>
                                </motion.div>

                                <div className="text-center">
                                    <h3 className="font-rajdhani font-bold text-2xl text-offwhite">{COMPANY.founder.name}</h3>
                                    <p className="font-source text-orange text-sm font-semibold mt-1">CEO & Founder</p>
                                    <p className="font-source text-silver/60 text-xs mt-1">{COMPANY.founder.qual}</p>
                                </div>

                                {/* Role progression */}
                                <div className="mt-6 space-y-1">
                                    {COMPANY.founder.roles.map((role, i) => (
                                        <motion.div
                                            key={role}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={inView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.5 + i * 0.08 }}
                                            className="flex items-center gap-2 font-source text-xs"
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: i === COMPANY.founder.roles.length - 1 ? '#ff6b2b' : 'rgba(192,200,216,0.4)' }}
                                                aria-hidden="true"
                                            />
                                            <span style={{ color: i === COMPANY.founder.roles.length - 1 ? '#ff6b2b' : 'rgba(192,200,216,0.6)' }}>
                                                {role}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right - Bio */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="p-8 flex flex-col justify-center gap-6"
                        >
                            <div>
                                <h4 className="font-rajdhani font-bold text-xl text-offwhite mb-3">
                                    About <span className="text-orange">{COMPANY.founder.name}</span>
                                </h4>
                                <p className="font-source text-silver/80 text-sm leading-relaxed mb-3">
                                    An accomplished mechanical engineer and entrepreneur, Sankarganesh R leads Sri Tech Engineering
                                    with a vision to bring world-class precision manufacturing to Namakkal, Tamil Nadu.
                                </p>
                                <p className="font-source text-silver/70 text-sm leading-relaxed">
                                    Holding a B.E in Mechanical Engineering and M.Tech in Energy Technology, he brings a unique
                                    blend of engineering rigor and entrepreneurial drive to every project.
                                </p>
                            </div>

                            {/* Key Achievements */}
                            <div>
                                <h4 className="font-rajdhani font-bold text-lg text-offwhite mb-4">Key Achievements</h4>
                                <ul className="space-y-2.5">
                                    {COMPANY.founder.achievements.map((ach, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={inView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.6 + i * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 size={16} color="#ff6b2b" className="flex-shrink-0 mt-0.5" />
                                            <span className="font-source text-silver/80 text-sm">{ach}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* LinkedIn CTA */}
                            <motion.a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Connect with Sankarganesh R on LinkedIn"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-3 bg-[#0a66c2] hover:bg-[#0952a5] text-white font-rajdhani font-bold px-6 py-3 rounded-lg uppercase tracking-wider text-sm transition-all duration-300 self-start"
                            >
                                <Linkedin size={18} />
                                Connect with Founder
                            </motion.a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
