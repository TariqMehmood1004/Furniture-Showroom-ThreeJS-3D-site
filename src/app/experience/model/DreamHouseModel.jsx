"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { convertStandardToBasicMaterials } from "../utils/util"
import { a, useSpring } from "@react-spring/three"
import gsap from "gsap"
import * as THREE from "three"

export default function DreamHouseModel(props) {
  const { nodes, materials } = useGLTF("/models/DreamHouse.glb")

  const basicMaterials = useMemo(
    () => convertStandardToBasicMaterials(materials, 0.55),
    [materials]
  )

  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef([])
  const [hoveredMesh, setHoveredMesh] = useState(null)

  const meshKeys = [
    "SM_Diorama_M_grass_3_0",
    "SM_Diorama_M_grass_2_0",
    "SM_Diorama_M_soil_dirt_0",
    "SM_Diorama_M_transiotions_0",
    "SM_Diorama_M_rand_schwarz_0",
    "SM_Diorama_M_grass_1_0",
    "SM_Diorama_M_S_wood1_0",
    "SM_Diorama_M_S_dirt_0",
    "SM_Diorama_M_t_general1_0",
    "SM_Diorama_M_assets_unique_0",
    "SM_Diorama_M_t_unique1_0",
    "SM_Diorama_M_S_wood_2_0",
    "SM_Diorama_M_S_wood3_0",
    "SM_Diorama_M_s_wood4_0",
    "SM_Diorama_M_S_bark1_0",
    "SM_Diorama_M_decalls1_0",
    "SM_Diorama_M_Lada_0",
    "SM_Diorama_M_nature_atlas_0",
    "SM_Diorama_M_nature_atlas_0_1",
    "SM_Diorama_M_nature_atlas_2_0",
    "SM_Diorama_M_nature_atlas_2_0_1",
    "SM_Diorama_M_additional_trims_0",
    "SM_Diorama_M_additional_trims_0_1",
    "SM_Diorama_M_additional_trims_0_2",
    "SM_Diorama_M_rock_0",
    "SM_Diorama_M_bricks_0",
    "SM_Diorama_M_S_metal_plate_2_0",
    "SM_Diorama_M_S_metal_plate_0",
    "SM_Diorama_M_fox_and_decal_0",
    "SM_Diorama_M_oakbirch_tree_0",
    "SM_Diorama_M_Oakleaves_0",
    "SM_Diorama_M_birch_0",
    "SM_Diorama_M_background_trees_0",
    "SM_Diorama_M_Chainsaw_0",
    "SM_Diorama_M_S_bark2_0"
  ]

  useEffect(() => {
    if (!groupRef.current) return
    const tl = gsap.timeline()
    tl.from(groupRef.current.position, {
      y: -2,
      duration: 1.2,
      ease: "power3.out"
    }).from(
      groupRef.current.rotation,
      { x: -Math.PI / 2, duration: 1.2, ease: "power3.out" },
      "<"
    )

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      gsap.from(mesh.position, {
        y: -0.8,
        duration: 1 + i * 0.05,
        ease: "back.out(1.7)"
      })
      gsap.from(mesh.rotation, {
        y: Math.PI,
        duration: 1 + i * 0.05,
        ease: "power2.out"
      })
      gsap.from(mesh.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 1 + i * 0.05,
        ease: "elastic.out(1, 0.4)"
      })
    })
  }, [])

  const meshSpring = (index) =>
    useSpring({
      scale: hoveredMesh === index ? 1.1 : 1,
      rotation: hoveredMesh === index ? [0, Math.PI / 18, 0] : [0, 0, 0],
      config: { mass: 1, tension: 400, friction: 30 }
    })

  useEffect(() => {
    meshRefs.current.forEach((mesh) => {
      if (!mesh) return
      gsap.to(mesh.position, {
        y: "+=" + (0.01 + Math.random() * 0.05),
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      gsap.to(mesh.rotation, {
        y: "+=" + (0.01 + Math.random() * 0.03),
        x: "+=" + (0.01 + Math.random() * 0.03),
        duration: 3 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    })
  }, [])

  const handlePointerOver = (index) => {
    setHoveredMesh(index)
  }

  const handlePointerOut = () => {
    setHoveredMesh(null)
  }

  const handleGroupClick = () => {
    if (!meshRefs.current.length) return
    const spreadTl = gsap.timeline()

    meshRefs.current.forEach((mesh) => {
      if (!mesh) return
      spreadTl.to(
        mesh.position,
        {
          x: "+=" + (Math.random() * 2 - 1),
          y: "+=" + (Math.random() * 1.5),
          z: "+=" + (Math.random() * 2 - 1),
          rotationX: Math.random() * Math.PI,
          rotationY: Math.random() * Math.PI,
          rotationZ: Math.random() * Math.PI,
          scale: 2,
          duration: 2,
          ease: "power2.out"
        },
        2
      )
    })

    meshRefs.current.forEach((mesh) => {
      if (!mesh) return
      spreadTl.to(
        mesh.position,
        {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 1,
          duration: 2.5,
          ease: "power2.inOut"
        },
        "+=1.2"
      )
    })
  }

  return (
    <a.group ref={groupRef} {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[86.169, 41.928, 630.203]} rotation={[-Math.PI / 2, 0, 0]} scale={70}>
          {meshKeys.map((key, i) => (
            <a.mesh
              key={key}
              ref={(el) => (meshRefs.current[i] = el)}
              geometry={nodes[key].geometry}
              material={basicMaterials[nodes[key].material?.name] || nodes[key].material}
              {...meshSpring(i)}
              dispose={null}
              onPointerOver={() => handlePointerOver(i)}
              onPointerOut={handlePointerOut}
              onClick={handleGroupClick}
            />
          ))}
        </group>
      </group>
    </a.group>
  )
}

useGLTF.preload("/models/DreamHouse.glb")
