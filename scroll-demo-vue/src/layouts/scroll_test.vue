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
    <div class="dataOverlay">
      <div id="fpsmeter">
        <p>{{ Math.round(fps) }}fps</p>
        <div class="fpsHistory">
          <div
            v-for="(val, i) in fpsHistory"
            :key="`fps-${i}`"
            class="fpsHistory__notch"
            :style="{
              width: '10%',
              height: `${val / 60 * 100}%`
            }"
          ></div>
        </div>
      </div>
      <pre></pre>
    </div>
  </div>

</template>


<script>
import ScrollMagic from 'scrollmagic'
import { setTimeout } from 'timers';
export default {
  name: 'scroll-test',
  props: [],
  components: {},
  data () {
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
      coneCoords: [
        {
          theta: this.angle(30),
          phi: this.angle(55),
        },
        {
          theta: this.angle(20),
          phi: this.angle(50),
        },
        {
          theta: this.angle(45),
          phi: this.angle(280),
        },
        {
          theta: this.angle(90),
          phi: this.angle(300),
        },
      ],
      cameraPos: [
        { x: 0, y: 5, z: 40 },
        { x: -20, y: 0, z: 50 },
        { x: 20, y: 0, z: 50 },
        { x: -20, y: 0, z: 40 },
        { x: 20, y: 0, z: 20 },
        { x: -20, y: 0, z: 300 },
      ],
      currentPos: { x: 0, y: 0 },
      moon: {
        r: 10,
      },
      clickedObject: null,
      spinning: false,
      fps: 0,
      fpsHistory: [],
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
    const stats = new Stats()
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

    // Create 3D model instalnces
    // Starfield
    const starfield = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 10, 10),
      new THREE.MeshBasicMaterial({
        color: '#fff',
        map: new THREE.TextureLoader().load('static/backdrop/stars_milky_way_2k.jpg'),
        side: THREE.DoubleSide,
      })
    )
    starfield.scale.x = -1
    starfield.name = 'starfield'

    // Moon
    const moonTexture = new THREE.TextureLoader().load('static/moon/moon_2k.jpg')
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(this.moon.r, 300, 300),
      new THREE.MeshPhongMaterial({
        map: moonTexture,
        bumpMap: moonTexture,
        displacementMap: new THREE.TextureLoader().load('static/moon/material_normal.jpg'),
        displacementScale: 0.6,
        bumpScale: 0.1,
        shininess: 1,
      })
    )
    moon.name = 'moon'

    // Static points on moon surface
    // Each point consists of a wrapper and object
    // 
    const coneObjects =  this.coneCoords.map((coords, i) => {
      const wrapper = new THREE.Mesh(
        new THREE.BoxGeometry(0,0,0),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      wrapper.name = `coneWrapper_${i}`
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 5, 20),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      cone.name = `cone_${i}`

      wrapper.add(cone)

      // Make the cones sit on the surface and always point to the center
      wrapper.position.x = (this.moon.r * 1.2) * Math.cos(this.coneCoords[i].theta) * Math.sin(this.coneCoords[i].phi)
      wrapper.position.y = (this.moon.r * 1.2) * Math.sin(this.coneCoords[i].theta) * Math.sin(this.coneCoords[i].phi)
      wrapper.position.z = (this.moon.r * 1.2) * Math.cos(this.coneCoords[i].phi)
      cone.rotation.x = this.angle(270)

      const target_vec = new THREE.Vector3( 0, 1, 0 )
      const rotation_matrix = new THREE.Matrix4()
        .makeRotationX(this.angle(90))
        .makeRotationY( 0 )
        .makeRotationZ( this.coneCoords[0].theta )
        .lookAt( wrapper.position, target_vec, wrapper.up )
      wrapper.quaternion.setFromRotationMatrix(rotation_matrix)
      return wrapper
    })

    coneObjects.forEach(c => {
      moon.add(c)
    })

    const sateliteWrapper = new THREE.Mesh(
      new THREE.BoxGeometry(0, 0, 0),
      new THREE.MeshBasicMaterial()
    )

    const sateliteModel = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshPhongMaterial({
        color: '#0af',
      })
    )

    sateliteWrapper.add(sateliteModel)
    moon.add(sateliteWrapper)

    camera.position.x = this.cameraPos[0].x
    camera.position.y = this.cameraPos[0].y
    camera.position.z = this.cameraPos[0].z

    scene.add(camera)
    scene.add(lights.ambient)
    scene.add(lights.directional)
    scene.add(starfield)
    scene.add(moon)

    const dump = fps => {
      pre.innerText = JSON.stringify(
        {
          fps: Math.round(this.fps),
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
          satelite: {
            sateliteSpeed,
            sateliteDistance,
            sateliteOrbit,
          }
        },
        'utf-8',
        2
      )
    }


    // ! DO NOT STORE changable data in data/state
    // ! Significant performance issues
    // ? consider re-writing out side of vue
    let clicked = false
    let clickedObject = null

    // config options for satelite orbit
    let sateliteOrbit = 0
    const sateliteSpeed = 0.01
    const sateliteDistance = 2
    let sateliteSpin = 0


    let lastCalledTime = 1
    // let fps = 1
    let delta = 1
    let fpsCounter = 0

    // Animation loop
    const animate = () => {
      if(!lastCalledTime) {
        lastCalledTime = Date.now()
        this.fps = 0
        return
      }
      delta = (Date.now() - lastCalledTime)/1000
      lastCalledTime = Date.now()
      if (fpsCounter === 32) {
        this.fps = Math.min(1/delta, 60)
        fpsCounter = 0
      }
      this.fpsHistory.push(Math.min(1/delta, 60))
      if (this.fpsHistory.length > 100) this.fpsHistory.shift()
      fpsCounter++

      starfield.rotation.x += 0.0001
      starfield.rotation.y += 0.0001
      starfield.rotation.z += 0.000005

      // orbit satelite around moon.
      // change to using same position as pins to maintain same orientation
      sateliteWrapper.position.x = this.moon.r * sateliteDistance * Math.sin(sateliteOrbit)
      sateliteWrapper.position.y = this.moon.r * sateliteDistance * Math.cos(sateliteOrbit)
      if (sateliteOrbit >= this.angle(360)) {
        const offset = sateliteOrbit - this.angle(360)
        sateliteOrbit = offset
      }
      sateliteOrbit += sateliteSpeed

      const sateliteVector = new THREE.Vector3( 0, 1, 0 )
      const sateliteMatrix = new THREE.Matrix4()
        .lookAt(sateliteWrapper.position, sateliteVector, sateliteWrapper.up)
      sateliteWrapper.quaternion.setFromRotationMatrix(sateliteMatrix)

      sateliteModel.rotation.z = this.angle(sateliteSpin)
      sateliteSpin++

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
          // Change the values of all child objects in intersection paths
          // intersects.forEach(o => {
          //   console.log(o.distance)
          //   o.object.material.color.set('#0aa')
          // })
          clickedObject = intersects.sort((a, b) => {
            if (a.distance - b.distance) return -1
            if (b.distance - a.distance) return 1
            return 0
          })[0]
          clickedObject.object.material.color.set('#fa0')
        }
      }
      dump()
      if (useControls) {
        orbitControl.update()
      }
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
    }
    // end animation loop

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
    let resizeTimer = null
    window.addEventListener('resize', e => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }, 200)
    })
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


            // ! Updating values of DOM elements around screen
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

.dataOverlay
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

#fpsmeter
  // padding: 10px
  margin-bottom: 20px
  // border: solid 1px lime
  color: white
  p
    width: 100%
    text-align: right

.fpsHistory
  position: relative
  height: 50px
  display: flex
  border-top: solid 1px rgba(white, 0.6)

  &__notch
    flex: 1 1 auto
    display: inline-block
    border-top: solid 3px rgba(lime, 0.8)
    background: rgba(lime, 0.15)
    vertical-align: bottom
    align-self: flex-end

</style>
