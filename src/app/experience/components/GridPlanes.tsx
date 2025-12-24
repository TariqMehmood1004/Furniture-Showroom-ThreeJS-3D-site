"use client"

import React, { useMemo, useRef, useState } from "react"
import { Mesh } from "three"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface GridPlanesProps {
  rows?: number
  columns?: number
  spacing?: number
  planeWidth?: number
  planeDepth?: number
  yPosition?: number
}

const Plane = ({ position, planeWidth, planeDepth, yPosition }: any) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const hoveredRef = useRef(false)
  const opacityRef = useRef(0)

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const meshMaterial = meshRef.current
      .material as THREE.MeshStandardMaterial // Type-cast here

    const targetOpacity = hoveredRef.current ? 0.8 : 0
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.1)

    meshMaterial.opacity = opacityRef.current
    meshMaterial.emissiveIntensity = hoveredRef.current ? 1.5 : 0.8
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], yPosition ?? 0, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      onPointerOver={() => (hoveredRef.current = true)}
      onPointerOut={() => (hoveredRef.current = false)}
    >
      <planeGeometry args={[planeWidth, planeDepth]} />
    </mesh>
  )
}

const GridPlanes: React.FC<GridPlanesProps> = ({
  rows = 10,
  columns = 10,
  spacing = 1,
  planeWidth = 1,
  planeDepth = 1,
  yPosition = 0,
}) => {
  const gridWidth = columns * (planeWidth + spacing) - spacing
  const gridDepth = rows * (planeDepth + spacing) - spacing

  const startX = -gridWidth / 2 + planeWidth / 2
  const startZ = -gridDepth / 2 + planeDepth / 2

  const planes = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = startX + col * (planeWidth + spacing)
      const z = startZ + row * (planeDepth + spacing)
      planes.push(
        <Plane
          key={`${row}-${col}`}
          position={[x, yPosition, z]}
          planeWidth={planeWidth}
          planeDepth={planeDepth}
          yPosition={yPosition}
        />
      )
    }
  }

  return <group>{planes}</group>
}

export default GridPlanes
