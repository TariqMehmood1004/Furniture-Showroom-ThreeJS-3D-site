"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { convertStandardToBasicMaterials } from "../utils/util"
import { a, useSpring } from "@react-spring/three"
import gsap from "gsap"
import * as THREE from "three"

export default function BarCounterModel(props) {
  const { nodes, materials } = useGLTF("/models/BarCounterModel.glb")
  const basicMaterials = useMemo(
    () => convertStandardToBasicMaterials(materials, 0.55),
    [materials]
  )

  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef([])
  const [hoveredMesh, setHoveredMesh] = useState(null)

  // Create particle geometry
  const particleCount = 150
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2 // x
      positions[i * 3 + 1] = Math.random() * 1 + 0.5 // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 // z
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  const particleMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xffddaa,
        size: 0.03,
        transparent: true,
        opacity: 0.8,
      }),
    []
  )

  // GSAP entrance animation for the whole group
  useEffect(() => {
    if (!groupRef.current) return
    const tl = gsap.timeline()
    tl.from(groupRef.current.position, {
      y: -2,
      duration: 1.2,
      ease: "power3.out",
    }).from(
      groupRef.current.rotation,
      { x: -Math.PI / 2, duration: 1.2, ease: "power3.out" },
      "<"
    )

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      gsap.from(mesh.position, {
        y: -0.5,
        duration: 1 + i * 0.25,
        ease: "back.out(1.7)",
      })
      gsap.from(mesh.rotation, {
        y: Math.PI,
        duration: 1 + i * 0.25,
        ease: "power2.out",
      })
      gsap.from(mesh.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 1 + i * 0.25,
        ease: "elastic.out(1, 0.5)",
      })
    })
  }, [])

  // React Spring hover animation for individual meshes
  const meshSpring = (index) =>
    useSpring({
      scale: hoveredMesh === index ? 1.2 : 1,
      rotation: hoveredMesh === index ? [0, Math.PI / 12, 0] : [0, 0, 0],
      config: { mass: 1, tension: 400, friction: 30 },
    })

  // Continuous floating, rotation, glow, and random jitter
  useEffect(() => {
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      gsap.to(mesh.position, {
        y: "+=" + (0.03 + Math.random() * 0.05),
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      gsap.to(mesh.rotation, {
        y: "+=" + (0.03 + Math.random() * 0.05),
        x: "+=" + (0.01 + Math.random() * 0.03),
        duration: 3 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      if (mesh.material.emissive) {
        gsap.to(mesh.material.emissive, {
          r: 0.1 + Math.random() * 0.2,
          g: 0.1 + Math.random() * 0.2,
          b: 0.1 + Math.random() * 0.2,
          duration: 1.5 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }
      gsap.to(mesh.position, {
        x: "+=" + (Math.random() * 0.02 - 0.01),
        z: "+=" + (Math.random() * 0.02 - 0.01),
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })
  }, [])

  // Hover-triggered mini animations for bottles
  useEffect(() => {
    const hoverAnimations = meshRefs.current.slice(2)
    hoverAnimations.forEach((mesh, i) => {
      if (!mesh) return
      const hoverTl = gsap.timeline({ paused: true })
      hoverTl.to(mesh.rotation, {
        z: "+=0.15",
        y: "+=0.1",
        duration: 0.3,
        ease: "power1.inOut",
      }).to(mesh.position, {
        y: "+=0.1",
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      })
      mesh.userData.hoverTl = hoverTl
    })
  }, [])

  const handlePointerOver = (index) => {
    setHoveredMesh(index)
    if (index >= 2 && meshRefs.current[index].userData.hoverTl) {
      meshRefs.current[index].userData.hoverTl.play(0)
    }
  }

  const handlePointerOut = (index) => {
    setHoveredMesh(null)
    if (index >= 2 && meshRefs.current[index].userData.hoverTl) {
      meshRefs.current[index].userData.hoverTl.reverse()
    }
  }

  return (
    <a.group ref={groupRef} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {[2, 3, 4, 5].map((objIndex, i) => (
          <a.mesh
            key={objIndex}
            ref={(el) => (meshRefs.current[i] = el)}
            geometry={nodes[`Object_${objIndex}`].geometry}
            material={basicMaterials[objIndex < 4 ? "bar_counter" : "bottle"]}
            {...meshSpring(i)}
            onPointerOver={() => handlePointerOver(i)}
            onPointerOut={() => handlePointerOut(i)}
          />
        ))}
        {/* Particle system */}
        <points geometry={particles} material={particleMaterial} />
      </group>
    </a.group>
  )
}

useGLTF.preload("/models/BarCounterModel.glb")
