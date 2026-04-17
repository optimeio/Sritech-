import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Linkedin, Quote } from 'lucide-react';
import { COMPANY } from '../data/siteData';

// Import images
import sankarganesh from '../assets/sankarganesh.png';
import ganga from '../assets/ganga.jpg';

const IMAGES = {
    'sankarganesh.png': sankarganesh,
    'ganga.jpg': ganga,
};

export default function Leadership() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <section id="leadership" className="relative py-24 overflow-hidden" aria-labelledby="leadership-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(20,15,10,0.85) 50%, #0f1117 100%)' }}
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
                        <div className="h-px w-12 bg-red" />
                        <span className="font-rajdhani text-green uppercase tracking-widest text-sm font-semibold">Leadership</span>
                        <div className="h-px w-12 bg-red" />
                    </div>
                    <h2 id="leadership-title" className="section-title mb-4">
                        Meet Our <span className="text-red">Visionaries</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-silver/90 font-source text-sm sm:text-base leading-relaxed">
                        The strategic leadership driving Sri Tech Engineering's commitment to industrial innovation, precision manufacturing, and corporate excellence across Tamil Nadu.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {COMPANY.leadership.map((member, idx) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="glass-card overflow-hidden flex flex-col h-full"
                        >
                            <div className="grid sm:grid-cols-5 h-full">
                                {/* Left - Avatar Info */}
                                <div
                                    className="sm:col-span-2 flex flex-col items-center justify-center p-8 relative border-b sm:border-b-0 sm:border-r border-white/5"
                                    style={{ background: 'rgba(239, 68, 68, 0.08)' }}
                                >
                                    <div className="absolute inset-0 blueprint-bg opacity-20" style={{ backgroundSize: '30px 30px' }} aria-hidden="true" />

                                    <div className="relative z-10 text-center">
                                        <motion.div
                                            animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.1)', '0 0 40px rgba(239,68,68,0.4)', '0 0 20px rgba(239,68,68,0.1)'] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-2 border-red mx-auto group shadow-2xl shadow-red/20"
                                        >
                                            <img
                                                src={IMAGES[member.image]}
                                                alt={`${member.name} - ${member.role} at Sri Tech Engineering Namakkal - Precision Manufacturing Expert`}
                                                className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </motion.div>

                                        <h3 className="font-rajdhani font-bold text-xl text-offwhite leading-tight">{member.name}</h3>
                                        <p className="font-source text-green text-sm font-bold mt-1 uppercase tracking-wider">{member.role}</p>
                                        <p className="font-source text-silver/90 text-xs mt-2 italic font-medium">{member.qual}</p>

                                        <div className="mt-8 space-y-2 inline-block text-left">
                                            {member.roles.map((role, i) => (
                                                <div key={role} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-green/40" />
                                                    <span className="text-[10px] uppercase tracking-tighter text-silver/70 font-source font-bold">{role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Details */}
                                <div className="sm:col-span-3 p-8 flex flex-col">
                                    {member.vision && (
                                        <div className="mb-6 bg-white/5 p-4 rounded-xl border-l-4 border-green relative">
                                            <Quote size={20} className="absolute -top-2 -right-2 text-green/20" />
                                            <p className="text-[10px] uppercase font-bold text-green tracking-widest mb-1">Vision</p>
                                            <p className="font-rajdhani font-bold text-base text-white italic leading-tight">"{member.vision}"</p>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h4 className="font-rajdhani font-bold text-lg text-offwhite mb-3">Professional Bio</h4>
                                        <p className="font-source text-white/90 text-sm sm:text-base leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>

                                    <div className="flex-grow">
                                        <h4 className="font-rajdhani font-bold text-base text-offwhite mb-4">Core Focus</h4>
                                        <ul className="space-y-3">
                                            {member.achievements.map((ach, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 size={14} className="text-red flex-shrink-0 mt-1" />
                                                    <span className="font-source text-silver/90 text-xs sm:text-sm font-medium">{ach}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <motion.a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-2 text-[#0a66c2] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            <Linkedin size={16} />
                                            <span>LinkedIn Profile</span>
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
