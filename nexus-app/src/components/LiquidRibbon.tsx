import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

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

export default function LiquidRibbon({ index }: { index: number }) {
  const highlight = useRef<THREE.Mesh>(null)
  const color = colors[index % colors.length]

  const curve = useMemo(() => {
    const end = new THREE.Vector3(...positions[index % positions.length])
    const start = new THREE.Vector3(0, 0, 0)
    const midpoint = start.clone().lerp(end, 0.5)

    midpoint.z += 1.1 + (index % 3) * 0.3
    midpoint.y += index % 2 === 0 ? 0.45 : -0.45

    return new THREE.QuadraticBezierCurve3(start, midpoint, end)
  }, [index])

  const ribbon = useMemo(() => {
    const segments = 80
    const width = 0.16
    const vertices: number[] = []
    const indices: number[] = []

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const point = curve.getPoint(t)
      const tangent = curve.getTangent(t)
      const side = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize()
      const taper = Math.sin(Math.PI * t) * width

      vertices.push(
        point.x + side.x * taper,
        point.y + side.y * taper,
        point.z + side.z * taper,
        point.x - side.x * taper,
        point.y - side.y * taper,
        point.z - side.z * taper
      )

      if (i < segments) {
        const a = i * 2
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return geometry
  }, [curve])

  useFrame(({ clock }) => {
    if (!highlight.current) return
    const t = (clock.elapsedTime * (0.12 + index * 0.01) + index * 0.13) % 1
    highlight.current.position.copy(curve.getPoint(t))
  })

  return (
    <group>
      <mesh geometry={ribbon}>
        <meshPhysicalMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.62}
          metalness={0.35}
          roughness={0.18}
          emissive={color}
          emissiveIntensity={0.8}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={highlight}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      <mesh>
        <tubeGeometry args={[curve, 80, 0.025, 6, false]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
