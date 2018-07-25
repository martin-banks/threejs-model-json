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
      coords: [
        { x: 0, y: 0 },
        { x: 100, y: 50 },
        { x: 300, y: 400 },
        { x: 200, y: 500 },
        { x: 250, y: 20 },
        { x: 0, y: 0 },
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
      ambient: new THREE.AmbientLight('#fff', 0.3),
      directional: new THREE.DirectionalLight('#fff', 1),
    }

    lights.directional.position.y = 200
    lights.directional.position.z = 100

    const geometry = new THREE.SphereGeometry(this.moon.r, 300, 300)
    const texture = new THREE.TextureLoader().load('static/moon/moon_2k.jpg')
    const material = new THREE.MeshPhongMaterial({
      // color: '#f00',
      map: texture,
      bumpMap: texture,
      displacementMap: new THREE.TextureLoader().load('static/moon/material_normal.jpg'),
      displacementScale: 0.6,
      bumpScale: 0.1,
      shininess: 1,
    })
    const moon = new THREE.Mesh(geometry, material)


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
      const wrapper = new THREE.Mesh()
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

    // camera.position.z = 20
    scene.add(camera)
    scene.add(lights.ambient)
    scene.add(lights.directional)
    scene.add(moon)

    const dump = () => {
      pre.innerText = JSON.stringify(
        {
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
    const animate = () => {
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
      moon.rotation.y += 0.005
      if (useControls) {
        dump()
        orbitControl.update()
      }
    }
    animate()

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
            const moveTo = this.coords[i + 1]
            const moveFrom = this.coords[e.direction === 'FORWARD' ? i + 1 + 1 : i + 1 - 1]
            const newCoords = {
              x: moveFrom.x + pct * (moveTo.x - moveFrom.x),
              y: moveFrom.y + pct * (moveTo.y - moveFrom.y),
            }

            const cameraFrom = this.cameraPos[e.direction === 'FORWARD' ? i + 1 + 1 : i + 1 - 1]
            const cameraTo = this.cameraPos[i + 1]
            const newCamera = {
              x: cameraFrom.x + pct * (cameraTo.x - cameraFrom.x),
              y: cameraFrom.y + pct * (cameraTo.y - cameraFrom.y),
              z: cameraFrom.z + pct * (cameraTo.z - cameraFrom.z),
            }

            this.$el.querySelectorAll('section').forEach((s, index) => {
              // s.style.borderColor = i === index ? '#bada55' : ''
              s.style.transform = i === index ? 'scale(1.2)' : 'scale(0.2)'
            })
            // this.$el.querySelector('.box').style.transform = `translate(${newCoords.x}%, ${newCoords.y}%)`
            camera.position.x = newCamera.x
            camera.position.y = newCamera.y
            camera.position.z = newCamera.z
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
