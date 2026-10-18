import { Float, Html } from '@react-three/drei'
import AgentLogo from './AgentLogo'

type Props = {
  id: string
  selected: boolean
  onSelect: (id: string) => void
  name: string
  calls: number
  index: number
}

const colors = ['#22d3ee', '#d946ef', '#fb923c', '#8b5cf6', '#34d399', '#f472b6']

const positions: [number, number, number][] = [
  [-3.2, 1.5, -0.5],
  [3.1, 1.4, -1],
  [-3.6, -1.3, 0.4],
  [3.4, -1.4, 0.3],
  [-1.6, 2.5, -2],
  [1.7, -2.5, -1.5],
  [0, 2.8, -2.8],
  [0, -2.8, -2.5],
]

export default function LiquidAgent({ id, selected, onSelect, name, calls, index }: Props) {
  const color = colors[index % colors.length]
  const position = positions[index % positions.length]

  return (
    <Float speed={1.2 + index * 0.08} floatIntensity={0.3} rotationIntensity={0.2}>
      <group
        position={position}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
        scale={selected ? 1.3 : 1}
      >
        <mesh rotation={[0.4, index * 0.5, 0.3]}>
          <octahedronGeometry args={[0.48, 1]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.25}
            roughness={0.08}
            transparent
            opacity={0.55}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive={color}
            emissiveIntensity={0.35}
          />
        </mesh>

        <mesh scale={1.15}>
          <octahedronGeometry args={[0.48, 1]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>

        <Html
          center
          position={[0, 0, 0.62]}
          distanceFactor={8}
          transform={false}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => onSelect(id)}
        >
          <AgentLogo agentId={id} name={name} color={color} />
        </Html>

        <Html
          center
          position={[0, -0.85, 0]}
          distanceFactor={9}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => onSelect(id)}
        >
          <div style={{
            padding: '7px 12px',
            borderRadius: 12,
            background: 'rgba(18, 25, 62, 0.62)',
            border: `1px solid ${color}88`,
            boxShadow: `0 0 20px ${color}33`,
            backdropFilter: 'blur(12px)',
            color: '#fff',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontSize: 11,
            pointerEvents: 'auto', cursor: 'pointer'
          }}>
            <strong>{name}</strong>
            <div style={{ color, fontSize: 10 }}>{calls} calls</div>
          </div>
        </Html>
      </group>
    </Float>
  )
}
