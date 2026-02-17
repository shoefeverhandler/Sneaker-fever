export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 },
};

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => ({
    initial: {
        x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
        y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
        opacity: 0,
    },
    animate: {
        x: 0,
        y: 0,
        opacity: 1,
    },
    transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
    },
});

export const magneticParams = {
    type: 'spring',
    stiffness: 150,
    damping: 15,
    mass: 0.1,
};
