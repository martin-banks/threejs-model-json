// Create Scene
const scene = new THREE.Scene()
// create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 200

// Create renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor('#333')
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// add controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.campingFactor = 0.25
controls.enableZoom = true

// Add lights
const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 100%)'), 1.0)
keyLight.position.set(0, 0, 100)
keyLight.castShadow = true
scene.add(keyLight)
// const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75)
// fillLight.position.set(100, 0, 100)
// fillLight.castShadow = true
// scene.add(fillLight)
// const backLight = new THREE.DirectionalLight(0xffffff, 1.0)
// backLight.position.set(100, 0, -100).normalize()
// backLight.castShadow = true
// scene.add(backLight)

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 320, 320 )
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
const plane = new THREE.Mesh( planeGeometry, planeMaterial )
plane.receiveShadow = true
plane.position.z = -100
scene.add(plane)

var sphereGeometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.castShadow = true; //default is false
sphere.receiveShadow = false; //default
scene.add( sphere );
// Load materials
const mtlLoader = new THREE.MTLLoader()
mtlLoader.setPath('./model/')
mtlLoader.load('r2-d2.mtl', material => {

  material.preload()
  // Load object
  const objLoader = new THREE.OBJLoader()
  objLoader.setMaterials(material)
  objLoader.castShadow = true
  objLoader.setPath('./model/')
  objLoader.load('r2-d2-shadows.obj', object => {
    // object.position.y -= 60
    object.castShadow = true
    object.traverse(child => {
      child.castShadow = true
      // if (child instanceof THREE.Mesh) {
      //   console.log('mesh!')
      //   // child.recieveShadow = true
      // }
    })
    scene.add(object)
  })
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

const position = 200

const target = 10
// console.log({ position, newPosition })

const tween = new TWEEN.Tween(position).to(target, 1000, 2000)
tween.onUpdate(function () {
  // console.log(position, x, y, z)
  camera.position.y = position
  // camera.position.y = position.y
  // camera.position.z = position.z
})

tween.start()
tween.update()

