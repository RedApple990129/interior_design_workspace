/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useRef, useState } from 'react'
import useStore from '~/stores/store'
import { shaderMaterial } from '@react-three/drei'

import vertex from 'raw-loader!glslify-loader!./glsl/shader.vert'
import fragment from 'raw-loader!glslify-loader!./glsl/shader.frag'

const ColorShiftMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.07, 0.4, 0.00),
  },
  vertex,
  fragment
)

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
// @ts-ignore
ColorShiftMaterial.key = THREE.MathUtils.generateUUID()

extend({ ColorShiftMaterial })

const Shader = (props) => {
  const meshRef = useRef(null)
  const [hovered, setHover] = useState(false)
  const router = useStore((state) => state.router)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01
    }
    if (meshRef.current.material) {
      meshRef.current.material.uniforms.time.value +=
        Math.sin(delta / 2) * Math.cos(delta / 2)
    }
  })

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.1 : 1}
      onClick={() => {
        router.push(`/example-page`)
      }}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* @ts-ignore */}
      <colorShiftMaterial key={ColorShiftMaterial.key} time={3} />
    </mesh>
  )
}

export default Shader
