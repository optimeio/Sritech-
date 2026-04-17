import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/siteData';

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [paused]);

    const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);

    return (
        <section id="testimonials" className="relative py-24 overflow-hidden" aria-labelledby="testimonials-title">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, #0c101a 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-red" />
                        <span className="font-rajdhani text-green uppercase tracking-widest text-sm font-semibold">Client Stories</span>
                        <div className="h-px w-12 bg-red" />
                    </div>
                    <h2 id="testimonials-title" className="section-title mb-4">
                        What Clients <span className="text-red">Say</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div
                        className="glass-card p-8 md:p-12 relative overflow-hidden"
                        style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                        {/* Top red accent */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red to-transparent" aria-hidden="true" />

                        {/* Quote mark */}
                        <div
                            className="absolute top-4 left-6 font-rajdhani font-bold text-8xl leading-none select-none"
                            style={{ color: 'rgba(239, 68, 68, 0.1)' }}
                            aria-hidden="true"
                        >
                            "
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4" aria-label={`Rating: ${TESTIMONIALS[current].rating} out of 5 stars`}>
                                    {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Star size={18} color="#ef4444" fill="#ef4444" />
                                        </motion.div>
                                    ))}
                                </div>

                                <blockquote className="font-source text-silver text-lg md:text-xl leading-relaxed mb-8 italic">
                                    "{TESTIMONIALS[current].quote}"
                                </blockquote>

                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-rajdhani font-bold text-lg text-white flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #ff6b2b, #e55a1f)' }}
                                        aria-hidden="true"
                                    >
                                        {TESTIMONIALS[current].name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-rajdhani font-bold text-offwhite text-lg">
                                            {TESTIMONIALS[current].name}
                                        </div>
                                        <div className="font-source text-green/80 text-sm">
                                            {TESTIMONIALS[current].company}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            aria-label="Previous testimonial"
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-silver/20 text-silver hover:border-green hover:text-green transition-all duration-200"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    aria-selected={current === i}
                                    role="tab"
                                    className="w-2 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        background: current === i ? '#ef4444' : 'rgba(192,200,216,0.3)',
                                        width: current === i ? '24px' : '8px',
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            aria-label="Next testimonial"
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-silver/20 text-silver hover:border-green hover:text-green transition-all duration-200"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
