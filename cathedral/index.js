// Create Scene
const scene = new THREE.Scene()
// create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
)
camera.position.z = 1000

// Create renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setClearColor('#333')
renderer.setSize(window.innerWidth/2, window.innerHeight/2)
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// add controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.campingFactor = 0.25
controls.enableZoom = true

// Add lights
const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 100%)'), 1.0)
keyLight.position.set(0, 0, 1000)
// keyLight.castShadow = true
scene.add(keyLight)

// const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75)
// fillLight.position.set(100, 0, 100)
// // fillLight.castShadow = true
// scene.add(fillLight)

const backLight = new THREE.DirectionalLight(0xffffff, 1.0)
backLight.position.set(1000, 0, -1000).normalize()
// backLight.castShadow = true
scene.add(backLight)

// Load materials
const objLoader = new THREE.OBJLoader()
// objLoader.castShadow = true
objLoader.setPath('./')
objLoader.load('Cathedral.obj', object => {
  // object.scale = 0.001
  // object.position.x = 500
  // object.position.y = 500
  // object.position.z = -500
  scene.add(object)
})


// Animate function renders and updates scene to dom
function animate () {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}


// add renderer to the page
document.body.appendChild(renderer.domElement)
// start animation cycle
animate()


