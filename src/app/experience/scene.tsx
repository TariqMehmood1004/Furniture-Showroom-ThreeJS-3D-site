"use client"

import { Suspense, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DreamHouseModel from "./model/DreamHouseModel"


interface Props {
  camera: React.RefObject<THREE.Camera | THREE.OrthographicCamera | null>
  pointer: React.RefObject<{ x: number; y: number }>
}

const Scene = ({ camera, pointer }: Props) => {
  const groupRef = useRef<THREE.Group | null>(null)
  const groupRotationRef = useRef<number>(0)

  useFrame(() => {
    if (!groupRef.current) return;

    // console.log(camera.current?.position);
    // console.log(camera.current?.rotation);

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
        <Html className="flex justify-center items-center">
          <span className="text-2xl font-bold text-white">Loading...</span>
        </Html>
      }
    >
      <group ref={groupRef}>
        <DreamHouseModel />
      </group>
    </Suspense>
  )
}

export default Scene
