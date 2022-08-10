import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import s from './Scene.module.css'

const easeOutCirc = (x) => {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}

export const Scene = () => {
  const [target] = useState(new THREE.Vector3(-0.5, 1.2, 0))
  const [initialCameraPosition] = useState(
    new THREE.Vector3(
      30 * Math.sin(0.2 * Math.PI),
      25,
      30 * Math.cos(0.2 * Math.PI)
    )
  )

  const containerRef = useRef()

  useEffect(() => {
    const { current } = containerRef 

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      25,
      current.clientWidth / current.clientHeight,
      0.1,
      1000
    )
    camera.position.copy(initialCameraPosition)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(current.clientWidth, current.clientHeight)
    current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.enableDamping = true
    controls.target = target

    // Loader
    const glbLoader = new GLTFLoader()
    glbLoader.load('/model/andrew.glb',
      (glb) => {
        scene.add(glb.scene)
      },
      () => {}
    )

    // Textures
    const textures = new THREE.TextureLoader()
    const map = textures.load('/cube/Abstract_Organic_002_COLOR.jpg')
    const aoMap = textures.load('/cube/Abstract_Organic_002_OCC.jpg')
    const roughnessMap = textures.load('/cube/Abstract_Organic_002_ROUGH.jpg')
    const normalMap = textures.load('/cube/Abstract_Organic_002_NORM.jpg')
    const heightMap = textures.load('/cube/Abstract_Organic_002_DISP.png')

    // Cube
    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1, 200, 200, 200),
      new THREE.MeshStandardMaterial({
        map,
        aoMap,
        roughnessMap,
        normalMap,
        displacementMap: heightMap,
        displacementScale: 0.07
      })
    )
    //scene.add(cube)

    // Lights
    const AO = new THREE.AmbientLight(0xFFFFFF, 2)
    scene.add(AO)
    const pointLight = new THREE.PointLight(0xFFFFFF, 1.3)
    pointLight.position.set(5,10,25)
    scene.add(pointLight)
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.3)
    directionalLight.position.set(5, 5, -15)
    //scene.add(directionalLight)

    // Render scene and animations
    let frame = 0
    const animate = (time) => {
      frame = frame <= 100 ? frame + 1 : frame
      if (frame <= 100) {
        const p = initialCameraPosition
        camera.position.y = 25
        const rotSpeed = easeOutCirc(frame / 120) * Math.PI * 20
        camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
        camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
      } else {
        controls.update()
      }
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      current.removeChild(renderer.domElement)
    }

  }, [])

  return (
    <div className={s.sceneContainer} ref={containerRef}>
    </div>
  )
}
