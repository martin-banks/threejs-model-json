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
        <p>Current: {{ Math.round(fps) }}fps | Average: {{ Math.round(fpsHistory.reduce((a, b) => a + b, 0) / 100) }}</p>
        <div class="fpsHistory">
          <div
            v-for="(val, i) in fpsHistory"
            :key="`fps-${i}`"
            class="fpsHistory__notch"
            :style="styles__fpsBar(val)"
          ></div>
        </div>
      </div>
      <pre :style="styles__dump"></pre>
    </div>
  </div>

</template>


<script>
import ScrollMagic from 'scrollmagic'
import textureB64 from '@/content/moontexture'
import moontextureDisplacement from '@/content/moontexture_displacement'
import starsImg from '@/content/starfield'

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
          spin: true, // auto-rotate moon
          rotation: { // moon rotaion angle
            x: 0, y: 0, z: 0,
          },
          // x: 0, y: 0, // coords used to transition sample dom element
        },
        {
          spin: true,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          // x: 100, y: 50, // coords used to transition sample dom element
        },
        {
          spin: false,
          rotation: {
            x: 0, y: 2, z: 2,
          },
          // x: 300, y: 400, // coords used to transition sample dom element
        },
        {
          spin: false,
          rotation: {
            x: 1, y: 0.5, z: 1,
          },
          // x: 200, y: 500, // coords used to transition sample dom element
        },
        {
          spin: true,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          // x: 250, y: 20, // coords used to transition sample dom element
        },
        {
          spin: false,
          rotation: {
            x: 0, y: 0, z: 0,
          },
          // x: 0, y: 0, // coords used to transition sample dom element
        },
      ],

      // Angles used to position static pins
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
      // Coords to move camera for different sections
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
      fpsHistory: [... new Array(100)],
    }
  },
  methods: {
    angle(degree) {
      // convert degrees to radians
      return degree * (Math.PI / 180)
    },
    styles__fpsBar (val) {
      const color = opacity => `hsla(${(Math.max(val - 10, 0) / 60) * 150}, 100%, 50%, ${opacity})`
      return {
        width: '10%',
        height: `${val / 60 * 100}%`,
        background: color(0.4),
        borderTop: `solid 3px ${color(1)}`,
      }
    },
  },
  computed: {
    styles__dump () {
      return {
        display: window.location.hash === '#clear' ? 'none' : 'block'
      }
    }
  },
  mounted () {
    const sections = this.$el.querySelectorAll('section')
    const pre = this.$el.querySelector('pre')
    const controller = new ScrollMagic.Controller()

    // Create core 3D elements
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    // Renereder is the main instance required for rendereing 3D scene
    // renderer.render(scene, scene) must be called afer any property update
    renderer.setPixelRatio(window.devicePixels)
    renderer.setClearColor('#000')
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.$el.querySelector('.three').appendChild(renderer.domElement)


    // Check for url hash to determine if orbit controls are enabled
    // Orbit controls allow the scene to be manipulated through mouse input
    // click and drag - move camera around scene center
    //  scroll - zoom
    const useControls = window.location.hash.split('#')[1] === 'controls'
    const orbitControl = useControls ? new THREE.OrbitControls(camera) : null

    // Create lights reflective materials require lightsource to be visiible
    const lights = {
      // light that's everywhere on all surfaces - no shadows
      ambient: new THREE.AmbientLight('#fff', 0.1),
      // light from source pointing at scene - casts shadows
      directional: new THREE.DirectionalLight('#fff', 1),
    }
    lights.directional.position.y = 200
    lights.directional.position.z = 100

    // Create 3D model instalnces
    // Starfield - background image / texture
    const starfield = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 10, 10),
      new THREE.MeshBasicMaterial({
        color: '#fff',
        // map: new THREE.TextureLoader().load('static/backdrop/stars_milky_way_2k.jpg'),
        map: new THREE.TextureLoader().load(starsImg),
        side: THREE.DoubleSide,
      })
    )
    starfield.scale.x = -1 // negative scale turns it inside out (?)
    starfield.name = 'starfield'

    // Moon
    // const moonTexture = new THREE.TextureLoader().load('static/moon/moon_2k.jpg')
    const moonTexture = new THREE.TextureLoader().load(textureB64)
    const moonDisplacement = new THREE.TextureLoader().load(moontextureDisplacement)
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(this.moon.r, 300, 300),
      new THREE.MeshPhongMaterial({
        map: moonTexture,
        // map: new THREE.TextureLoader().load(textureB64),
        bumpMap: moonTexture,
        // displacementMap: new THREE.TextureLoader().load('static/moon/material_normal.jpg'),
        displacementMap: moonDisplacement,
        displacementScale: 0.2,
        bumpScale: 0.1,
        shininess: 1,
      })
    )
    moon.name = 'moon'

    // Static points on moon surface
    // Each point consists of a wrapper and object
    // the wrapper is positioned and oriented to the center of the moon
    // the model can then be easily manipulated inside the wrapper
    const coneObjects =  this.coneCoords.map((coords, i) => {
      const wrapper = new THREE.Mesh(
        new THREE.BoxGeometry(0,0,0),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      wrapper.name = `coneWrapper_${i}`
      const cone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 5, 32),
        new THREE.MeshPhongMaterial({
          color: '#fff',
        })
      )
      cone.name = `cone_${i}`

      const pinHead = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        new THREE.MeshPhongMaterial({
          coolor: '#fff',
        })
      )
      pinHead.position.set(0, -3, 0)
      cone.add(pinHead)
      wrapper.add(cone)

      // Make the cones sit on the surface and always point to the center
      wrapper.position.x = (this.moon.r * 1.2) * Math.cos(this.coneCoords[i].theta) * Math.sin(this.coneCoords[i].phi)
      wrapper.position.y = (this.moon.r * 1.2) * Math.sin(this.coneCoords[i].theta) * Math.sin(this.coneCoords[i].phi)
      wrapper.position.z = (this.moon.r * 1.2) * Math.cos(this.coneCoords[i].phi)
      cone.rotation.x = this.angle(270)

      const coneWrapperVector = new THREE.Vector3(0, 1, 0)
      const coneWrapperMatrix = new THREE.Matrix4()
        .makeRotationX(this.angle(90))
        .makeRotationY( 0 )
        .makeRotationZ( this.coneCoords[0].theta )
        .lookAt( wrapper.position, coneWrapperVector, wrapper.up )
      wrapper.quaternion.setFromRotationMatrix(coneWrapperMatrix)
      return wrapper
    })

    coneObjects.forEach(c => {
      moon.add(c)
    })

    const sateliteWrapper = new THREE.Mesh(
      new THREE.BoxGeometry(0, 0, 0),
      new THREE.MeshBasicMaterial()
    )
    sateliteWrapper.name = 'satelite_wrapper'

    const sateliteModel = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshPhongMaterial({
        color: '#0af',
      })
    )
    sateliteModel.name = 'satelite_model'

    sateliteWrapper.add(sateliteModel)
    moon.add(sateliteWrapper)


    // Set initial cacmera position
    camera.position.x = this.cameraPos[0].x
    camera.position.y = this.cameraPos[0].y
    camera.position.z = this.cameraPos[0].z

    // Add everything to the scene
    // the moon child elements have been added to the moon as they were created
    // more than on model can be added to the scene
    scene.add(camera)
    scene.add(lights.ambient)
    scene.add(lights.directional)
    scene.add(starfield)
    scene.add(moon)

    // early dev function - dumps various stats into a target wrapper in the dom
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
      // This function updates values of the model and it's children and re-renders the scene 
      // on every available animation frame
      // display custom fps meter on screen
      if(!lastCalledTime) {
        lastCalledTime = Date.now()
        this.fps = 0
        return
      }
      delta = (Date.now() - lastCalledTime) / 1000
      lastCalledTime = Date.now()
      if (fpsCounter === 16) {
        this.fps = Math.min(1 / delta, 60)
        fpsCounter = 0
      }
      this.fpsHistory.push(Math.min(1 / delta, 60))
      if (this.fpsHistory.length > 100) this.fpsHistory.shift()
      fpsCounter++

      // rotote starfield background on each tick
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

      // orient the satelite wrapper to point at the center of the moon
      // Unlike the pins this must be called on each tick of animation as it orbits the moon
      const sateliteVector = new THREE.Vector3( 0, 1, 0 )
      const sateliteMatrix = new THREE.Matrix4()
        .lookAt(sateliteWrapper.position, sateliteVector, sateliteWrapper.up)
      sateliteWrapper.quaternion.setFromRotationMatrix(sateliteMatrix)

      // Adds auto spin to the satelite model
      // because the model is a child of wrapper, and the wrapper is being orbitinted and oriented to the moon
      // adding spin is simple as it doesn't need to condier these other transforms
      sateliteModel.rotation.z = this.angle(sateliteSpin)
      sateliteSpin++


      // Some scenes require the moon to be static, others to spin in place
      // find the boolean in the scene data with the active scene index and act accordingly
      if (this.scenes[this.active || 0].spin) {
        // Reset the spin to 0 if has completed more than one rotation
        // Otherwise rotating to target angle will have to rewind all rotations
        if (moon.rotation.y >= this.angle(360)) {
          const offset = moon.rotation.y - this.angle(360)
          moon.rotation.y = offset
        }
        moon.rotation.y += 0.003
      }

      // Raycaster is used to detect what elements the mouse intersects with; this can be used for user interaction
      // As the model is animating we need to update it on each tick
      raycaster.setFromCamera(mouse, camera)

      // The first argument is the parent object to observe (this will not be returned as part of the results)
      // an array of child objects will be returned
      // The boolean dictates if it should behave recursively through all children, childrens-children etc
      const intersects = raycaster.intersectObjects(moon.children, true)

      // TODO -- refactor into click event listener
      // In this example we want to change the color of the object clicked on...
      if (intersects.length) {
        if (clicked) {
          clicked = false
          // first check if there is an object that was previously clicked and reset to white
          if (clickedObject) {
            clickedObject.object.material.color.set('#fff')
          }
          // Sort the children array by distance from camera (nearest first)
          // Store the first instance as the active object, then change it's color
          clickedObject = intersects.sort((a, b) => {
            if (a.distance - b.distance) return -1
            if (b.distance - a.distance) return 1
            return 0
          })[0]
          clickedObject.object.material.color.set('#fa0')
        }
      }

      // add dump info the dom
      dump()

      // if use controls have has been detected then update
      if (useControls) {
        orbitControl.update()
      }

      // All hte set up is done, render to updated scene to the dom
      renderer.render(scene, camera)

      // Call this function again (recursively) on next available animation frame
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

    // Add event listeners
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


    // Call first animation
    window.requestAnimationFrame(animate)


    // Scroll magic stuff
    // http://scrollmagic.io/docs/index.html
    // Setup a scrollmagic instance for each section
    sections.forEach((s, i) => {
      new ScrollMagic.Scene({
        triggerElement: s,
        // the duration is measured in pixels - here the height of each section
        duration: s.offsetHeight,
      })
        .on('enter', e => {
          // when a new section scrolls into the active poisiton
          this.active = i
        })
        .on('progress', e => { // as the user scrolls ...
          // if this section is the active section; do something
          if (this.active === i) {
            // s.querySelector('h2').innerText = `progress ${e.progress} \n ${e.scrollDirection}`
            // store the direction user is scrolling: 'FORWARD' || 'BACKWARD'
            this.direction = e.scrollDirection

            // Store how far through the section they are for use in calculating the transforms
            const pct = e.progress

            // what section are we scrolling out of, this will change depending on direction
            // get the next/previous in the scene sequence depending on FORAWRD / BACKWARD
            const cameraFrom = this.cameraPos[e.direction === 'FORWARD' ? ((i + 1) + 1) : ((i + 1) - 1)]
            // The current section is offset by one so we have secene options to use before we hit the first section
            const cameraTo = this.cameraPos[(i + 1)]

            // To calculate new coords for camera:
            // * end value of previous scene + progress pct * difference between current and next
            const newCamera = {
              x: cameraFrom.x + pct * (cameraTo.x - cameraFrom.x),
              y: cameraFrom.y + pct * (cameraTo.y - cameraFrom.y),
              z: cameraFrom.z + pct * (cameraTo.z - cameraFrom.z),
            }
            // set new values
            camera.position.x = newCamera.x
            camera.position.y = newCamera.y
            camera.position.z = newCamera.z

            // this.spinning is a boolean that records if this animation is running
            // required to prevent this running multiple times
            // It will stop hte auto rotate
            // get the new rotation values
            // caluclate difference to current spin
            // and rotate to those values in linear animation
            if (!this.spinning && !this.scenes[this.active].spin) {
              this.spinning = true
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
                  // still animation to do
                  window.requestAnimationFrame(rotateToTarget)
                } else {
                  // animation all done
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
  color: white
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
  z-index: -1

.dataOverlay
  display: block
  position: fixed
  top: 0
  left: 0
  background: rgba(black, 0.6)
  color: lime
  width: 300px
  max-height: 100vh
  padding: 20px
  padding-top: 50px
  overflow: auto
  border: solid 1px rgba(white, 0.2)
  *
    text-shadow: none
    font-size: 14px
    line-height: 1.3

#fpsmeter
  margin-bottom: 20px
  color: white
  p
    width: 100%
    text-align: right
    color: #888

.fpsHistory
  position: relative
  height: 50px
  display: flex
  border-top: solid 1px rgba(white, 0.6)

  &__notch
    flex: 1 1 auto
    display: inline-block
    border-top: solid 3px rgba(lime, 0.8)
    // background: rgba(lime, 0.15)
    vertical-align: bottom
    align-self: flex-end

</style>
