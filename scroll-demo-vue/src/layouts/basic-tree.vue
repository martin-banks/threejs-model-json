<template>
  <div>
    <h1>Tree</h1>
    <pre v-if="model">
      {{ JSON.stringify([model.rotation, model.position], 'utf-8', 2) }}
    </pre>
    <!-- <section-basic
      v-for="(part, i) in $root.content.parts"
      :key="`section-${i}`"
      :text="part"
      :index="i"
    /> -->

  </div>

</template>


<script>
import SectionBasic from '@/components/section-basic.vue'

export default {
  name: 'basic-tree',
  props: [],
  components: {
    SectionBasic,
  },
  data () {
    return {
      // prevScene: 0, // ! depricated
      activeScene: 1,
      prevScroll: 0,
      activeScroll: 0,
      scene: null,
      camera: null,
      renderer: null,
      model: null,
      // used to track and cancel previous updates in animations
      // updates are caculated from percent of total change.
      // so a constant baseline is required to transition from
      prevChanges: {
        camera: {
          rotation: { x: 0, y: 0, z: 0, },
          position: { x: 0, y: 0, z: 0, },
        },
      },
    }
  },

  methods: {
    init () {
      document.body.appendChild(this.renderer.domElement)
    },
    angle (degree) {
      return degree * (Math.PI / 180)
    },
    animate () {
      // console.log('animate')
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.animate)
    },
    sectActiveScene (x) {
      // expect content to emit it's index number whwn scrolling into target boundary
      // first detect direction of scroll
      if (this.activeScroll >= this.prevScroll) {
        // going down
        this.activeScene = x + 2
      } else {
        // going up
        this.activeScene = x + 1
      }
    },
  },

  computed: {},

  mounted () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, // view angle
      (window.innerWidth / 2) / (window.innerHeight / 2), // ratio
      0.1, // ???
      10000, // ?? depth ??
    )
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    console.log('window', window.innerWidth/2, window.innerHeight/2)
    this.renderer.setPixelRatio(window.devicePixels)
    this.renderer.setClearColor('#fff')
    this.renderer.setSize(window.innerWidth/2, window.innerHeight/2)



    // Add lights
    // const keyLight = new THREE.DirectionalLight('#330000', 0.3)
    // keyLight.position.set(0, 200, 1000)
    // this.scene.add(keyLight)

    const ambient = new THREE.AmbientLight('#ff0', 0.6) // soft white light
    this.scene.add(ambient)

    // const fillLight = new THREE.DirectionalLight('#fff', 1)
    // fillLight.position.set(100, 50, 100)
    // this.scene.add(fillLight)

    // const backLight = new THREE.DirectionalLight(0xffffff, 1)
    // backLight.position.set(-50, 0, -100).normalize()
    // this.scene.add(backLight)

    // const model = this.$root.content.model
    const mtlLoader = new THREE.MTLLoader()
    mtlLoader.setPath('static/tree/')
    mtlLoader.load('material.mtl', material => {
      material.preload()
      const objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(material)
      objLoader.setPath('static/tree/')
      objLoader.load('model.obj', object => {
        console.log({ object })
        this.model = object
        this.scene.add(this.model)

        this.model.position.x = 0
        this.model.position.y = 0
        this.model.position.z = 100

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.campingFactor = 0.25
        this.controls.enableZoom = true
      })
    })

    // const geometry = new THREE.BoxGeometry( 20, 20, 20 )
    // const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )

    // const mesh = new THREE.Mesh( geometry, material )
    // console.log({ mesh })
    // this.scene.add( mesh )


    // this.camera.position.x = 42 // this.$root.content.scenes[1].camera.position.x
    // this.camera.position.y = 22 // this.$root.content.scenes[1].camera.position.y
    this.camera.position.z = 100 // 42 // this.$root.content.scenes[1].camera.position.z

    // this.camera.rotation.x = this.angle(26) // this.$root.content.scenes[1].camera.rotation.x
    // this.camera.rotation.y = this.angle(42) // this.$root.content.scenes[1].camera.rotation.y
    // this.camera.rotation.z = this.angle(18) // this.$root.content.scenes[1].camera.rotation.z

    this.init()
    this.animate()
    window.scene = this.scene
  },
}
</script>


<style scoped lang="sass">
@import index



</style>
