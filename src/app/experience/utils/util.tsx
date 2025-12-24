import * as THREE from 'three'

type GLTFMaterials = Record<string, THREE.Material>

/**
 * Converts all MeshStandardMaterial entries to MeshBasicMaterial.
 *
 * @param materials - materials object from useGLTF()
 * @param alphaTest - alphaTest value for transparent materials (default: 0.55)
 * @returns new materials map with MeshBasicMaterial
 */
export function convertStandardToBasicMaterials(
  materials: GLTFMaterials,
  alphaTest: number = 0
): GLTFMaterials {
  const converted: GLTFMaterials = {}

  Object.entries(materials).forEach(([key, material]) => {
    if (!(material instanceof THREE.MeshStandardMaterial)) {
      converted[key] = material
      return
    }

    const isTransparent: boolean = material.transparent === true

    converted[key] = new THREE.MeshBasicMaterial({
      map: material.map ?? null,
      transparent: isTransparent,
      alphaTest: isTransparent ? 0.55 : alphaTest,
      side: material.side,
      toneMapped: false
    })

    if (material.map) {
      material.map.needsUpdate = true
    }
  })

  return converted
}
