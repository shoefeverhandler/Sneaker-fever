'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A more realistic sneaker shape using curves and smooth geometry.
 */
function SneakerModel() {
    const groupRef = useRef<THREE.Group>(null);

    // Create shoe sole shape
    const soleShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, -1.5);
        shape.bezierCurveTo(0.8, -1.5, 1.0, -1.2, 1.0, -0.8);
        shape.bezierCurveTo(1.0, -0.3, 0.9, 0.5, 0.85, 1.0);
        shape.bezierCurveTo(0.8, 1.3, 0.6, 1.5, 0, 1.6);
        shape.bezierCurveTo(-0.6, 1.5, -0.8, 1.3, -0.85, 1.0);
        shape.bezierCurveTo(-0.9, 0.5, -1.0, -0.3, -1.0, -0.8);
        shape.bezierCurveTo(-1.0, -1.2, -0.8, -1.5, 0, -1.5);
        return shape;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3,
    }), []);

    return (
        <group ref={groupRef} position={[0, -0.3, 0]} scale={0.8}>
            {/* Outsole - dark bottom */}
            <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <extrudeGeometry args={[soleShape, { ...extrudeSettings, depth: 0.15 }]} />
                <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
            </mesh>

            {/* Midsole - white cushion */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <extrudeGeometry args={[soleShape, { ...extrudeSettings, depth: 0.25 }]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
            </mesh>

            {/* Upper - main shoe body */}
            <mesh position={[0, 0.4, -0.15]} scale={[0.88, 1, 0.85]}>
                <capsuleGeometry args={[0.45, 1.4, 8, 16]} />
                <meshStandardMaterial
                    color="#4f46e5"
                    roughness={0.35}
                    metalness={0.05}
                />
            </mesh>

            {/* Toe cap */}
            <mesh position={[0, 0.25, 1.05]}>
                <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
                <meshStandardMaterial color="#6366f1" roughness={0.4} />
            </mesh>

            {/* Tongue */}
            <mesh position={[0, 0.85, 0.1]} rotation={[-0.25, 0, 0]} scale={[0.5, 0.6, 0.8]}>
                <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
                <meshStandardMaterial color="#818cf8" roughness={0.5} />
            </mesh>

            {/* Heel tab */}
            <mesh position={[0, 0.75, -1.0]} scale={[0.6, 0.4, 0.15]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#312e81" roughness={0.3} />
            </mesh>

            {/* Side accent swoosh - right */}
            <mesh position={[0.48, 0.35, 0]} rotation={[0, 0, -0.1]} scale={[0.03, 0.08, 1.2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#f97316" roughness={0.2} metalness={0.5} />
            </mesh>

            {/* Side accent swoosh - left */}
            <mesh position={[-0.48, 0.35, 0]} rotation={[0, 0, 0.1]} scale={[0.03, 0.08, 1.2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#f97316" roughness={0.2} metalness={0.5} />
            </mesh>

            {/* Lace area dots */}
            {[0.15, 0.35, 0.55].map((z, i) => (
                <group key={i}>
                    <mesh position={[0.12, 0.65, z]}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshStandardMaterial color="#e0e0e0" metalness={0.8} />
                    </mesh>
                    <mesh position={[-0.12, 0.65, z]}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshStandardMaterial color="#e0e0e0" metalness={0.8} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 0.5, 2]} />
            <meshStandardMaterial color="#e5e7eb" wireframe />
        </mesh>
    );
}

export default function ProductViewer3D({ modelUrl }: { modelUrl: string }) {
    return (
        <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-zinc-100 to-zinc-50 rounded-3xl overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
                360° View — Drag to rotate
            </div>

            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [2.5, 1.8, 3.5], fov: 40 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                    <directionalLight position={[-3, 3, -3]} intensity={0.3} />
                    <spotLight position={[0, 8, 0]} intensity={0.5} angle={0.5} penumbra={1} />

                    <SneakerModel />

                    <ContactShadows
                        position={[0, -0.5, 0]}
                        opacity={0.4}
                        scale={5}
                        blur={2}
                        far={4}
                    />
                    <Environment preset="city" />
                </Suspense>
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={3}
                    enableZoom={true}
                    enablePan={false}
                    minDistance={2.5}
                    maxDistance={8}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                />
            </Canvas>
        </div>
    );
}
