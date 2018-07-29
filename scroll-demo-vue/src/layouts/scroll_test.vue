<template>
  <div>
    <div class="three"></div>
    <div class="box"></div>
    <section
      v-for="(s, i) in 5"
      :key="`section${i}`"
    >
      <div class="inner">
        <h2>Section {{ i }} title</h2>
        <p>Nulla aute amet non enim magna elit laboris Lorem nulla reprehenderit anim. Enim sint id esse magna ut ea veniam excepteur anim ut reprehenderit nostrud. Minim dolore ipsum anim labore sint pariatur veniam aute aute. Do ullamco ipsum eu nulla dolor proident ullamco incididunt id dolore. Tempor ex exercitation laborum do anim esse laboris. Fugiat amet eu aliquip enim laborum reprehenderit aliquip fugiat duis.</p>
      </div>
    </section>
    <pre></pre>
  </div>

</template>


<script>
import ScrollMagic from 'scrollmagic'
export default {
  name: 'scroll-test',
  props: [],
  components: {},
  data() {
    return {
      active: null,
      direction: null,
      scenes: [
        {
          spin: true,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          x: 0, y: 0,
        },
        {
          spin: true,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          x: 100, y: 50,
        },
        {
          spin: false,
          rotation: {
            x: 0, y: 2, z: 2,
          },
          x: 300, y: 400,
        },
        {
          spin: false,
          rotation: {
            x: 1, y: 0.5, z: 1,
          },
          x: 200, y: 500,
        },
        {
          spin: true,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          x: 250, y: 20,
        },
        {
          spin: false,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          x: 0, y: 0,
        },
      ],
      cameraPos: [
        {
          spin: true,
          x: 0, y: 5, z: 40
        },
        {
          spin: true, 
          x: -20, y: 0, z: 50
        },
        {
          spin: false,
          x: 20, y: 0, z: 50
        },
        {
          spin: false,
          x: -20, y: 0, z: 40
        },
        {
          spin: true,
          x: 20, y: 0, z: 20
        },
        {
          spin: true,
          x: -20, y: 0, z: 300
        },
      ],
      currentPos: { x: 0, y: 0 },
      moon: {
        r: 10,
      },
      clickedObject: null,
      spinning: false,
    }
  },
  methods: {
    angle(degree) {
      // convert degrees to radians
      return degree * (Math.PI / 180)
    },
  },
  computed: {},
  mounted() {
    const controller = new ScrollMagic.Controller()
    const sections = this.$el.querySelectorAll('section')
    const pre = this.$el.querySelector('pre')

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixels)
    renderer.setClearColor('#000')
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.$el.querySelector('.three').appendChild(renderer.domElement)

    const useControls = window.location.hash.split('#')[1] === 'controls'
    const orbitControl = useControls ? new THREE.OrbitControls(camera) : null
    const lights = {
      ambient: new THREE.AmbientLight('#fff', 0.15),
      directional: new THREE.DirectionalLight('#fff', 1),
    }

    lights.directional.position.y = 200
    lights.directional.position.z = 100

    const geometry = new THREE.SphereGeometry(this.moon.r, 300, 300)
    const texture = new THREE.TextureLoader().load('static/moon/moon_2k.jpg')
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: texture,
      displacementMap: new THREE.TextureLoader().load('static/moon/material_normal.jpg'),
      displacementScale: 0.6,
      bumpScale: 0.1,
      shininess: 1,
    })
    const backdrop = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 10, 10),
      new THREE.MeshBasicMaterial({
        color: '#fff',
        map: new THREE.TextureLoader().load('static/backdrop/stars_milky_way_2k.jpg'),
        side: THREE.DoubleSide,
      })
    )
    backdrop.scale.x = -1

    const moon = new THREE.Mesh(geometry, material)
    moon.name = 'moon'

    const coneCoords = [
      {
        theta: this.angle(10),
        phi: this.angle(90),
      },
      {
        theta: this.angle(200),
        phi: this.angle(30),
      },
      {
        theta: this.angle(45),
        phi: this.angle(280),
      },
      {
        theta: this.angle(300),
        phi: this.angle(180),
      },
    ]

    const coneObjects =  coneCoords.map((coords, i) => {
      const wrapper = new THREE.Mesh(
        new THREE.BoxGeometry(0,0,0),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1, 3, 30),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      wrapper.add(cone)
      wrapper.position.x = (this.moon.r * 1.2) * Math.cos(coneCoords[i].theta) * Math.sin(coneCoords[i].phi)
      wrapper.position.y = (this.moon.r * 1.2) * Math.sin(coneCoords[i].theta) * Math.sin(coneCoords[i].phi)
      wrapper.position.z = (this.moon.r * 1.2) * Math.cos(coneCoords[i].phi)
      cone.rotation.x = this.angle(270)

      const target_vec = new THREE.Vector3( 0, 1, 0 )
      const rotation_matrix = new THREE.Matrix4()
        .makeRotationX(this.angle(90))
        .makeRotationY( 0 )
        .makeRotationZ( coneCoords[0].theta )
        .lookAt( wrapper.position, target_vec, wrapper.up )
      wrapper.quaternion.setFromRotationMatrix(rotation_matrix)
      return wrapper
    })

    coneObjects.forEach(c => {
      moon.add(c)
    })

    camera.position.x = this.cameraPos[0].x
    camera.position.y = this.cameraPos[0].y
    camera.position.z = this.cameraPos[0].z


    scene.add(camera)
    scene.add(lights.ambient)
    scene.add(lights.directional)
    scene.add(backdrop)
    scene.add(moon)

    const dump = () => {
      pre.innerText = JSON.stringify(
        {
          active: this.active,
          moon: {
            rotation: {
              x: moon.rotation.x,
              y: moon.rotation.y,
              z: moon.rotation.z,
            },
            position: {
              x: moon.position.x,
              y: moon.position.y,
              z: moon.position.z,
            },
          },
          camera: {
            position: {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z,
            },
            rotation: {
              x: camera.rotation.x,
              y: camera.rotation.y,
              z: camera.rotation.z,
            },
          },
        },
        'utf-8',
        2
      )
    }


    // ! DO NOT STORE changable data in data/state
    // ! Significant performance issues
    // ! consider re-writing out side of vue
    let clicked = false
    let clickedObject = null
    // Animation loop
    const animate = () => {
      window.requestAnimationFrame(animate)
      backdrop.rotation.x += 0.0001
      backdrop.rotation.y += 0.0001
      backdrop.rotation.z += 0.000005
      if (this.scenes[this.active || 0].spin) {
        // Reset the spin to 0 if has completed more than one rotation
        // Otherwise rotating to target angle will have to rewind all rotations
        if (moon.rotation.y >= this.angle(360)) {
          const offset = moon.rotation.y - this.angle(360)
          moon.rotation.y = offset
        }
        moon.rotation.y += 0.003
      }
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(moon.children, true)
      if (intersects.length) {
        if (clicked) {
          clicked = false
          // console.log({ intersects })
          if (clickedObject) {
            clickedObject.object.material.color.set('#fff')
          }
          // intersects.forEach(o => {
          //   console.log(o.distance)
          //   o.object.material.color.set('#0aa')
          // })
          clickedObject = intersects.sort((a, b) => {
            if (a.distance - b.distance) return -1
            if (b.distance - a.distance) return 1
            return 0
          })[0]
          clickedObject.object.material.color.set('#f00')
        }
      }
      dump()
      if (useControls) {
        orbitControl.update()
      }
      renderer.render(scene, camera)
    }

    const handleMouseMove = e => {
      // calculate position as percentage of screen width / height
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = 0 - (e.clientY / window.innerHeight) * 2 + 1
    }
    const handleMouseClick = e => {
      clicked = true
    }


    window.addEventListener('click', handleMouseClick, false)
    window.addEventListener('click', handleMouseMove, false)
    console.log(moon)

    setTimeout(() => {
      window.requestAnimationFrame(animate)
    }, 1000)

    // Scroll magic stuff
    sections.forEach((s, i) => {
      new ScrollMagic.Scene({
        triggerElement: s,
        duration: s.offsetHeight,
      })
        .on('enter', e => {
          this.active = i
        })
        .on('progress', e => {
          if (this.active === i) {
            // s.querySelector('h2').innerText = `progress ${e.progress} \n ${e.scrollDirection}`
            this.direction = e.scrollDirection

            const pct = e.progress
            const cameraFrom = this.cameraPos[e.direction === 'FORWARD' ? (i + 1 + 1) : (i + 1 - 1)]
            const cameraTo = this.cameraPos[i + 1]
            const newCamera = {
              x: cameraFrom.x + pct * (cameraTo.x - cameraFrom.x),
              y: cameraFrom.y + pct * (cameraTo.y - cameraFrom.y),
              z: cameraFrom.z + pct * (cameraTo.z - cameraFrom.z),
            }
            camera.position.x = newCamera.x
            camera.position.y = newCamera.y
            camera.position.z = newCamera.z

            if (!this.spinning && !this.scenes[this.active].spin) {
              this.spinning = true
              console.log('spin to fixed')
              let ticks = 0
              const increment = 100
              const rotationFrom = moon.rotation
              const rotationTo = this.scenes[i + 1].rotation
              const newRotation = {
                x: (rotationTo.x - rotationFrom.x) / increment,
                y: (rotationTo.y - rotationFrom.y) / increment,
                z: (rotationTo.z - rotationFrom.z) / increment,
              }

              const rotateToTarget = () => {
                // console.log('applying change')
                moon.rotation.x += newRotation.x
                moon.rotation.y += newRotation.y
                moon.rotation.z += newRotation.z
                ticks++
                if (ticks < increment) {
                  window.requestAnimationFrame(rotateToTarget)
                } else {
                  this.spinning = false
                }
              }
              rotateToTarget()
            }

            // const moveTo = this.scenes[i + 1]
            // const moveFrom = this.scenes[e.direction === 'FORWARD' ? i + 1 + 1 : i + 1 - 1]
            // const newCoords = {
            //   x: moveFrom.x + pct * (moveTo.x - moveFrom.x),
            //   y: moveFrom.y + pct * (moveTo.y - moveFrom.y),
            // }
            // this.$el.querySelectorAll('section').forEach((s, index) => {
              //   // s.style.borderColor = i === index ? '#bada55' : ''
            // ! Don't rely on CSS transitions
            // ! has janky animations
            //   s.style.transform = i === index ? 'scale(1.2)' : 'scale(0.2)'
            // })
            // this.$el.querySelector('.box').style.transform = `translate(${newCoords.x}%, ${newCoords.y}%)`
          }
        })
        .addTo(controller)
    })
  },
}
</script>


<style scoped lang="sass">
@import index

section
  transition: transform 300ms
  height: 80vh
  // border: solid 10px #333
  color: white
  // background: rgba(white, 0.2)
  h2
    margin: 0
    margin-bottom: 24px
  p
    background: none
    margin: 0

.inner
  top: 50%
  background: rgba(black, 0.4)
  bottom: 0
  padding: 20px
  max-width: 400px

section:nth-of-type(even)
  .inner
    left: 100%
    transform: translate(-100%, 0)


.box
  position: fixed
  top: 0
  left: 0
  width: 200px
  height: 200px
  background: orange
  opacity: 0

.three
  position: fixed
  top: 0
  left: 0
  // z-index: 999999999999

pre
  display: block
  position: fixed
  top: 0
  left: 0
  background: rgba(black, 0.6)
  color: lime
  width: 300px
  height: 50vh
  padding: 20px
  overflow: auto

</style>
