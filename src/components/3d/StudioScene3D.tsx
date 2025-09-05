import { Canvas } from '@react-three/fiber';
import { 
  ContactShadows, 
  Environment, 
  PresentationControls,
  AccumulativeShadows,
  RandomizedLight,
  Lightformer
} from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { ProfessionalCar3D } from './ProfessionalCar3D';
import { should3DRender, prefersReducedMotion } from '@/lib/motion';
import * as THREE from 'three';

interface StudioScene3DProps {
  className?: string;
  scrollYaw?: number;
  enableInteraction?: boolean;
}

// Fallback poster component
const FallbackPoster = () => (
  <div className="w-full h-full bg-gradient-to-br from-secondary via-card to-secondary/50 rounded-xl flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-32 h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor" className="text-primary/30">
          <rect x="5" y="15" width="50" height="15" rx="2" />
          <rect x="10" y="8" width="40" height="12" rx="6" />
          <circle cx="15" cy="30" r="5" />
          <circle cx="45" cy="30" r="5" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">Professional Car Model</p>
    </div>
  </div>
);

const Loading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-pulse">
      <div className="w-32 h-20 bg-primary/10 rounded-lg" />
    </div>
  </div>
);

export function StudioScene3D({ 
  className = "", 
  scrollYaw = 0, 
  enableInteraction = true 
}: StudioScene3DProps) {
  const shouldRender3D = should3DRender();
  const reducedMotion = prefersReducedMotion();
  
  // Camera configuration
  const cameraConfig = useMemo(() => ({
    position: [3, 1.5, 4] as [number, number, number],
    fov: 35,
    near: 0.1,
    far: 1000,
  }), []);

  // If device can't handle 3D or user prefers reduced motion, show fallback
  if (!shouldRender3D) {
    return (
      <div className={`w-full h-full ${className}`}>
        <FallbackPoster />
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`} id="hero-3d">
      <Canvas
        camera={cameraConfig}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loading />}>
          {/* Studio Environment */}
          <Environment resolution={256} background={false}>
            {/* Key Light */}
            <Lightformer
              position={[3, 2, 2]}
              scale={4}
              intensity={55}
              color="#FFFFFF"
            />
            
            {/* Fill Light */}
            <Lightformer
              position={[-2.5, 1.8, 1.2]}
              scale={2}
              intensity={35}
              color="#FFFFFF"
            />
            
            {/* Rim Light */}
            <Lightformer
              position={[0, 3.2, -2]}
              scale={1}
              intensity={25}
              color="#F3F4F6"
            />
            
            {/* Environment Fill */}
            <Lightformer
              position={[0, 0, -5]}
              scale={20}
              intensity={0.5}
              color="#6B7280"
            />
          </Environment>
          
          {/* Main Light Setup */}
          <ambientLight intensity={0.2} color="#F9FAFB" />
          
          {/* Key Light - Studio Style */}
          <spotLight
            position={[0, 3.2, 2]}
            angle={0.45}
            penumbra={0.4}
            intensity={90}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.1}
            shadow-camera-far={20}
            shadow-bias={-0.0001}
          />
          
          {/* Presentation Controls */}
          {enableInteraction && !reducedMotion ? (
            <PresentationControls
              speed={1.5}
              global
              zoom={0.8}
              polar={[-0.1, Math.PI / 4]}
              azimuth={[-Math.PI / 6, Math.PI / 6]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 400 }}
            >
              <ProfessionalCar3D 
                enableIdleRotation={!reducedMotion}
                scrollYaw={scrollYaw}
              />
            </PresentationControls>
          ) : (
            <ProfessionalCar3D 
              enableIdleRotation={false}
              scrollYaw={scrollYaw}
            />
          )}
          
          {/* Professional Contact Shadows */}
          <ContactShadows
            position={[0, -0.45, 0]}
            opacity={0.6}
            blur={2.2}
            far={6.0}
            resolution={256}
            color="#000000"
          />
          
          {/* Additional Soft Shadows */}
          <AccumulativeShadows
            position={[0, -0.45, 0]}
            frames={60}
            alphaTest={0.9}
            opacity={0.75}
            scale={12}
          >
            <RandomizedLight
              amount={8}
              radius={4}
              ambient={0.5}
              position={[5, 5, -10]}
              bias={0.001}
            />
          </AccumulativeShadows>
        </Suspense>
      </Canvas>
    </div>
  );
}