import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const glbLoader = (scene, modelPath, options = { receiveShadow: true, castShadow: true }) => {
  const { receiveShadow, castShadow } = options
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(
      modelPath,
      gltf => {
        const obj = gltf.scene
        obj.name = 'andrew'
        obj.position.set(0, 0, 0)
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        scene.add(obj)

        obj.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
          }
        })
        resolve(obj)
      },
      undefined,
      err => reject(err)
    )
  })
}
