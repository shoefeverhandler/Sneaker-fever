'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

function ShoeModel({ modelUrl, scale = 1 }: { modelUrl: string; scale?: number }) {
    // Fallback to a box if model fails or during dev if no GLB available
    // In a real scenario, useGLTF would load the file. 
    // For this template, we'll try to load, but catch errors or just show a placeholder geometry if URL is dummy.

    // Note: To use a real model, place 'shoe.glb' in public/models/
    // const { scene } = useGLTF(modelUrl);
    // return <primitive object={scene} scale={scale} />;

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            meshRef.current.rotation.y = Math.sin(t / 2) * 0.3; // Gentle auto-rotation
            meshRef.current.rotation.z = Math.cos(t / 2) * 0.1;
        }
    });

    return (
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} scale={scale}>
                <boxGeometry args={[2, 1, 3]} />
                <meshStandardMaterial color="#4338ca" roughness={0.3} metalness={0.8} />
            </mesh>
        </Float>
    );
}

// Separate component to handle the GLTF loading safely if we had a real file
function RealShoeModel({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ShoeCanvas({ modelUrl }: { modelUrl?: string }) {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <group rotation={[0, Math.PI / 4, 0]}>
                        <ShoeModel modelUrl={modelUrl || ''} scale={1.5} />
                    </group>
                    <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}
