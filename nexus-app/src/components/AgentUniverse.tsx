import EnergyPath from './EnergyPath'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Stars, Html } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

type Agent = {
  id: string
  name: string
  calls: number
}

type Props = {
  agents: Agent[]
}

const COLORS = ['#22d3ee', '#a855f7', '#fb923c', '#34d399', '#f472b6']

function Core() {
  const core = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (core.current) {
      core.current.rotation.y += 0.004
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.06
      core.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 5]} />
        <meshPhysicalMaterial
          color="#16d9ff"
          emissive="#008cff"
          emissiveIntensity={2}
          metalness={0.5}
          roughness={0.15}
          transparent
          opacity={0.85}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#0876d5" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.22, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>
      <pointLight color="#22d3ee" intensity={18} distance={7} />
      <pointLight
        position={[0.8, 0.5, 0]}
        color="#c084fc"
        intensity={12}
        distance={5}
      />
      <Html center distanceFactor={12}>
        <div style={{
          color: '#ffffff',
          fontWeight: 900,
          fontSize: 20,
          letterSpacing: 3,
          textShadow: '0 0 18px #22d3ee',
          pointerEvents: 'none'
        }}>
          A2A
        </div>
      </Html>
    </group>
  )
}

function OrbitRing({ radius, color, tilt }: {
  radius: number
  color: string
  tilt: number
}) {
  const ring = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.035
  })

  return (
    <group ref={ring} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

function AgentNode({ agent, index, total }: {
  agent: Agent
  index: number
  total: number
}) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const radius = 3.2 + (index % 3) * 0.65
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y = Math.sin(index * 2.3) * 0.85
  const color = COLORS[index % COLORS.length]

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.45}>
      <group position={[x, y, z]}>
        <mesh>
          <icosahedronGeometry args={[0.43, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.8}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.66, 24, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>
        <Html center position={[0, -0.8, 0]} distanceFactor={11}>
          <div style={{
            color: '#eaf2ff',
            background: 'rgba(5, 12, 32, 0.78)',
            border: `1px solid ${color}66`,
            padding: '5px 9px',
            borderRadius: 7,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontSize: 11,
            pointerEvents: 'none'
          }}>
            <strong>{agent.name}</strong>
            <div style={{ color, fontSize: 9 }}>{agent.calls} calls</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

export default function AgentUniverse({ agents }: Props) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: 460,
      background: 'radial-gradient(ellipse at 48% 42%, rgba(25,105,190,0.72) 0%, rgba(77,35,155,0.50) 28%, rgba(16,20,65,0.96) 62%, #050718 100%)'
    }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 52 }} dpr={[1, 1.7]}>
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 5, 4]} color="#22d3ee" intensity={65} />
        <pointLight position={[-5, -2, -3]} color="#a855f7" intensity={45} />
        <pointLight position={[0, 3, -5]} color="#fb923c" intensity={35} />

        <Stars radius={35} depth={35} count={1100} factor={3} fade speed={1} />

        {agents.slice(0, 12).map((agent, index) => (
          <EnergyPath
            key={`energy-${agent.id}`}
            index={index}
            total={Math.min(agents.length, 12)}
          />
        ))}

        <Core />
        <OrbitRing radius={2.4} color="#22d3ee" tilt={0.5} />
        <OrbitRing radius={3.5} color="#a855f7" tilt={1.1} />
        <OrbitRing radius={4.5} color="#fb923c" tilt={0.25} />

        {agents.slice(0, 12).map((agent, index) => (
          <AgentNode
            key={agent.id}
            agent={agent}
            index={index}
            total={Math.min(agents.length, 12)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={16}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  )
}
