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
renderer.setClearColor('#fff')
renderer.setSize(window.innerWidth, window.innerHeight)

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

const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

const pre = document.createElement('pre')
document.body.appendChild(pre)

const model = document.createElement('div')
model.id = 'model'
document.body.appendChild(model)

const mtlLoader = new THREE.MTLLoader()
mtlLoader.setPath('./model/')
mtlLoader.load('Small_Tropical_Island.mtl', material => {
  material.preload()
  const objLoader = new THREE.OBJLoader()
  objLoader.setMaterials(material)
  objLoader.setPath('./model/')
  objLoader.load('Small_Tropical_Island.obj', object => {
    scene.add(object)
  })
})


const dumpContent = {
  sections: [],
}
const lorem = 'Esse est ad velit labore aliqua ut proident ipsum nostrud aliquip. Sunt eiusmod sit tempor nostrud. Aliqua sunt et cillum et ad esse et nisi id nulla ullamco Lorem sunt sunt. Culpa culpa eu dolore irure veniam consequat quis excepteur quis. Ut irure minim duis anim eu nulla esse.'
const makeSections = [...new Array(5)]
  .map((s, i) => {
    return `<section id="wrapper-${i}">
      <div class="wrapper">
        <h1>Section ${i}</h1>
        <p>${lorem}</p>
      </div>
    </section>`
  })
  .join('')

function pars () {
  return `<div class="pars">
    ${[...new Array(5)].map(p => `<p>${lorem}</p>`).join('')}
  </div>`
}

const page = [
  pars(),
  makeSections,
  pars(),
].join('')

app.innerHTML = page

const sections = document.querySelectorAll('section')
function dump () {
  pre.innerText = JSON.stringify(dumpContent, 'utf-8', 2)
}

const updateDump = {
  section (s, i) {
    const { height, top } = s.getBoundingClientRect()
    dumpContent.sections[i] = {
      name: s.getAttribute('id'),
      posY: s.offsetTop,
      height,
      top,
    }
  },
  scroll () {
    dumpContent.scrollY = window.scrollY
  },
  camera () {
    dumpContent.camera = {
      position : camera.position,
      rotation: camera.rotation,
    }
  }
}

camera.position.y = 0
camera.position.x = 0
camera.position.z = 0

camera.rotation.x = 0
camera.rotation.y = 0
camera.rotation.z = 0

function angle (degree) {
  return degree*(Math.PI/180)
}



const mods = [
  // for every tick set all values of camera rotation.position
  // that can be changed for accurate update/reset
  {
    func (el, pct) {
      el.style.color = `rgb(${255 * pct},0,0)`
      camera.position.y = 110 * pct
      camera.position.x = 100 * pct
      camera.rotation.y = 0.5 * pct
    }
  },
  {
    func (el, pct) {
      camera.position.z = (200 * pct)
      camera.rotation.y = angle(180) * pct
    }
  },
  {
    func (el, pct) {
      camera.position.z = 100 - (100 * pct)
    }
  }
]

function handleScroll (e) {
  updateDump.scroll()
  updateDump.camera()

  sections.forEach((s, i) => {
    updateDump.section(s, i)
    const { top, height } = s.getBoundingClientRect()
    if (top < 0 && top > (0 - window.innerHeight)) {
      s.querySelector('h1').innerText = `Section ${i} is active: ${top}px`
      const pct = Math.sqrt(Math.pow((top / height), 2))
      console.log(pct)
      if (mods[i]) {
        mods[i].func(s, pct)
      }
    }
  })

  dump()
}

function animate () {
  // controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
document.body.appendChild(renderer.domElement)
animate()
window.addEventListener('scroll', handleScroll)
