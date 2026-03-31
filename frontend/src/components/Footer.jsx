import { motion } from 'framer-motion';
import { ArrowUp, Facebook, Instagram, Youtube, Mail, MapPin } from 'lucide-react';
import { COMPANY, GROUP_COMPANIES } from '../data/siteData';

const NAV_COLS = [
    {
        heading: 'Company',
        links: [
            { label: 'About Us', href: '#about' },
            { label: 'Founder Profile', href: '#founder' },
            { label: 'Our Group', href: '#group' },
            { label: 'How We Work', href: '#how-we-work' },
        ],
    },
    {
        heading: 'Services',
        links: [
            { label: 'Agro & Poultry Machinery', href: '#services' },
            { label: 'Food Processing', href: '#services' },
            { label: 'Material Fabrication', href: '#services' },
            { label: 'PEB Structures', href: '#services' },
            { label: '3D Printing & EV Design', href: '#services' },
        ],
    },
    {
        heading: 'Projects',
        links: [
            { label: 'Railways', href: '#projects' },
            { label: 'IOCL Projects', href: '#projects' },
            { label: 'SIDCO PEB', href: '#projects' },
            { label: 'Smart City', href: '#projects' },
            { label: 'Food Machines', href: '#projects' },
        ],
    },
    {
        heading: 'Contact',
        links: [
            { label: 'Get a Quote', href: '#contact' },
            { label: 'Industries We Serve', href: '#industries' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Client Companies', href: '#clients' },
        ],
    },
];

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollTo = (href) => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer
            className="relative overflow-hidden"
            style={{ background: '#080c12' }}
            role="contentinfo"
            aria-label="Sri Tech Engineering footer"
        >
            {/* Blueprint bg */}
            <div className="absolute inset-0 blueprint-bg" style={{ backgroundSize: '50px 50px', opacity: 0.15 }} aria-hidden="true" />
            {/* Top orange line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange to-transparent" aria-hidden="true" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                {/* Main footer grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }} aria-label="Sri Tech Engineering – Home">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={COMPANY.logo}
                                    alt="Sri Tech Engineering logo"
                                    className="h-10 w-auto"
                                    loading="lazy"
                                    style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,107,43,0.7))' }}
                                />
                                <div>
                                    <div className="font-rajdhani font-bold leading-tight" style={{ color: '#f4f6f9' }}>Sri Tech Engineering</div>
                                    <div className="font-source text-xs tracking-widest" style={{ color: '#ff6b2b' }}>Beyond Technology</div>
                                </div>
                            </div>
                        </a>
                        <p className="font-source text-silver/60 text-sm leading-relaxed mb-4 max-w-xs">
                            Precision manufacturing of Agro, Food & Poultry Machineries, Material Fabrication & Engineering Works.
                        </p>
                        <div className="flex items-start gap-2 mb-4">
                            <MapPin size={14} color="rgba(255,107,43,0.7)" className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <address className="font-source text-silver/50 text-xs not-italic leading-relaxed">
                                {COMPANY.address}
                            </address>
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                            <Mail size={14} color="rgba(255,107,43,0.7)" aria-hidden="true" />
                            <a
                                href={`mailto:${COMPANY.email}`}
                                aria-label={`Email us at ${COMPANY.email}`}
                                className="font-source text-silver/60 text-xs hover:text-orange transition-colors"
                            >
                                {COMPANY.email}
                            </a>
                        </div>

                        {/* Social links */}
                        <div className="flex gap-3">
                            {[
                                { Icon: Facebook, label: 'Sri Tech Engineering on Facebook', href: 'https://facebook.com' },
                                { Icon: Instagram, label: 'Sri Tech Engineering on Instagram', href: 'https://instagram.com' },
                                { Icon: Youtube, label: 'Sri Tech Engineering on YouTube', href: 'https://youtube.com' },
                            ].map(({ Icon, label, href }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    whileHover={{ scale: 1.15, color: '#ff6b2b' }}
                                    className="w-9 h-9 rounded-lg border border-silver/15 flex items-center justify-center text-silver/50 hover:border-orange/50 hover:text-orange transition-all duration-200"
                                >
                                    <Icon size={16} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {NAV_COLS.map((col) => (
                        <div key={col.heading}>
                            <h3 className="font-rajdhani font-bold text-offwhite uppercase tracking-wider text-sm mb-4">
                                {col.heading}
                            </h3>
                            <ul className="space-y-2" role="list">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                                            aria-label={link.label}
                                            className="font-source text-silver/50 text-sm hover:text-orange transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Group companies */}
                <div className="border-t border-silver/10 pt-8 mb-8">
                    <h3 className="font-rajdhani font-bold text-silver/50 uppercase tracking-wider text-xs mb-4">
                        Group Companies
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {GROUP_COMPANIES.map((co) => (
                            <span
                                key={co.name}
                                className="font-rajdhani font-semibold text-sm px-3 py-1 rounded-full"
                                style={{
                                    background: `${co.accent}15`,
                                    color: co.accent,
                                    border: `1px solid ${co.accent}30`,
                                }}
                            >
                                {co.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-silver/10 pt-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                        <div>
                            <h3 className="font-rajdhani font-bold text-offwhite text-base mb-1">Stay Updated</h3>
                            <p className="font-source text-silver/50 text-xs">Get engineering insights and project updates</p>
                        </div>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex gap-2 w-full sm:w-auto"
                            aria-label="Newsletter signup"
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email for newsletter"
                                className="flex-1 sm:w-64 bg-[rgba(30,58,95,0.2)] border border-silver/15 rounded-lg px-4 py-2.5 font-source text-sm text-offwhite placeholder-silver/40 focus:outline-none focus:border-orange transition-colors"
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                aria-label="Subscribe to newsletter"
                                className="bg-orange text-white font-rajdhani font-bold px-5 py-2.5 rounded-lg text-sm uppercase tracking-wider hover:shadow-orange-glow transition-all duration-300"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-silver/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-source text-silver/40 text-xs text-center sm:text-left">
                        © {new Date().getFullYear()} Sri Tech Engineering, Namakkal. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                aria-label={item}
                                className="font-source text-silver/40 text-xs hover:text-orange transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Back to Top */}
            <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255,107,43,0.5)' }}
                whileTap={{ scale: 0.9 }}
                aria-label="Back to top"
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg z-40 transition-all duration-300"
            >
                <ArrowUp size={20} color="white" />
            </motion.button>
        </footer>
    );
}
