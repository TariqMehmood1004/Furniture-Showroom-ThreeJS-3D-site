"use client";

import { Suspense } from 'react'
import FurnitureModel from "./model/FurnitureModel";
import { Html } from '@react-three/drei';

const Scene = () => {
  return (
    <Suspense fallback={
        <Html className='w-screen h-screen flex justify-center items-center'>
            <span className='text-2xl font-bold text-white'>Loading...</span>
        </Html>
        }>
        <FurnitureModel />
    </Suspense>
  )
}

export default Scene