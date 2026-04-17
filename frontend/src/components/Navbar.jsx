import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { COMPANY } from '../data/siteData';

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Services', href: '#services' },
    { label: 'Products', href: '#products' },
    { label: 'Projects', href: '#projects' },
    { label: 'Industries', href: '#industries' },
    { label: 'Skills', href: '#skills' },
    { label: 'Clients', href: '#clients' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const menuRef = useRef(null);
    const toggleRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    /* ── Track scroll: close menu + highlight active section ── */
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);
        setMobileOpen(false);          // always close on scroll

        if (window.location.pathname !== '/') return;

        const sections = NAV_LINKS.map(l => l.href.slice(1));
        let current = '';
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 100) current = id;
        }
        setActiveSection(current);
    }, []);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => { handleScroll(); ticking = false; });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [handleScroll]);

    /* ── Escape key ── */
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    /* ── Click outside menuRef (not on toggle button) ── */
    useEffect(() => {
        const close = (e) => {
            if (
                mobileOpen &&
                menuRef.current && !menuRef.current.contains(e.target) &&
                toggleRef.current && !toggleRef.current.contains(e.target)
            ) setMobileOpen(false);
        };
        document.addEventListener('mousedown', close);
        document.addEventListener('touchstart', close, { passive: true });
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('touchstart', close);
        };
    }, [mobileOpen]);

    /* ── Body scroll lock ── */
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    /* ── Smooth scroll + close menu ── */
    const scrollTo = (e, href) => {
        e.preventDefault();
        setMobileOpen(false);
        const sectionId = href.startsWith('#') ? href.slice(1) : href;

        if (location.pathname !== '/') {
            // Navigate cleanly to home, passing the section to scroll to secretly in state
            navigate('/', { state: { scrollTo: sectionId } });
            return;
        }

        // Already on home, just scroll smoothly
        setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    };

    const navH = scrolled ? '62px' : '72px';

    return (
        <>
            {/* ══════════ HEADER ══════════ */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(15,17,23,0.96)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(18px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(239, 68, 68, 0.2)' : 'none',
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
                }}
            >
                <nav
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
                    style={{ height: navH, transition: 'height 0.3s ease' }}
                    aria-label="Main navigation"
                >
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => scrollTo(e, '#hero')}
                        aria-label="Sri Tech Engineering – Home"
                        style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}
                    >
                        <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-2 sm:gap-3">
                            <div className="relative flex-shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full blur-md opacity-60"
                                    style={{ background: 'rgba(239, 68, 68, 0.4)' }}
                                    aria-hidden="true"
                                />
                                <img
                                    src={COMPANY.logo}
                                    alt="Sri Tech Engineering logo"
                                    className="relative h-9 w-auto object-contain"
                                    loading="eager"
                                    style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(34, 197, 94, 0.9))' }}
                                />
                            </div>
                            {/* Full name on ≥sm */}
                            <div className="hidden sm:block">
                                <div className="font-rajdhani font-bold text-base text-offwhite leading-tight">Sri Tech Engineering</div>
                                <div className="text-red text-xs font-source tracking-widest uppercase">Beyond Technology</div>
                            </div>
                            {/* Short name on xs */}
                            <div className="block sm:hidden">
                                <div className="font-rajdhani font-bold text-sm text-offwhite leading-tight">Sri Tech</div>
                                <div className="font-source uppercase" style={{ fontSize: 9, color: '#22c55e', letterSpacing: '0.1em' }}>Engineering</div>
                            </div>
                        </motion.div>
                    </a>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex items-center gap-1" role="list">
                        {NAV_LINKS.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={(e) => scrollTo(e, link.href)}
                                    aria-label={`Navigate to ${link.label}`}
                                    aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                                    className="relative px-3 py-2 font-rajdhani font-semibold text-sm uppercase tracking-wider transition-colors duration-200 group"
                                    style={{ color: activeSection === link.href.slice(1) ? '#ef4444' : '#c0c8d8' }}
                                >
                                    {link.label}
                                    <span
                                        className="absolute bottom-0 left-0 h-0.5 bg-red transition-all duration-300"
                                        style={{ width: activeSection === link.href.slice(1) ? '100%' : '0%' }}
                                    />
                                    <span className="absolute bottom-0 left-0 h-0.5 bg-red w-0 group-hover:w-full transition-all duration-300" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA + Hamburger */}
                    <div className="flex items-center gap-2">
                        <motion.a
                            href="#contact"
                            onClick={(e) => scrollTo(e, '#contact')}
                            aria-label="Get a Quote"
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:inline-flex items-center gap-2 text-white font-rajdhani font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #ff6b2b)' }}
                        >
                            Get a Quote
                        </motion.a>

                        {/* Hamburger button */}
                        <button
                            ref={toggleRef}
                            className="lg:hidden flex items-center justify-center rounded-lg transition-all duration-200"
                            style={{
                                width: 44, height: 44,
                                background: mobileOpen ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
                                border: mobileOpen ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid transparent',
                                color: mobileOpen ? '#ef4444' : '#c0c8d8',
                            }}
                            onClick={() => setMobileOpen(prev => !prev)}
                            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen
                                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}><X size={22} /></motion.span>
                                    : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}><Menu size={22} /></motion.span>
                                }
                            </AnimatePresence>
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* ══════════ BACKDROP ══════════
                z-index 48 → above page content (z-auto) but below header (z-50) and menu panel (z-49).
                Clicking/tapping the backdrop closes the menu.                             */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 lg:hidden"
                        style={{ zIndex: 48, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
                        onClick={() => setMobileOpen(false)}
                        onTouchStart={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* ══════════ MOBILE MENU PANEL ══════════
                z-49: above backdrop (48) but rendered separately from header (z-50).
                Positioned fixed, top = navbar height, full width.                        */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-nav"
                        ref={menuRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="fixed left-0 right-0 lg:hidden"
                        style={{
                            top: navH,
                            zIndex: 49,
                            background: '#0a0c12',
                            borderBottom: '2px solid rgba(239, 68, 68, 0.2)',
                            boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
                        }}
                    >
                        <ul className="px-4 py-3 space-y-0.5" role="list">
                            {NAV_LINKS.map((link, i) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.04, duration: 0.18 }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={(e) => scrollTo(e, link.href)}
                                        aria-label={`Navigate to ${link.label}`}
                                        className="flex items-center px-4 font-rajdhani font-bold text-base uppercase tracking-wider rounded-xl transition-all duration-200"
                                        style={{
                                            height: 48,
                                            color: activeSection === link.href.slice(1) ? '#ef4444' : '#c0c8d8',
                                            background: activeSection === link.href.slice(1) ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                                            borderLeft: activeSection === link.href.slice(1) ? '3px solid #ef4444' : '3px solid transparent',
                                        }}
                                    >
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}

                            {/* Get a Quote */}
                            <motion.li
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: NAV_LINKS.length * 0.04 + 0.04 }}
                            >
                                <a
                                    href="#contact"
                                    onClick={(e) => scrollTo(e, '#contact')}
                                    aria-label="Get a Quote"
                                    className="flex items-center justify-center mt-2 text-white font-rajdhani font-bold rounded-xl uppercase tracking-wider text-sm transition-all duration-200 active:scale-95 shadow-lg"
                                    style={{ height: 48, background: 'linear-gradient(135deg, #ef4444, #ff6b2b)', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)' }}
                                >
                                    Get a Quote →
                                </a>
                            </motion.li>
                        </ul>

                        {/* Footer info strip */}
                        <div
                            className="px-6 py-2.5 flex items-center justify-between flex-wrap gap-1"
                            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
                        >
                            <span className="font-source text-xs" style={{ color: 'rgba(192,200,216,0.35)' }}>Namakkal, Tamil Nadu</span>
                            <span className="font-source text-xs" style={{ color: 'rgba(34, 197, 94, 0.5)' }}>sritechengineering8@gmail.com</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
