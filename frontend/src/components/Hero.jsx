import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cog, Wrench, Cpu, Zap } from 'lucide-react';

const STATS = [
    { value: 10, suffix: '+', label: 'Years Experience' },
    { value: 500, suffix: '+', label: 'Projects Delivered' },
    { value: 20, suffix: '+', label: 'Industry Clients' },
    { value: 2, suffix: '', label: 'Manufacturing Units' },
];

/* ─── Count-up hook ─── */
function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / duration, 1);
            setCount(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatItem({ stat, start }) {
    const count = useCountUp(stat.value, 2000, start);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center px-4 py-3 rounded-xl"
            style={{ background: 'rgba(30,58,95,0.25)', border: '1px solid rgba(255,107,43,0.2)' }}
        >
            <div className="font-rajdhani font-bold text-3xl md:text-4xl" style={{ color: '#ff6b2b' }}>
                {count}{stat.suffix}
            </div>
            <div className="font-source text-xs mt-0.5 uppercase tracking-wider" style={{ color: 'rgba(192,200,216,0.8)' }}>
                {stat.label}
            </div>
        </motion.div>
    );
}

/* ─── Animated blueprint + particle canvas ─── */
function HeroCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let offset = 0;

        const PARTICLES = Array.from({ length: 55 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.0006,
            vy: (Math.random() - 0.5) * 0.0006,
        }));

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();

        const draw = () => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            /* Blueprint grid */
            const gs = 50;
            const off = offset % gs;
            ctx.strokeStyle = 'rgba(30,58,95,0.6)';
            ctx.lineWidth = 0.7;
            for (let x = -gs + off; x < W + gs; x += gs) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = -gs + off; y < H + gs; y += gs) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            /* Glowing orange cross-dots at grid intersections */
            for (let x = -gs + off; x < W + gs; x += gs) {
                for (let y = -gs + off; y < H + gs; y += gs) {
                    const grd = ctx.createRadialGradient(x, y, 0, x, y, 4);
                    grd.addColorStop(0, 'rgba(255,107,43,0.5)');
                    grd.addColorStop(1, 'transparent');
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            /* Move & draw particles */
            PARTICLES.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
                if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
                const grd = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, p.r * 3);
                grd.addColorStop(0, 'rgba(255,107,43,0.9)');
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(p.x * W, p.y * H, p.r * 2, 0, Math.PI * 2);
                ctx.fill();
            });

            /* Particle connection lines */
            ctx.strokeStyle = 'rgba(30,58,95,0.35)';
            ctx.lineWidth = 0.6;
            for (let i = 0; i < PARTICLES.length; i++) {
                for (let j = i + 1; j < PARTICLES.length; j++) {
                    const dx = (PARTICLES[i].x - PARTICLES[j].x) * W;
                    const dy = (PARTICLES[i].y - PARTICLES[j].y) * H;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        ctx.globalAlpha = 1 - dist / 160;
                        ctx.beginPath();
                        ctx.moveTo(PARTICLES[i].x * W, PARTICLES[i].y * H);
                        ctx.lineTo(PARTICLES[j].x * W, PARTICLES[j].y * H);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            /* Orange circuit traces — horizontal & vertical lines */
            ctx.strokeStyle = 'rgba(255,107,43,0.12)';
            ctx.lineWidth = 1;
            [H * 0.3, H * 0.6, H * 0.8].forEach(y => {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            });
            [W * 0.2, W * 0.75].forEach(x => {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            });

            offset += 0.25;
            animId = requestAnimationFrame(draw);
        };
        draw();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        return () => { cancelAnimationFrame(animId); ro.disconnect(); };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        />
    );
}

const FLOATING = [
    { Icon: Cog, x: '8%', y: '18%', size: 40, dur: 8, delay: 0 },
    { Icon: Wrench, x: '88%', y: '14%', size: 34, dur: 7, delay: 1.2 },
    { Icon: Cpu, x: '80%', y: '62%', size: 42, dur: 9, delay: 0.6 },
    { Icon: Zap, x: '10%', y: '68%', size: 36, dur: 7.5, delay: 2 },
    { Icon: Cog, x: '50%', y: '85%', size: 28, dur: 10, delay: 1.5 },
];

const words = ['Engineering', 'Excellence,', 'Built', 'to', 'Last'];

export default function Hero() {
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
            { threshold: 0.2 }
        );
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const scrollTo = (href) => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            className="relative flex flex-col justify-center overflow-hidden"
            style={{ minHeight: '100vh' }}
            aria-label="Hero section"
        >
            {/* Animated canvas background */}
            <HeroCanvas />

            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(135deg, rgba(15,17,23,0.96) 0%, rgba(18,37,63,0.55) 45%, rgba(15,17,23,0.94) 100%)',
                }}
                aria-hidden="true"
            />

            {/* Bottom orange line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #ff6b2b, transparent)' }}
                aria-hidden="true"
            />

            {/* Top left corner accent */}
            <div
                className="absolute top-20 left-0 w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(30,58,95,0.35) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />
            {/* Bottom right accent */}
            <div
                className="absolute bottom-10 right-0 w-96 h-96 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(255,107,43,0.12) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            {/* Floating gear/tool icons */}
            {FLOATING.map(({ Icon, x, y, size, dur, delay }, i) => (
                <motion.div
                    key={i}
                    className="absolute hidden lg:flex items-center justify-center"
                    style={{ left: x, top: y }}
                    animate={{ y: [0, -22, 0], rotate: [0, 12, -8, 0], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                >
                    <div
                        className="p-3 rounded-xl"
                        style={{
                            background: 'rgba(30,58,95,0.4)',
                            border: '1px solid rgba(255,107,43,0.25)',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <Icon size={size} color="#ff6b2b" strokeWidth={1.2} />
                    </div>
                </motion.div>
            ))}

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-20">
                <div className="max-w-4xl">
                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="h-px w-14" style={{ background: '#ff6b2b' }} />
                        <span
                            className="font-rajdhani font-bold text-sm uppercase tracking-widest"
                            style={{ color: '#ff6b2b' }}
                        >
                            Precision Engineering — Namakkal, Tamil Nadu
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <h1 className="font-rajdhani font-bold leading-tight mb-4 sm:mb-6"
                        style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}
                    >
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                                className="inline-block mr-4"
                                style={{
                                    color: i >= 3 ? '#ff6b2b' : '#f4f6f9',
                                    textShadow: i >= 3 ? '0 0 40px rgba(255,107,43,0.6)' : 'none',
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    {/* Sub */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="font-source text-lg md:text-xl leading-relaxed mb-2 max-w-2xl"
                        style={{ color: '#c0c8d8' }}
                    >
                        Manufacturing of Agro, Food &amp; Poultry Machineries | Material Fabrication | Engineering Works
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="font-source text-xs uppercase tracking-widest mb-10"
                        style={{ color: 'rgba(192,200,216,0.55)' }}
                    >
                        Athanoor &amp; Vaiyappamalai Units • Namakkal, Tamil Nadu
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.3 }}
                        className="flex flex-wrap gap-3 mb-8 sm:mb-14"
                    >
                        <motion.button
                            whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(255,107,43,0.55)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollTo('#projects')}
                            aria-label="Explore Our Work"
                            className="font-rajdhani font-bold text-base uppercase tracking-wider px-8 py-4 rounded-xl text-white transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #ff6b2b, #e55020)', boxShadow: '0 4px 20px rgba(255,107,43,0.35)' }}
                        >
                            Explore Our Work
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.06, borderColor: '#ff6b2b', color: '#ff6b2b' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollTo('#contact')}
                            aria-label="Contact Us"
                            className="font-rajdhani font-bold text-base uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300"
                            style={{
                                border: '2px solid rgba(192,200,216,0.35)',
                                color: '#c0c8d8',
                                background: 'rgba(30,58,95,0.2)',
                            }}
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <div ref={statsRef}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                            {STATS.map((stat, i) => (
                                <StatItem key={i} stat={stat} start={statsVisible} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                onClick={() => scrollTo('#about')}
                aria-label="Scroll down to About section"
            >
                <span className="font-source text-xs uppercase tracking-widest" style={{ color: 'rgba(192,200,216,0.4)' }}>Scroll</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <ChevronDown size={26} color="rgba(255,107,43,0.8)" />
                </motion.div>
            </motion.button>
        </section>
    );
}
