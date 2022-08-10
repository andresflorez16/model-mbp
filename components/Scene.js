import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Loading, ModelLoader } from './ModelLoader'
import { glbLoader } from '../lib/model'

const easeOutCirc = (x) => Math.sqrt(1 - Math.pow(x - 1, 4))

export const Scene = () => {
  const containerRef = useRef()

  const [loading, setLoading] = useState(true)
  const [renderer, setRenderer] = useState()
  const [_camera, setCamera] = useState()
  const [target] = useState(new THREE.Vector3(-0.5, 1.2, 0))
  const [initialCameraPosition] = useState(
    new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
  )
  const [scene] = useState(new THREE.Scene())
  const [_controls, setControls] = useState()

  const handleResize = useCallback(() => {
    const { current } = containerRef
    if (current && renderer) {
      const screenW = current.clientWidth
      const screenH = current.clientHeight

      renderer.setSize(screenW, screenH)
    }
  }, [renderer])

  useEffect(() => {
    const { current } = containerRef 

    if (current && !renderer) {
      const screenW = current.clientWidth
      const screenH = current.clientHeight

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(screenW, screenH)
      renderer.outputEncoding =   THREE.sRGBEncoding
      current.appendChild(renderer.domElement)
      setRenderer(renderer)

      // Camera
      const scale = screenH * 0.005 + 4.8
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      )
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)
      setCamera(camera)

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.enableDamping = true
      controls.target = target
      setControls(controls)

      // Lights
      const AO = new THREE.AmbientLight(0xFFFFFF, 2)
      scene.add(AO)

      // glbLoader
      glbLoader(scene, '/model/andrew.glb', {
        receiveShadow: true,
        castShadow: true
      })
        .then(() => {
          animate()
          setLoading(false)
        })

      // Render scene and animations
      let req = null
      let frame = 0
      const animate = () => {
        req = requestAnimationFrame(animate)

        frame = frame <= 100 ? frame + 1 : frame

        if (frame <= 100) {
          const p = initialCameraPosition
          const rotSpeed = easeOutCirc(frame / 120) * Math.PI * 20

          camera.position.y = 10
          camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
          camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
          camera.lookAt(target)
        } else {
          controls.update()
        }
        renderer.render(scene, camera)
      }

      return () => {
        cancelAnimationFrame(req)
        renderer.dispose()
        current.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [renderer, handleResize])

  return (
    <ModelLoader ref={containerRef}>{loading && <Loading />}</ModelLoader>
  )
}
