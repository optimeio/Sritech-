import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Phone } from 'lucide-react';
import { apiFetch } from '../utils/api';

// Fixed design – only content changes from admin
export default function ProductBanner() {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/banner')
            .then(d => setBanner(d.banner))
            .catch(() => setBanner({
                title: '🔥 Mega Offer on Civil Products',
                subtitle: 'High Quality Engineering Solutions for Modern Construction',
                buttonText: 'Enquire Now',
                buttonLink: 'https://wa.me/919043340278',
                tag: 'Limited Offer',
                isActive: true,
            }))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !banner || !banner.isActive) return null;

    return (
        <section
            id="product-banner"
            aria-label="Featured product offer banner"
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ff6b2b 0%, #ff8c5a 35%, #e84a0a 60%, #bc3908 100%)',
                padding: '0',
            }}
        >
            {/* Animated glow orbs */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '-60px', left: '-60px',
                    width: 300, height: 300,
                    background: 'radial-gradient(circle, rgba(255,200,0,0.18) 0%, transparent 70%)',
                    animation: 'pulse-glow 3s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-40px', right: '-40px',
                    width: 250, height: 250,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    animation: 'pulse-glow 4s ease-in-out infinite 1.5s',
                }} />
                {/* Diagonal stripes */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 40px)',
                }} />
                {/* Top and bottom borders */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fcd34d, #f59e0b, #fbbf24)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fcd34d, #f59e0b, #fbbf24)', backgroundSize: '200% 100%', animation: 'shimmer 2s linear infinite reverse' }} />
            </div>

            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes shimmer {
                    0% { background-position: 0% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes banner-slide-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes tag-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.5); }
                    50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
                }
            `}</style>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '24px 20px', textAlign: 'center', animation: 'banner-slide-in 0.6s ease-out' }}>
                {/* Tag */}
                <AnimatePresence>
                    {banner.tag && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                display: 'inline-block',
                                background: 'rgba(251,191,36,0.2)',
                                border: '1.5px solid #fbbf24',
                                color: '#fcd34d',
                                padding: '4px 18px',
                                borderRadius: 100,
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                marginBottom: 10,
                                animation: 'tag-pulse 2s infinite',
                            }}
                        >
                            ⚡ {banner.tag}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: 'clamp(1.5rem, 4.5vw, 2.75rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: 8,
                        lineHeight: 1.15,
                        textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                        letterSpacing: '0.02em',
                    }}
                >
                    {banner.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        marginBottom: 20,
                        maxWidth: 600,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: 1.6,
                        fontFamily: 'Source Sans 3, sans-serif',
                    }}
                >
                    {banner.subtitle}
                </motion.p>

                {/* CTA Button */}
                <motion.a
                    href={banner.buttonLink}
                    target={banner.buttonLink?.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        background: 'linear-gradient(135deg, #ff8c5a, #ff6b2b)',
                        color: '#1a0000',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                        padding: '12px 28px',
                        borderRadius: 50,
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        boxShadow: '0 4px 24px rgba(255,107,43,0.5)',
                        transition: 'all 0.2s',
                    }}
                    aria-label={banner.buttonText}
                >
                    <Phone size={18} />
                    {banner.buttonText}
                </motion.a>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 12, fontFamily: 'Source Sans 3, sans-serif' }}
                >
                    <Zap size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    🚨 Limited Offer – First 50 Clients Only
                </motion.p>
            </div>
        </section>
    );
}
