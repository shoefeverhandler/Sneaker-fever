'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero3DPlaceholder() {
    return (
        <div className="relative w-full h-[50vh] md:h-[70vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full max-w-4xl"
            >
                {/* Placeholder for 3D Model - Using a high quality shoe image instead */}
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
                    <Image
                        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
                        alt="Hero Shoe"
                        fill
                        className="object-contain drop-shadow-2xl z-10"
                        priority
                        sizes="(max-width: 768px) 100vw, 80vw"
                    />
                </div>
            </motion.div>
        </div>
    );
}
