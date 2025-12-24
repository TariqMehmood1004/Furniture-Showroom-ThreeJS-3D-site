"use client"

import { Suspense, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BarCounterModel from "./model/BarCounterModel"

interface Props {
  camera: React.RefObject<THREE.Camera | THREE.OrthographicCamera | null>
  pointer: React.RefObject<{ x: number; y: number }>
}

const Scene = ({ camera, pointer }: Props) => {
  const groupRef = useRef<THREE.Group | null>(null)
  const groupRotationRef = useRef<number>(0)

  useFrame(() => {
    if (!groupRef.current) return

    const targetRotation = pointer.current.x * Math.PI * 0.25
    groupRotationRef.current = THREE.MathUtils.lerp(
      groupRotationRef.current,
      targetRotation,
      0.1
    )

    groupRef.current.rotation.y = groupRotationRef.current
  })

  return (
    <Suspense
      fallback={
        <Html className="w-screen h-screen flex justify-center items-center">
          <span className="text-2xl font-bold text-white">Loading...</span>
        </Html>
      }
    >
      <group ref={groupRef}>
        <BarCounterModel />
      </group>
    </Suspense>
  )
}

export default Scene
