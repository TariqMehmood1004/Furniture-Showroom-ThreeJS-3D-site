"use client"

import { Canvas } from '@react-three/fiber'
import Scene from './scene'
import { OrthographicCamera } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import GridPlanes from './components/GridPlanes'

const Experience = () => {
  // Ref for the camera
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)

  // Ref for pointer coordinates
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Track pointer movement
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    document.addEventListener('pointermove', onPointerMove)
    return () => document.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <Canvas>
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={[-8.276555750051465, 3.319986598977967, 1.3910197665016075]}
        rotation={[-0.9040641546399786, -1.238433524935682, -0.8765448653265142]}
        zoom={200}
      />
      {/* <OrbitControls /> */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <GridPlanes 
        rows={10} 
        columns={10} 
        planeWidth={3}  
        planeDepth={3}
        spacing={0}  
      />
      <Scene camera={cameraRef} pointer={pointerRef} />
    </Canvas>
  )
}

export default Experience
