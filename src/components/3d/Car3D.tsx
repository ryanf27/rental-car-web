import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function Car3D() {
  const meshRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <group ref={meshRef} scale={[1.2, 1.2, 1.2]}>
      {/* Car Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3, 0.8, 1.2]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} />
      </mesh>
      
      {/* Car Top */}
      <mesh position={[0, 0.8, 0]} scale={[0.8, 0.6, 0.9]}>
        <boxGeometry args={[2.2, 0.8, 1]} />
        <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.6, 0.85, 0]} scale={[0.3, 0.4, 0.85]}>
        <boxGeometry args={[1.2, 0.6, 0.95]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-0.6, 0.85, 0]} scale={[0.3, 0.4, 0.85]}>
        <boxGeometry args={[1.2, 0.6, 0.95]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1, -0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[1, -0.2, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-1, -0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-1, -0.2, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[1.55, 0.2, 0.4]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.55, 0.2, -0.4]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}