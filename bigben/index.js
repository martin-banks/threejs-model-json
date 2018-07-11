// Create Scene
const pre = document.querySelector('pre')
const scene = new THREE.Scene()
// create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
)
camera.position.x = -8
camera.position.y = 9
camera.position.z = -12

camera.rotation.x = -2
camera.rotation.y = 0
camera.rotation.z = -3

// Create renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor('#000')
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// add controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.campingFactor = 0.25
controls.enableZoom = true

// Add lights
const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 100%)'), 0.3)
keyLight.position.set(0, 200, 1000)
scene.add(keyLight)

const ambient = new THREE.AmbientLight( '#333', 0.3 ) // soft white light
scene.add( ambient )

const fillLight = new THREE.DirectionalLight('#fff', 1)
fillLight.position.set(100, 50, 100)
scene.add(fillLight)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(-50, 0, -100).normalize()
scene.add(backLight)

// Load materials
let object = null
const objLoader = new THREE.OBJLoader()
// objLoader.castShadow = true
objLoader.setPath('./')
objLoader.load('model.obj', o => {
  // object.scale = 0.001
  // object.position.x = 500
  // object.position.y = 500
  // object.position.z = -500
  object = o
  // object.rotation.y = 2
  scene.add(object)
})

const dump = {}
// Animate function renders and updates scene to dom
function animate () {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  dump.camera = {
    pos: camera.position,
    rotation: camera.rotation,
  }
  if (object) {
    dump.object = {
      position: object.position,
      rotation: object.rotation
    }
  }
  pre.innerText = JSON.stringify(dump, 'utf-8', 2)
}


// add renderer to the page
document.body.appendChild(renderer.domElement)
// start animation cycle
animate()


