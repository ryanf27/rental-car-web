import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { Car3D } from './Car3D';

interface Scene3DProps {
  className?: string;
}

export function Scene3D({ className = "" }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [4, 2, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.3} color="#ffffff" />
        
        {/* Key Light */}
        <directionalLight 
          position={[8, 10, 5]} 
          intensity={1.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.4}
          color="#4fc3f7"
        />
        
        {/* Rim Light */}
        <pointLight 
          position={[0, 8, -8]} 
          intensity={0.6}
          color="#00e5ff"
          distance={20}
        />
        
        {/* Ground accent lights */}
        <pointLight 
          position={[5, 1, 5]} 
          intensity={0.3}
          color="#2563eb"
          distance={10}
        />
        <pointLight 
          position={[-5, 1, -5]} 
          intensity={0.3}
          color="#1e40af"
          distance={10}
        />
        
        <PresentationControls
          speed={1.5}
          global
          zoom={0.8}
          polar={[-0.1, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Car3D />
        </PresentationControls>
        
        {/* Professional Contact Shadows */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={4}
          resolution={256}
          color="#000000"
        />
        
        {/* Studio Environment */}
        <Environment 
          preset="studio"
          background={false}
          blur={0.8}
        />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}