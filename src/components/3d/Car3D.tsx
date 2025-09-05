import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function Car3D() {
  const meshRef = useRef<Group>(null);
  const wheelRefs = [useRef<Group>(null), useRef<Group>(null), useRef<Group>(null), useRef<Group>(null)];
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Sophisticated floating animation with multiple sine waves
    const time = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(time * 0.6) * 0.08 + Math.sin(time * 1.2) * 0.02;
    meshRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
    
    // Rotate wheels for realism
    wheelRefs.forEach((wheelRef, index) => {
      if (wheelRef.current) {
        wheelRef.current.rotation.x += 0.02 + Math.sin(time + index) * 0.01;
      }
    });
  });

  return (
    <group ref={meshRef} scale={[1.4, 1.4, 1.4]} position={[0, -0.5, 0]}>
      {/* Main Car Body - Sleek Sports Car Design */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.6, 1.4]} />
        <meshPhysicalMaterial 
          color="#2563eb" 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>
      
      {/* Lower Body Extension */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.3, 1.6]} />
        <meshPhysicalMaterial 
          color="#1d4ed8" 
          metalness={0.8}
          roughness={0.15}
          clearcoat={0.8}
        />
      </mesh>
      
      {/* Car Roof - Streamlined */}
      <mesh position={[0, 0.85, 0]} scale={[0.75, 0.5, 0.85]} castShadow>
        <sphereGeometry args={[1.8, 16, 8]} />
        <meshPhysicalMaterial 
          color="#1e40af" 
          metalness={0.95}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0.8, 0.9, 0]} scale={[0.4, 0.35, 0.8]} castShadow>
        <sphereGeometry args={[1.2, 12, 8]} />
        <meshPhysicalMaterial 
          color="#000011" 
          transparent 
          opacity={0.2}
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={0.1}
        />
      </mesh>
      
      {/* Side Windows */}
      <mesh position={[0, 0.9, 0.75]} scale={[0.6, 0.3, 0.1]}>
        <boxGeometry args={[2, 0.8, 0.05]} />
        <meshPhysicalMaterial 
          color="#000022" 
          transparent 
          opacity={0.15}
          transmission={0.95}
          thickness={0.02}
        />
      </mesh>
      <mesh position={[0, 0.9, -0.75]} scale={[0.6, 0.3, 0.1]}>
        <boxGeometry args={[2, 0.8, 0.05]} />
        <meshPhysicalMaterial 
          color="#000022" 
          transparent 
          opacity={0.15}
          transmission={0.95}
          thickness={0.02}
        />
      </mesh>
      
      {/* Wheels - More Realistic */}
      <group ref={wheelRefs[0]} position={[1.2, -0.1, 0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      <group ref={wheelRefs[1]} position={[1.2, -0.1, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      <group ref={wheelRefs[2]} position={[-1.2, -0.1, 0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      <group ref={wheelRefs[3]} position={[-1.2, -0.1, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Modern LED Headlights */}
      <mesh position={[1.65, 0.35, 0.5]}>
        <sphereGeometry args={[0.12]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#4fc3f7" 
          emissiveIntensity={0.6}
          metalness={0.1}
          roughness={0}
        />
      </mesh>
      <mesh position={[1.65, 0.35, -0.5]}>
        <sphereGeometry args={[0.12]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          emissive="#4fc3f7" 
          emissiveIntensity={0.6}
          metalness={0.1}
          roughness={0}
        />
      </mesh>
      
      {/* LED Strip Lights */}
      <mesh position={[1.6, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.05, 0.8]} />
        <meshPhysicalMaterial 
          color="#00e5ff" 
          emissive="#00e5ff" 
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Rear Lights */}
      <mesh position={[-1.65, 0.35, 0.4]}>
        <sphereGeometry args={[0.08]} />
        <meshPhysicalMaterial 
          color="#ff1744" 
          emissive="#ff1744" 
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[-1.65, 0.35, -0.4]}>
        <sphereGeometry args={[0.08]} />
        <meshPhysicalMaterial 
          color="#ff1744" 
          emissive="#ff1744" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Ground Shadow Plane */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 3]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}