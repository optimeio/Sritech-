import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const coreRef = useRef(null);
    const sat1Ref = useRef(null);
    const sat2Ref = useRef(null);
    const sat3Ref = useRef(null);

    // Track hover state for smooth animation transitions without re-rendering
    const isHovering = useRef(false);

    useEffect(() => {
        const core = coreRef.current;
        const sats = [sat1Ref.current, sat2Ref.current, sat3Ref.current];
        if (!core || sats.some(s => !s)) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let time = 0;

        let currentRadius = 26;
        let speedMultiplier = 1;

        const onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, [role="button"]')) {
                isHovering.current = true;
                core.style.transform = 'translate(-50%, -50%) scale(3)';
                core.style.background = 'rgba(239, 68, 68, 0.2)';
            } else {
                isHovering.current = false;
                core.style.transform = 'translate(-50%, -50%) scale(1)';
                core.style.background = '#ef4444';
            }
        };

        const animate = () => {
            time += 0.04 * speedMultiplier;

            // Smoothly trail the core to the mouse position
            cursorX += (mouseX - cursorX) * 0.18;
            cursorY += (mouseY - cursorY) * 0.18;

            core.style.left = `${cursorX}px`;
            core.style.top = `${cursorY}px`;

            // Animate properties based on hover state
            const targetRadius = isHovering.current ? 48 : 26;
            const targetSpeed = isHovering.current ? 3.5 : 1;

            currentRadius += (targetRadius - currentRadius) * 0.12;
            speedMultiplier += (targetSpeed - speedMultiplier) * 0.12;

            sats.forEach((sat, i) => {
                // Space the 3 satellites equally (120 degrees apart)
                const angle = time + (i * ((Math.PI * 2) / 3));
                // Add a slight sine wave to the orbit to make it feel organic and 3D
                const radius = currentRadius + Math.sin(time * 2 + i) * (isHovering.current ? 5 : 3);

                const satX = cursorX + Math.cos(angle) * radius;
                const satY = cursorY + Math.sin(angle) * radius;

                sat.style.left = `${satX}px`;
                sat.style.top = `${satY}px`;
            });

            requestAnimationFrame(animate);
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
            {/* The Central Core */}
            <div
                ref={coreRef}
                className="hidden md:block shadow-red-glow pointer-events-none"
                style={{
                    position: 'fixed',
                    width: '10px',
                    height: '10px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    zIndex: 99999,
                    transform: 'translate(-50%, -50%)',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.4s ease',
                    willChange: 'left, top, transform',
                }}
            />
            {/* The Orbiting Particles */}
            {[sat1Ref, sat2Ref, sat3Ref].map((ref, i) => (
                <div
                    key={i}
                    ref={ref}
                    className="hidden md:block pointer-events-none"
                    style={{
                        position: 'fixed',
                        width: '6px',
                        height: '6px',
                        // Match brand colors: 0=Silver, 1=Red, 2=Green
                        background: i === 0 ? '#c0c8d8' : i === 1 ? '#ef4444' : '#22c55e',
                        boxShadow: `0 0 10px ${i === 0 ? 'rgba(192,200,216,0.3)' : i === 1 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                        borderRadius: '50%',
                        zIndex: 99998,
                        transform: 'translate(-50%, -50%)',
                        willChange: 'left, top',
                    }}
                />
            ))}
        </>
    );
}            
