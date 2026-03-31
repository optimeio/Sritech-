/**
 * ProjectLightbox.jsx — Full-screen gallery lightbox for Sri Tech Engineering
 *
 * Features:
 * ✅ Fullscreen dark overlay with blur backdrop
 * ✅ Framer Motion open/close spring animation
 * ✅ Escape key closes lightbox
 * ✅ Body scroll lock restored on unmount
 * ✅ Left/Right keyboard arrow navigation
 * ✅ Swipe gesture support (mobile touch)
 * ✅ Crossfade image transitions
 * ✅ Thumbnail strip with active orange glow
 * ✅ Auto-scroll thumbnail to keep active visible
 * ✅ Image loading skeleton
 * ✅ ARIA: role=dialog, aria-modal, focus trap
 * ✅ Zero console errors — all listeners cleaned up
 * ✅ React.memo on thumbnail strip
 */

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

/* ─── Thumbnail strip — memoised to prevent re-renders ─── */
const ThumbnailStrip = memo(function ThumbnailStrip({
    images,
    activeIndex,
    onSelect,
}) {
    const stripRef = useRef(null);
    const activeRef = useRef(null);

    /* Auto-scroll: keep active thumb visible */
    useEffect(() => {
        if (activeRef.current && stripRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeIndex]);

    return (
        <div
            ref={stripRef}
            className="thumb-strip"
            style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                overflowY: 'visible',
                padding: '6px 4px 8px',   /* vertical padding so glow/border doesn't clip */
                scrollbarWidth: 'thin',
                scrollbarColor: '#ff6b2b #1e3a5f',
            }}
            role="listbox"
            aria-label="Image thumbnails"
        >
            {images.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                    <button
                        key={idx}
                        ref={isActive ? activeRef : null}
                        onClick={() => onSelect(idx)}
                        role="option"
                        aria-selected={isActive}
                        aria-label={`View image ${idx + 1}: ${img.alt}`}
                        style={{
                            flexShrink: 0,
                            width: 76,
                            height: 54,
                            borderRadius: 8,
                            overflow: 'hidden',
                            padding: 0,
                            border: isActive
                                ? '2px solid #ff6b2b'
                                : '2px solid rgba(192,200,216,0.12)',
                            boxShadow: isActive ? '0 0 10px rgba(255,107,43,0.5)' : 'none',
                            /* NO scale transform — avoids overlapping neighbours */
                            transition: 'border 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer',
                            background: '#111825',
                            outline: 'none',
                        }}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                opacity: isActive ? 1 : 0.55,
                                transition: 'opacity 0.2s ease',
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
});

/* ─── Loading skeleton ─── */
function ImageSkeleton() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(30,58,95,0.15)',
                borderRadius: 12,
            }}
            aria-hidden="true"
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,107,43,0.3)',
                    borderTopColor: '#ff6b2b',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
        </div>
    );
}

/* ─── Main Lightbox component ─── */
export default function ProjectLightbox({ project, onClose }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [direction, setDirection] = useState(1); // 1=next, -1=prev
    const lightboxRef = useRef(null);
    const closeButtonRef = useRef(null);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const images = project?.images ?? [];
    const total = images.length;

    /* Bounds-safe image accessor */
    const safeIndex = useCallback(
        (idx) => Math.max(0, Math.min(idx, total - 1)),
        [total]
    );

    const goTo = useCallback(
        (idx, dir = 1) => {
            const next = safeIndex(idx);
            if (next === activeIndex) return;
            setDirection(dir);
            setImgLoaded(false);
            setActiveIndex(next);
        },
        [activeIndex, safeIndex]
    );

    const goPrev = useCallback(() => {
        goTo(activeIndex === 0 ? total - 1 : activeIndex - 1, -1);
    }, [activeIndex, goTo, total]);

    const goNext = useCallback(() => {
        goTo(activeIndex === total - 1 ? 0 : activeIndex + 1, 1);
    }, [activeIndex, goTo, total]);

    /* ── Body scroll lock ── */
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    /* ── Keyboard listeners ── */
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goPrev, goNext, onClose]);

    /* ── Touch / swipe listeners ── */
    useEffect(() => {
        const el = lightboxRef.current;
        if (!el) return;

        const onTouchStart = (e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };
        const onTouchEnd = (e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            const dy = e.changedTouches[0].clientY - touchStartY.current;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                dx < 0 ? goNext() : goPrev();
            }
            touchStartX.current = null;
            touchStartY.current = null;
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [goNext, goPrev]);

    /* ── Focus trap ── */
    useEffect(() => {
        /* Focus close button on mount */
        closeButtonRef.current?.focus();

        const handleFocusTrap = (e) => {
            if (!lightboxRef.current) return;
            const focusable = Array.from(
                lightboxRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.disabled);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleFocusTrap);
        return () => window.removeEventListener('keydown', handleFocusTrap);
    }, []);

    /* Reset loaded state when image changes */
    useEffect(() => {
        setImgLoaded(false);
    }, [activeIndex]);

    if (!project) return null;

    const currentImage = images[activeIndex] ?? { src: '', alt: '' };

    const imageVariants = {
        enter: (dir) => ({ opacity: 0, x: dir * 60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir * -60 }),
    };

    return (
        <AnimatePresence>
            {/* ── Backdrop ── */}
            <motion.div
                key="lightbox-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    background: 'rgba(0,0,0,0.95)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
                aria-hidden="true"
            />

            {/* ── Lightbox panel ── */}
            <motion.div
                key="lightbox-panel"
                ref={lightboxRef}
                role="dialog"
                aria-modal="true"
                aria-label={`Project gallery: ${project.title}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ─── INNER CONTAINER ─── */}
                <div
                    style={{
                        margin: 'auto',
                        width: '100%',
                        maxWidth: 1100,
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        minHeight: '100vh',
                        justifyContent: 'center',
                    }}
                >
                    {/* ══ TOP BAR: title + counter + close ══ */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Left: title + badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span
                                style={{
                                    background: `${project.color}22`,
                                    color: project.color,
                                    border: `1px solid ${project.color}55`,
                                    borderRadius: 6,
                                    padding: '2px 10px',
                                    fontSize: 11,
                                    fontFamily: 'Rajdhani, sans-serif',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {project.category}
                            </span>
                            <h2
                                style={{
                                    fontFamily: 'Rajdhani, sans-serif',
                                    fontWeight: 700,
                                    fontSize: 'clamp(14px, 2.5vw, 20px)',
                                    color: '#f4f6f9',
                                    margin: 0,
                                    lineHeight: 1.2,
                                }}
                            >
                                {project.title}
                            </h2>
                        </div>

                        {/* Right: counter + close */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Counter */}
                            <span
                                style={{
                                    fontFamily: 'Rajdhani, sans-serif',
                                    fontWeight: 700,
                                    fontSize: 14,
                                    color: '#c0c8d8',
                                    letterSpacing: '0.05em',
                                    background: 'rgba(30,58,95,0.4)',
                                    border: '1px solid rgba(192,200,216,0.15)',
                                    borderRadius: 6,
                                    padding: '3px 10px',
                                }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {activeIndex + 1} / {total}
                            </span>

                            {/* Close button */}
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                aria-label="Close gallery"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: 'rgba(30,58,95,0.4)',
                                    border: '1px solid rgba(192,200,216,0.2)',
                                    color: '#f4f6f9',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,107,43,0.25)';
                                    e.currentTarget.style.borderColor = '#ff6b2b';
                                    e.currentTarget.style.boxShadow = '0 0 16px rgba(255,107,43,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(30,58,95,0.4)';
                                    e.currentTarget.style.borderColor = 'rgba(192,200,216,0.2)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* ══ MAIN IMAGE VIEWER ══ */}
                    <div
                        style={{
                            position: 'relative',
                            borderRadius: 14,
                            overflow: 'hidden',
                            background: 'rgba(15,17,23,0.8)',
                            border: '1px solid rgba(192,200,216,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 280,
                            maxHeight: '65vh',
                        }}
                    >
                        {/* Loading skeleton */}
                        {!imgLoaded && <ImageSkeleton />}

                        {/* Image with crossfade */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.img
                                key={activeIndex}
                                src={currentImage.src}
                                alt={currentImage.alt}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                onLoad={() => setImgLoaded(true)}
                                style={{
                                    maxHeight: '65vh',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    borderRadius: 12,
                                    display: 'block',
                                    opacity: imgLoaded ? 1 : 0,
                                    transition: 'opacity 0.2s ease',
                                    userSelect: 'none',
                                    WebkitUserDrag: 'none',
                                }}
                                draggable={false}
                            />
                        </AnimatePresence>

                        {/* Prev arrow */}
                        {total > 1 && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                aria-label="Previous image"
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'rgba(15,17,23,0.75)',
                                    border: '1px solid rgba(192,200,216,0.2)',
                                    color: '#f4f6f9',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    zIndex: 2,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,107,43,0.3)';
                                    e.currentTarget.style.borderColor = '#ff6b2b';
                                    e.currentTarget.style.boxShadow = '0 0 18px rgba(255,107,43,0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(15,17,23,0.75)';
                                    e.currentTarget.style.borderColor = 'rgba(192,200,216,0.2)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <ChevronLeft size={22} />
                            </motion.button>
                        )}

                        {/* Next arrow */}
                        {total > 1 && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                aria-label="Next image"
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: 'rgba(15,17,23,0.75)',
                                    border: '1px solid rgba(192,200,216,0.2)',
                                    color: '#f4f6f9',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    zIndex: 2,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,107,43,0.3)';
                                    e.currentTarget.style.borderColor = '#ff6b2b';
                                    e.currentTarget.style.boxShadow = '0 0 18px rgba(255,107,43,0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(15,17,23,0.75)';
                                    e.currentTarget.style.borderColor = 'rgba(192,200,216,0.2)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <ChevronRight size={22} />
                            </motion.button>
                        )}
                    </div>

                    {/* ══ PROJECT INFO BAR ══ */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            flexWrap: 'wrap',
                            padding: '8px 0',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: '#c0c8d8',
                                fontSize: 13,
                                fontFamily: 'Source Sans 3, sans-serif',
                            }}
                        >
                            <Camera size={14} color="#ff6b2b" />
                            <span style={{ color: '#ff6b2b', fontWeight: 600 }}>Client:</span>
                            {project.client}
                        </div>
                        <div
                            style={{
                                width: 1,
                                height: 16,
                                background: 'rgba(192,200,216,0.2)',
                            }}
                            aria-hidden="true"
                        />
                        <div
                            style={{
                                color: '#c0c8d8',
                                fontSize: 13,
                                fontFamily: 'Source Sans 3, sans-serif',
                            }}
                        >
                            <span style={{ color: '#ff6b2b', fontWeight: 600 }}>Year: </span>
                            {project.year}
                        </div>
                        <div
                            style={{
                                display: 'none',
                                color: '#c0c8d8',
                                fontSize: 12,
                                fontFamily: 'Source Sans 3, sans-serif',
                                flexShrink: 0,
                            }}
                            className="lg-desc"
                        >
                            {project.description}
                        </div>
                    </div>

                    {/* ══ THUMBNAIL STRIP ══ */}
                    {total > 1 && (
                        <div
                            style={{
                                background: 'rgba(15,17,23,0.7)',
                                border: '1px solid rgba(192,200,216,0.1)',
                                borderRadius: 10,
                                padding: '10px 12px',
                            }}
                        >
                            <ThumbnailStrip
                                images={images}
                                activeIndex={activeIndex}
                                onSelect={(idx) => goTo(idx, idx > activeIndex ? 1 : -1)}
                            />
                        </div>
                    )}

                    {/* ══ DESCRIPTION (mobile readable) ══ */}
                    <p
                        style={{
                            color: 'rgba(192,200,216,0.6)',
                            fontSize: 12,
                            fontFamily: 'Source Sans 3, sans-serif',
                            lineHeight: 1.6,
                            margin: 0,
                            padding: '0 2px 8px',
                        }}
                    >
                        {project.description}
                    </p>
                </div>
            </motion.div>

            {/* Inline keyframe for skeleton spinner */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </AnimatePresence>
    );
}
