import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SKILLS, SOFTWARE, TECH_TAGS } from '../data/siteData';

function SkillBar({ skill, animate }) {
    const barRef = useRef(null);
    useEffect(() => {
        if (barRef.current) {
            barRef.current.style.width = animate ? `${skill.percent}%` : '0%';
        }
    }, [animate, skill.percent]);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="font-rajdhani font-semibold text-sm" style={{ color: '#f4f6f9' }}>{skill.name}</span>
                <span className="font-rajdhani font-bold text-sm" style={{ color: '#22c55e' }}>{skill.percent}%</span>
            </div>
            <div className="skill-bar">
                <div
                    ref={barRef}
                    className="skill-bar-fill"
                    style={{ width: '0%' }}
                    role="progressbar"
                    aria-valuenow={skill.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${skill.name}: ${skill.percent}%`}
                />
            </div>
        </div>
    );
}

const SW_COLORS = ['#ef4444', '#22c55e', '#ef4444', '#22c55e', '#333333', '#444444'];

export default function Skills() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="skills" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="skills-title">
            <div className="absolute inset-0 blueprint-bg" style={{ opacity: 0.3 }} aria-hidden="true" />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.92) 50%, #0f1117 100%)' }}
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
                            Capabilities
                        </span>
                        <div className="h-px w-10" style={{ background: '#ef4444' }} />
                    </div>
                    <h2 id="skills-title" className="section-title mb-3">
                        Skills &amp; <span style={{ color: '#ef4444' }}>Capabilities</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Deep domain expertise backed by industry-leading software tools
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Skill Bars */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="rounded-2xl p-6 md:p-8 space-y-6"
                        style={{
                            background: 'rgba(26,26,26,0.6)',
                            border: '1px solid rgba(255,107,43,0.12)',
                            backdropFilter: 'blur(14px)',
                        }}
                    >
                        <h3 className="font-rajdhani font-bold text-2xl" style={{ color: '#f4f6f9' }}>
                            Domain <span style={{ color: '#22c55e' }}>Expertise</span>
                        </h3>
                        {SKILLS.map((skill) => (
                            <SkillBar key={skill.name} skill={skill} animate={inView} />
                        ))}
                    </motion.div>

                    {/* Software + Tags */}
                    <div className="space-y-5">
                        {/* Software Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="rounded-2xl p-6 md:p-8"
                            style={{
                                background: 'rgba(26,26,26,0.6)',
                                border: '1px solid rgba(255,107,43,0.12)',
                                backdropFilter: 'blur(14px)',
                            }}
                        >
                            <h3 className="font-rajdhani font-bold text-2xl mb-5" style={{ color: '#f4f6f9' }}>
                                Software <span style={{ color: '#ef4444' }}>Proficiency</span>
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                {SOFTWARE.map((sw, i) => (
                                    <motion.div
                                        key={sw}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.35, delay: 0.35 + i * 0.045 }}
                                        whileHover={{ scale: 1.1, boxShadow: '0 0 16px rgba(255,107,43,0.4)' }}
                                        className="flex items-center justify-center py-2 px-1 rounded-lg text-center font-rajdhani font-semibold text-xs cursor-default transition-all duration-200"
                                        style={{
                                            background: `${SW_COLORS[i % SW_COLORS.length]}22`,
                                            border: `1px solid ${SW_COLORS[i % SW_COLORS.length]}44`,
                                            color: '#c0c8d8',
                                        }}
                                        aria-label={`Software: ${sw}`}
                                    >
                                        {sw}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tech tags */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="rounded-2xl p-6 md:p-8"
                            style={{
                                background: 'rgba(26,26,26,0.6)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(14px)',
                            }}
                        >
                            <h3 className="font-rajdhani font-bold text-2xl mb-5" style={{ color: '#f4f6f9' }}>
                                Technical <span style={{ color: '#22c55e' }}>Skills</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {TECH_TAGS.map((tag, i) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
                                        whileHover={{ scale: 1.08 }}
                                        className="px-3 py-1.5 rounded-full font-source text-xs font-medium cursor-default"
                                        style={{
                                            background: i % 2 === 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                            color: i % 2 === 0 ? '#ef4444' : '#22c55e',
                                            border: `1px solid ${i % 2 === 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                                        }}
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
