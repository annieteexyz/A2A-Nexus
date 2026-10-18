import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import LiquidAgent from './LiquidAgent'
import LiquidRibbon from './LiquidRibbon'

type Agent = {
  id: string
  name: string
  calls: number
}

type Props = {
  agents: Agent[]
  selected: string | null
  onSelect: (id: string) => void
}

function GlassCore() {
  const sculpture = useRef<THREE.Group>(null)

  useFrame(({ clock }, delta) => {
    if (!sculpture.current) return
    sculpture.current.rotation.y += delta * 0.12
    sculpture.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.12
  })

  return (
    <Float speed={1.1} floatIntensity={0.25} rotationIntensity={0.1}>
      <group ref={sculpture}>
        <mesh scale={[1.45, 1.75, 1.05]}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshTransmissionMaterial
            color="#9ceeff"
            transmission={0.92}
            roughness={0.08}
            thickness={0.8}
            ior={1.35}
            chromaticAberration={0.08}
            backside
            samples={4}
            resolution={256}
          />
        </mesh>

        <mesh rotation={[0.5, 0.3, 0.7]} scale={[1.75, 0.5, 1.3]}>
          <torusGeometry args={[1.1, 0.13, 12, 96]} />
          <meshPhysicalMaterial
            color="#c084fc"
            metalness={0.3}
            roughness={0.12}
            transparent
            opacity={0.75}
            emissive="#6d28d9"
            emissiveIntensity={0.5}
          />
        </mesh>

        <mesh scale={0.65}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#2563eb"
            emissiveIntensity={1.6}
            metalness={0.55}
            roughness={0.18}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default function LiquidGlassUniverse({ agents, selected, onSelect }: Props) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: 550,
      background: 'radial-gradient(ellipse at 18% 25%, rgba(255,65,180,0.34), transparent 42%), radial-gradient(ellipse at 82% 75%, rgba(0,225,255,0.28), transparent 43%), radial-gradient(ellipse at 55% 48%, #59319b 0%, #251449 55%, #100a25 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 3, 3]} intensity={75} color="#22d3ee" />
        <pointLight position={[-4, 1, 2]} intensity={65} color="#d946ef" />
        <pointLight position={[0, -3, -2]} intensity={55} color="#fb923c" />

        <Environment preset="city" />

        {agents.slice(0, 8).map((agent, index) => (
          <LiquidRibbon key={agent.id} index={index} />
        ))}

        <GlassCore />

        {agents.slice(0, 8).map((agent, index) => (
          <LiquidAgent
            key={agent.id}
            id={agent.id}
            selected={selected === agent.id}
            onSelect={onSelect}
            name={agent.name}
            calls={agent.calls}
            index={index}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
      <span style={{ display: 'none' }}>{agents.length} agents</span>
    </div>
  )
}
