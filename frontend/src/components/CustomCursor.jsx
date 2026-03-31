import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;
        if (!cursor || !dot) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        };

        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animate);
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, [role="button"]')) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = '#ff6b2b';
            } else {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'rgba(192,200,216,0.7)';
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <>
            {/* Crosshair cursor */}
            <div
                ref={cursorRef}
                className="hidden md:block"
                style={{
                    position: 'fixed',
                    width: '28px',
                    height: '28px',
                    border: '2px solid rgba(192,200,216,0.7)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99998,
                    transform: 'translate(-50%, -50%)',
                    transition: 'border-color 0.2s, transform 0.2s',
                    willChange: 'left, top, transform',
                }}
            >
                {/* Crosshair lines */}
                <div style={{ position: 'absolute', top: '50%', left: '-6px', width: '6px', height: '1px', background: 'rgba(255,107,43,0.8)', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', top: '50%', right: '-6px', width: '6px', height: '1px', background: 'rgba(255,107,43,0.8)', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', left: '50%', top: '-6px', height: '6px', width: '1px', background: 'rgba(255,107,43,0.8)', transform: 'translateX(-50%)' }} />
                <div style={{ position: 'absolute', left: '50%', bottom: '-6px', height: '6px', width: '1px', background: 'rgba(255,107,43,0.8)', transform: 'translateX(-50%)' }} />
            </div>
            {/* Orange dot */}
            <div
                ref={dotRef}
                className="hidden md:block"
                style={{
                    position: 'fixed',
                    width: '6px',
                    height: '6px',
                    background: '#ff6b2b',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 99999,
                    transform: 'translate(-50%, -50%)',
                    willChange: 'left, top',
                }}
            />
        </>
    );
}
