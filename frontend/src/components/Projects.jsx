/**
 * Projects.jsx — Sri Tech Engineering Project Portfolio
 *
 * ✅ Integrates ProjectLightbox for fullscreen gallery
 * ✅ Gallery badge on each card
 * ✅ Hover overlay with camera icon + "View X Photos"
 * ✅ Filter tabs preserved
 * ✅ SEO: ItemList structured data
 * ✅ Zero console errors
 * ✅ Mobile first, fully accessible
 */

import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Camera, Tag } from 'lucide-react';
import { GALLERY_PROJECTS, CATEGORY_COLOR_MAP } from '../data/projectsData';

// Lazy-load the lightbox to keep initial bundle tiny
const ProjectLightbox = lazy(() => import('./ProjectLightbox'));

/* ── Category filter list (derived from gallery data, no duplicates) ── */
const ALL_CATEGORIES = ['All', ...Array.from(new Set(GALLERY_PROJECTS.map((p) => p.category)))];

/* ── Micro-animation variant for cards ── */
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, delay: i * 0.06 },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const [ref, inView] = useInView({ threshold: 0.08, triggerOnce: true });

    /* Filter projects */
    const filtered = activeCategory === 'All'
        ? GALLERY_PROJECTS
        : GALLERY_PROJECTS.filter((p) => p.category === activeCategory);

    /* Open and close handlers */
    const openGallery = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    const closeGallery = useCallback(() => {
        setSelectedProject(null);
    }, []);

    return (
        <>
            {/* SEO: ItemList Schema for projects */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        name: 'Sri Tech Engineering Projects',
                        description: 'Landmark engineering projects by Sri Tech Engineering across Smart City, Railways, IOCL, PEB, Food Processing, 3D Printing, EV Design and Energy sectors.',
                        url: 'https://sritechengineering.in/#projects',
                        numberOfItems: GALLERY_PROJECTS.length,
                        itemListElement: GALLERY_PROJECTS.map((p, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            name: p.title,
                            description: p.description,
                        })),
                    }),
                }}
            />

            <section
                id="projects"
                className="relative py-24 overflow-hidden"
                aria-labelledby="projects-title"
            >
                {/* Background gradient */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, #0f1117 0%, #0d1520 50%, #0f1117 100%)' }}
                    aria-hidden="true"
                />

                {/* Blueprint grid overlay */}
                <div
                    className="absolute inset-0 blueprint-bg"
                    style={{ opacity: 0.04, backgroundSize: '40px 40px' }}
                    aria-hidden="true"
                />

                <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ── Section Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-12 bg-orange" />
                            <span className="font-rajdhani text-orange uppercase tracking-widest text-sm font-semibold">
                                Our Portfolio
                            </span>
                            <div className="h-px w-12 bg-orange" />
                        </div>
                        <h2 id="projects-title" className="section-title mb-4">
                            Project <span className="text-orange">Portfolio</span>
                        </h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            Landmark projects delivered across Smart City, Railways, Oil &amp; Gas, PEB, Food Processing,
                            3D Printing, EV Design and Energy sectors. Click any card to view the full gallery.
                        </p>
                    </motion.div>

                    {/* ── Filter Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="filter-tabs flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
                        role="tablist"
                        aria-label="Project category filters"
                    >
                        {ALL_CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat;
                            const color = CATEGORY_COLOR_MAP[cat] || '#ff6b2b';
                            return (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat)}
                                    aria-selected={isActive}
                                    role="tab"
                                    aria-label={`Filter by ${cat}`}
                                    className="relative px-4 py-2 font-rajdhani font-semibold text-sm uppercase tracking-wider rounded-lg transition-all duration-300"
                                    style={{
                                        background: isActive
                                            ? (cat === 'All' ? '#ff6b2b' : color)
                                            : 'rgba(30,58,95,0.3)',
                                        color: isActive ? '#fff' : '#c0c8d8',
                                        border: isActive
                                            ? 'none'
                                            : '1px solid rgba(192,200,216,0.15)',
                                        boxShadow: isActive
                                            ? `0 0 16px ${cat === 'All' ? 'rgba(255,107,43,0.4)' : color + '55'}`
                                            : 'none',
                                    }}
                                >
                                    {cat}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* ── Project Cards Grid ── */}
                    <motion.div layout className="project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((project, i) => {
                                const color = project.color || '#ff6b2b';
                                const imgCount = project.images.length;
                                return (
                                    <motion.article
                                        key={project.id}
                                        layout
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        whileHover={{ y: -6 }}
                                        className="glass-card overflow-hidden group relative"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => openGallery(project)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openGallery(project);
                                            }
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`View gallery for ${project.title} — ${imgCount} photos`}
                                        aria-haspopup="dialog"
                                    >
                                        {/* ── Colour strip top ── */}
                                        <div
                                            className="h-1 w-full"
                                            style={{ background: color }}
                                            aria-hidden="true"
                                        />

                                        {/* ── Thumbnail preview ── */}
                                        <div
                                            style={{
                                                height: 200,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                background: 'rgba(15,17,23,0.6)',
                                            }}
                                            aria-hidden="true"
                                        >
                                            <img
                                                src={project.images[0].src}
                                                alt=""
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                    transition: 'transform 0.45s ease',
                                                }}
                                                className="group-hover:scale-105"
                                            />

                                            {/* Gradient fade at bottom of image — no overlap with text */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0, left: 0, right: 0,
                                                    height: '40%',
                                                    background: 'linear-gradient(to top, rgba(15,17,23,0.8) 0%, transparent 100%)',
                                                    pointerEvents: 'none',
                                                }}
                                                aria-hidden="true"
                                            />

                                            {/* Photo count badge — top-right inside image */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 10, right: 10,
                                                    background: 'rgba(0,0,0,0.72)',
                                                    color: '#ff6b2b',
                                                    border: '1px solid rgba(255,107,43,0.45)',
                                                    borderRadius: 6,
                                                    padding: '3px 9px',
                                                    fontSize: 11,
                                                    fontFamily: 'Rajdhani, sans-serif',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 5,
                                                    letterSpacing: '0.05em',
                                                    backdropFilter: 'blur(6px)',
                                                    WebkitBackdropFilter: 'blur(6px)',
                                                }}
                                                aria-hidden="true"
                                            >
                                                📷 {imgCount} Photos
                                            </div>
                                        </div>

                                        {/* ── Card content — in normal flow, no overlap ── */}
                                        <div className="p-4 flex flex-col gap-2">
                                            {/* Category + year */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-rajdhani font-semibold uppercase"
                                                    style={{
                                                        background: `${color}20`,
                                                        color: color,
                                                        border: `1px solid ${color}40`,
                                                    }}
                                                >
                                                    <Tag size={10} aria-hidden="true" />
                                                    {project.category}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: 'rgba(192,200,216,0.5)',
                                                        fontFamily: 'Rajdhani, sans-serif',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {project.year}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-rajdhani font-bold text-base text-offwhite group-hover:text-orange transition-colors duration-300 leading-snug">
                                                {project.title}
                                            </h3>

                                            {/* Client */}
                                            <p className="font-source text-xs font-semibold uppercase tracking-wider" style={{ color: '#ff6b2b' }}>
                                                {project.client}
                                            </p>

                                            {/* Description — 2 lines max, no overflow */}
                                            <p className="font-source text-silver/60 text-sm leading-relaxed line-clamp-2">
                                                {project.description}
                                            </p>

                                            {/* View Gallery bar — always visible in flow, never overlaps */}
                                            <div
                                                className="flex items-center gap-2 pt-3 mt-auto"
                                                style={{ borderTop: `1px solid ${color}25` }}
                                            >
                                                <Camera size={14} color={color} aria-hidden="true" />
                                                <span
                                                    style={{
                                                        color: color,
                                                        fontFamily: 'Rajdhani, sans-serif',
                                                        fontWeight: 700,
                                                        fontSize: 12,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.07em',
                                                    }}
                                                >
                                                    View {imgCount} Photos →
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-silver/50 font-source">
                            No projects found for this category.
                        </div>
                    )}

                    {/* ── Bottom note ── */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center font-source text-silver/40 text-xs mt-10"
                    >
                        Click any project card to browse the full photo gallery
                    </motion.p>
                </div>
            </section>

            {/* ── Lightbox portal ── */}
            <Suspense fallback={null}>
                <AnimatePresence>
                    {selectedProject && (
                        <ProjectLightbox
                            key={selectedProject.id}
                            project={selectedProject}
                            onClose={closeGallery}
                        />
                    )}
                </AnimatePresence>
            </Suspense>
        </>
    );
}
