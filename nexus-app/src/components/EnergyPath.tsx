import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = ['#22d3ee', '#a855f7', '#fb923c', '#ec4899', '#34d399']

type Props = {
  index: number
  total: number
}

export default function EnergyPath({ index, total }: Props) {
  const dot = useRef<THREE.Mesh>(null)
  const glow = useRef<THREE.Mesh>(null)
  const color = COLORS[index % COLORS.length]

  const curve = useMemo(() => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    const radius = 3.2 + (index % 3) * 0.65

    const end = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(index * 2.3) * 0.85,
      Math.sin(angle) * radius
    )

    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(end.x * 0.5, 1.4, end.z * 0.5),
      end
    )
  }, [index, total])

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
    [curve]
  )

  useFrame(({ clock }) => {
    const progress = (clock.elapsedTime * 0.16 + index * 0.13) % 1
    const position = curve.getPoint(progress)
    dot.current?.position.copy(position)
    glow.current?.position.copy(position)
  })

  return (
    <group>
      <primitive object={new THREE.Line(geometry)}>
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </primitive>

      <mesh ref={glow}>
        <sphereGeometry args={[0.19, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={dot}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
