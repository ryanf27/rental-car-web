import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/motion';

interface ProfessionalCar3DProps {
  enableIdleRotation?: boolean;
  scrollYaw?: number;
}

export function ProfessionalCar3D({ enableIdleRotation = true, scrollYaw = 0 }: ProfessionalCar3DProps) {
  const groupRef = useRef<Group>(null);
  const wheelRefs = [useRef<Mesh>(null), useRef<Mesh>(null), useRef<Mesh>(null), useRef<Mesh>(null)];
  const reducedMotion = prefersReducedMotion();
  
  // Professional car materials
  const materials = useMemo(() => ({
    carPaint: new THREE.MeshPhysicalMaterial({
      color: '#0A0B0C',
      metalness: 0.6,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.9,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#000011',
      transmission: 0.75,
      ior: 1.45,
      roughness: 0.05,
      thickness: 0.2,
      transparent: true,
      opacity: 0.1,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: '#1C1D21',
      roughness: 0.8,
      metalness: 0.1,
    }),
    chrome: new THREE.MeshPhysicalMaterial({
      color: '#C9CDD3',
      roughness: 0.12,
      metalness: 1.0,
      clearcoat: 1.0,
    }),
    interior: new THREE.MeshStandardMaterial({
      color: '#0F1014',
      roughness: 0.7,
      metalness: 0.1,
    }),
    headlight: new THREE.MeshPhysicalMaterial({
      color: '#FFFFFF',
      emissive: '#E5E7EB',
      emissiveIntensity: 0.8,
      metalness: 0.1,
      roughness: 0,
      transmission: 0.9,
    }),
    taillight: new THREE.MeshPhysicalMaterial({
      color: '#330000',
      emissive: '#660000',
      emissiveIntensity: 0.4,
      metalness: 0.2,
      roughness: 0.1,
    }),
  }), []);
  
  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    
    const time = state.clock.elapsedTime;
    
    // Idle rotation
    if (enableIdleRotation) {
      groupRef.current.rotation.y = Math.sin(time * 0.12) * 0.05;
    }
    
    // Apply scroll-based yaw
    if (scrollYaw !== 0) {
      groupRef.current.rotation.y += scrollYaw * 0.01;
    }
    
    // Subtle floating
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.02;
    
    // Animate wheels
    wheelRefs.forEach((wheelRef, index) => {
      if (wheelRef.current) {
        wheelRef.current.rotation.x += 0.01;
      }
    });
  });

  return (
    <group ref={groupRef} scale={[1.6, 1.6, 1.6]} position={[0, -0.3, 0]}>
      {/* Main Body - Luxury Sedan */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={materials.carPaint}>
        <boxGeometry args={[3.8, 0.5, 1.6]} />
      </mesh>
      
      {/* Hood */}
      <mesh position={[1.2, 0.45, 0]} castShadow receiveShadow material={materials.carPaint}>
        <boxGeometry args={[1.4, 0.4, 1.5]} />
      </mesh>
      
      {/* Roof - Executive Sedan Style */}
      <mesh position={[0, 0.85, 0]} scale={[0.8, 0.4, 0.9]} castShadow material={materials.carPaint}>
        <capsuleGeometry args={[1.8, 0.6, 16, 8]} />
      </mesh>
      
      {/* A-Pillars */}
      <mesh position={[0.9, 0.7, 0.7]} scale={[0.1, 0.3, 0.1]} material={materials.carPaint}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[0.9, 0.7, -0.7]} scale={[0.1, 0.3, 0.1]} material={materials.carPaint}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0.8, 0.9, 0]} rotation={[0.1, 0, 0]} scale={[0.6, 0.4, 0.85]} material={materials.glass}>
        <planeGeometry args={[2, 1]} />
      </mesh>
      
      {/* Side Windows */}
      <mesh position={[0, 0.9, 0.82]} scale={[0.7, 0.3, 0.02]} material={materials.glass}>
        <boxGeometry args={[2.2, 0.8, 1]} />
      </mesh>
      <mesh position={[0, 0.9, -0.82]} scale={[0.7, 0.3, 0.02]} material={materials.glass}>
        <boxGeometry args={[2.2, 0.8, 1]} />
      </mesh>
      
      {/* Rear Window */}
      <mesh position={[-0.8, 0.9, 0]} rotation={[-0.1, 0, 0]} scale={[0.5, 0.3, 0.8]} material={materials.glass}>
        <planeGeometry args={[1.6, 1]} />
      </mesh>
      
      {/* Professional Wheels with Rims */}
      {[
        [1.4, -0.05, 0.9],
        [1.4, -0.05, -0.9],
        [-1.4, -0.05, 0.9],
        [-1.4, -0.05, -0.9],
      ].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          {/* Tire */}
          <mesh ref={wheelRefs[index]} rotation={[Math.PI / 2, 0, 0]} castShadow material={materials.rubber}>
            <cylinderGeometry args={[0.38, 0.38, 0.3]} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]} material={materials.chrome}>
            <cylinderGeometry args={[0.28, 0.28, 0.06]} />
          </mesh>
          {/* Brake Disc */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]} material={materials.chrome}>
            <cylinderGeometry args={[0.22, 0.22, 0.02]} />
          </mesh>
        </group>
      ))}
      
      {/* Headlights - Modern LED Style */}
      <mesh position={[1.95, 0.35, 0.6]} scale={[0.15, 0.1, 0.25]} material={materials.headlight}>
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>
      <mesh position={[1.95, 0.35, -0.6]} scale={[0.15, 0.1, 0.25]} material={materials.headlight}>
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>
      
      {/* LED DRL Strip */}
      <mesh position={[1.9, 0.25, 0]} material={materials.headlight}>
        <boxGeometry args={[0.02, 0.04, 1]} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-1.95, 0.35, 0.5]} scale={[0.1, 0.08, 0.15]} material={materials.taillight}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[-1.95, 0.35, -0.5]} scale={[0.1, 0.08, 0.15]} material={materials.taillight}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      
      {/* Grille */}
      <mesh position={[1.91, 0.4, 0]} material={materials.chrome}>
        <boxGeometry args={[0.02, 0.3, 0.8]} />
      </mesh>
      
      {/* Side Mirrors */}
      <mesh position={[0.5, 1, 0.9]} scale={[0.1, 0.08, 0.15]} material={materials.carPaint}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[0.5, 1, -0.9]} scale={[0.1, 0.08, 0.15]} material={materials.carPaint}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      
      {/* Door Handles */}
      <mesh position={[0.3, 0.5, 0.85]} scale={[0.15, 0.03, 0.02]} material={materials.chrome}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[0.3, 0.5, -0.85]} scale={[0.15, 0.03, 0.02]} material={materials.chrome}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[-0.5, 0.5, 0.85]} scale={[0.15, 0.03, 0.02]} material={materials.chrome}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh position={[-0.5, 0.5, -0.85]} scale={[0.15, 0.03, 0.02]} material={materials.chrome}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      
      {/* Exhaust Pipes */}
      <mesh position={[-1.9, 0.1, 0.4]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[0.05, 0.05, 0.15]} />
      </mesh>
      <mesh position={[-1.9, 0.1, -0.4]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
        <cylinderGeometry args={[0.05, 0.05, 0.15]} />
      </mesh>
    </group>
  );
}