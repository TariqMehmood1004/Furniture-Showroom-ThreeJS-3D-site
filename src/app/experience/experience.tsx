"use client";

import { Canvas } from '@react-three/fiber'
import Scene from './scene'
import { OrbitControls } from '@react-three/drei'

const Experience = () => {
  return (
    <Canvas>
        <OrbitControls />
        <Scene />
    </Canvas>
  )
}

export default Experience