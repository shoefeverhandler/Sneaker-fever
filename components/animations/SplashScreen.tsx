'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const brandName = 'SNEAKER FEVER';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const shown = sessionStorage.getItem('sf-splash-v3');
        if (shown) {
            setShowSplash(false);
            return;
        }

        const interval = setInterval(() => {
            setVisibleCount((prev) => {
                if (prev >= brandName.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 120);

        const exit = setTimeout(() => {
            setShowSplash(false);
            sessionStorage.setItem('sf-splash-v3', 'true');
        }, brandName.length * 120 + 1400);

        return () => {
            clearInterval(interval);
            clearTimeout(exit);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                        {/* Animated horizontal lines shooting across */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={`line-${i}`}
                                className="absolute h-[1px]"
                                style={{
                                    top: `${20 + i * 12}%`,
                                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.03 + i * 0.01}), transparent)`,
                                    width: '100%',
                                }}
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 2 + i * 0.3,
                                    delay: 0.2 + i * 0.15,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}

                        {/* Corner accent lines */}
                        <motion.div
                            className="absolute top-12 left-12 w-16 h-[1px] bg-gradient-to-r from-white/30 to-transparent"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                        <motion.div
                            className="absolute top-12 left-12 w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent"
                            initial={{ scaleY: 0, originY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                        <motion.div
                            className="absolute bottom-12 right-12 w-16 h-[1px] bg-gradient-to-l from-white/30 to-transparent"
                            initial={{ scaleX: 0, originX: 1 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                        <motion.div
                            className="absolute bottom-12 right-12 w-[1px] h-16 bg-gradient-to-t from-white/30 to-transparent"
                            initial={{ scaleY: 0, originY: 1 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />

                        {/* Glow pulse behind text */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: 500,
                                height: 200,
                                background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
                            }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Floating dots / sparks */}
                        {[...Array(12)].map((_, i) => {
                            const startX = (Math.random() - 0.5) * 800;
                            const startY = (Math.random() - 0.5) * 400;
                            return (
                                <motion.div
                                    key={`dot-${i}`}
                                    className="absolute w-[2px] h-[2px] rounded-full bg-white/40"
                                    initial={{ x: startX, y: startY, opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        scale: [0, 1, 0],
                                        y: [startY, startY - 50],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: 0.5 + i * 0.2,
                                        ease: 'easeOut',
                                    }}
                                />
                            );
                        })}

                        {/* The typed text */}
                        <div className="relative z-10 flex items-center gap-[2px]">
                            {brandName.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-[0.08em] uppercase ${char === ' ' ? 'w-4 sm:w-6 md:w-8' : 'text-white'
                                        }`}
                                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                                    animate={
                                        i < visibleCount
                                            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                                            : { opacity: 0, y: 40, filter: 'blur(8px)' }
                                    }
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    style={{
                                        textShadow: i < visibleCount ? '0 0 20px rgba(255,255,255,0.15)' : 'none',
                                    }}
                                >
                                    {char === ' ' ? '' : char}
                                </motion.span>
                            ))}

                            {/* Blinking cursor */}
                            <motion.span
                                className="inline-block w-[3px] sm:w-[4px] h-8 sm:h-12 md:h-16 bg-white ml-1"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        </div>

                        {/* Underline that draws after text finishes */}
                        <motion.div
                            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            style={{ top: '58%', width: '40%' }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: visibleCount >= brandName.length ? 1 : 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {children}
            </motion.div>
        </>
    );
}
