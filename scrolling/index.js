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

// add controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.campingFactor = 0.25
controls.enableZoom = true

// Add lights
const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 100%)'), 0.3)
keyLight.position.set(0, 200, 1000)
scene.add(keyLight)

const ambient = new THREE.AmbientLight('#333', 0.3) // soft white light
scene.add(ambient)

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

function pars() {
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
function dump() {
  pre.innerText = JSON.stringify(dumpContent, 'utf-8', 2)
}

const updateDump = {
  section(s, i) {
    const { height, top } = s.getBoundingClientRect()
    dumpContent.sections[i] = {
      name: s.getAttribute('id'),
      posY: s.offsetTop,
      height,
      top,
    }
  },
  scroll() {
    dumpContent.scrollY = window.scrollY
    dumpContent.window = {
      activeScroll,
      prevScroll,
    }
  },
  camera() {
    dumpContent.camera = {
      position: camera.position,
      rotation: camera.rotation,
    }
  }
}


function angle (degree) {
  return degree * (Math.PI / 180)
}





const mods = [
  // for every tick set all values of camera rotation.position
  // that can be changed for accurate update/reset
  {
    func(el, pct) {
      el.style.color = `rgb(${255 * pct},0,0)`
      camera.position.y = 110 * pct
      camera.position.x = 100 * pct
      camera.rotation.y = 0.5 * pct
    }
  },
  {
    func(el, pct) {
      camera.position.z = (200 * pct)
      camera.rotation.y = angle(180) * pct
    }
  },
  {
    func(el, pct) {
      camera.position.z = 100 - (100 * pct)
    }
  }
]

let prevScene = 0
let activeScene = 1
let prevScroll = 0
let activeScroll = 0



function setActiveScene () {
  sections.forEach((s, i) => {
    const { top } = s.getBoundingClientRect()
    if (top < 0 && top > (0 - window.innerHeight)) {
      // activeScene = i + 1
      if (activeScroll >= prevScroll) {
        // going down page
        // prevScene = i
        activeScene = i + 2
      } else {
        // going up page
        // prevScene = i + 2
        activeScene = i + 1
      }
    }
  })
  dumpContent.activeScene = activeScene
  dumpContent.prevScene = prevScene
}

const scenes = [
  {
    camera: {
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
  {
    camera: {
      position: {
        x: 12.4,
        y: 465,
        z: 9.8,
      },
      rotation: {
        x: -1.55,
        y: -0.03,
        z: -0.9,
      },
    },
  },
  {
    camera: {
      position: {
        x: 40,
        y: 60,
        z: 20,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
  {
    camera: {
      position: {
        x: 135,
        y: 55,
        z: 180,
      },
      rotation: {
        x: -0.2,
        y: 0.5,
        z: 0.1,
      },
    },
  },
  {
    camera: {
      position: {
        x: 92,
        y: 22,
        z: 50,
      },
      rotation: {
        x: -0.7,
        y: 1.2,
        z: 0.7,
      },
    },
  },
  {
    camera: {
      position: {
        x:-25,
        y: 330,
        z: -170,
      },
      rotation: {
        x: -2,
        y: 0,
        z: 3,
      },
    },
  },
]

const prevChanges = {
  camera: {
    rotation: { x: 0, y: 0, z: 0, },
    position: { x: 0, y: 0, z: 0, },
  },    

}

function setScene (pct) {
  // Object.keys(scenes[scene].camera).forEach(k => {
  //   console.log({ k })
  //   Object.keys(scenes[scene].camera[k]).forEach(x => {
  //     console.log(scenes[scene].camera[k][x])
  //     camera[k][x] = scenes[scene].camera[k][x]
  //   })
  // })
  console.log({pct})
  console.log('---------------')
  if (sections[activeScene]) {
    sections[activeScene - 1].style.color = `rgb(${255 * pct},0,0)`
  }
  if (!scenes[activeScene]) return
  console.log(`val for ActiveScene ${activeScene}`, scenes[activeScene].camera.position.x)
  console.log(`diff for ActiveScene ${activeScene}`,
    pct * (camera.position.z - scenes[activeScene].camera.position.z)
  )
  // console.log(`val for PrevScene ${prevScene}`, scenes[prevScene].camera.position.x)

  const diff = () => {
    const start = camera.position.x
  const end = scenes[activeScene].camera.position.x
    return start - end
  }

  const pctToUse = () => activeScroll >= prevScroll ? pct : 1 - pct
  camera.rotation.z -= prevChanges.camera.rotation.z
  camera.rotation.z += (pctToUse() * (scenes[activeScene].camera.rotation.z - camera.rotation.z))
  prevChanges.camera.rotation.z = (pctToUse() * (scenes[activeScene].camera.rotation.z - camera.rotation.z))

  camera.position.x -= prevChanges.camera.position.x
  camera.position.x += (pctToUse() * (scenes[activeScene].camera.position.x - camera.position.x))
  prevChanges.camera.position.x = (pctToUse() * (scenes[activeScene].camera.position.x - camera.position.x))

  camera.position.y -= prevChanges.camera.position.y
  camera.position.y += (pctToUse() * (scenes[activeScene].camera.position.y - camera.position.y))
  prevChanges.camera.position.y = (pctToUse() * (scenes[activeScene].camera.position.y - camera.position.y))

  camera.position.z -= prevChanges.camera.position.z
  camera.position.z += (pctToUse() * (scenes[activeScene].camera.position.z - camera.position.z))
  prevChanges.camera.position.z = (pctToUse() * (scenes[activeScene].camera.position.z - camera.position.z))

  camera.rotation.x -= prevChanges.camera.rotation.x
  camera.rotation.x += (pctToUse() * (scenes[activeScene].camera.rotation.x - camera.rotation.x))
  prevChanges.camera.rotation.x = (pctToUse() * (scenes[activeScene].camera.rotation.x - camera.rotation.x))

  camera.rotation.y -= prevChanges.camera.rotation.y
  camera.rotation.y += (pctToUse() * (scenes[activeScene].camera.rotation.y - camera.rotation.y))
  prevChanges.camera.rotation.y = (pctToUse() * (scenes[activeScene].camera.rotation.y - camera.rotation.y))


  dumpContent.prevChanges = prevChanges

}

function handleScroll(e) {
  prevScroll = activeScroll
  activeScroll = window.scrollY

  updateDump.scroll()
  updateDump.camera()

  sections.forEach((s, i) => {
    // updateDump.section(s, i)
    setActiveScene()
    const { top, height } = s.getBoundingClientRect()
    if (top < 0 && top > (0 - window.innerHeight)) {
      s.querySelector('h1').innerText = `Section ${i} is active: ${top}px`
      const pct = Math.sqrt(Math.pow((top / height), 2))
      console.log(pct)
      setScene(pct)
    }
  })
  dump()
}

function animate() {
  // controls.update()
  updateDump.camera()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  dump()
}

camera.position.x = scenes[1].camera.position.x
camera.position.y = scenes[1].camera.position.y
camera.position.z = scenes[1].camera.position.z

camera.rotation.x = scenes[1].camera.rotation.x
camera.rotation.y = scenes[1].camera.rotation.y
camera.rotation.z = scenes[1].camera.rotation.z

document.body.appendChild(renderer.domElement)
animate()
window.addEventListener('scroll', handleScroll)
