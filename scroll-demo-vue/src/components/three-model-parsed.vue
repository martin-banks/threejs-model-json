<template>
    <div>
      <div class="threeModel"></div>
      <pre v-if="model">
        {{ JSON.stringify([camera.rotation, camera.position], 'utf-8', 2) }}
      </pre>

    </div>

</template>


<script>
export default {
  name: 'three-model',
  props: [],
  components: {},
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      model: null,
      parsedModel: null,
      mtl: null,
    }
  },
  methods: {
    init () {
      console.log(this.$el)
      this.$el.appendChild(this.renderer.domElement)
    },
    angle (degree) {
      return degree * (Math.PI / 180)
    },
    animate () {
      // console.log('animate')
      this.renderer.render(this.scene, this.camera)
      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
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
      window.innerWidth / 2 / (window.innerHeight / 2), // ratio
      0.1, // ???
      10000 // ?? depth ??
    )

    this.scene.add(this.cubeCamera)
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.renderer.setPixelRatio(window.devicePixels)
    this.renderer.setClearColor('#fff')
    this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)

    // Add lights
    // const keyLight = new THREE.DirectionalLight('#330000', 0.3)
    // keyLight.position.set(0, 200, 1000)
    // this.scene.add(keyLight)

    const ambient = new THREE.AmbientLight('#fff', 0.2) // soft white light
    this.scene.add(ambient)

    const fillLight = new THREE.DirectionalLight('#ccb', 0.95)
    fillLight.position.set(100, 50, 100)
    // fillLight.castShadow = true
    this.scene.add(fillLight)

    // const backLight = new THREE.DirectionalLight(0xffffff, 1)
    // backLight.position.set(-50, 0, -100).normalize()
    // this.scene.add(backLight)

    // const { model } = this.$root.content

    // const mtlLoader = new THREE.MTLLoader()
    // this.mtl = mtlLoader.parse(this.$root.content.mtl)
    // this.mtl.preload()
    // console.log('mtl', this.mtl)

    const objLoader = new THREE.OBJLoader()
    // objLoader.setMaterials(this.mtl)
    this.parsedModel = objLoader.parse(this.$root.content.modelTxt)
    this.scene.add(this.parsedModel)

    // const fbxLoader = new THREE.FBXLoader()
    // this.fbxModel = fbxLoader.parse(this.$root.content.pearfbx)

    this.parsedModel.position.x = 0
    this.parsedModel.position.y = -500
    this.parsedModel.position.z = 0

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.campingFactor = 0.25
    this.controls.enableZoom = true

    this.camera.position.x = 0 // this.$root.content.scenes[0].camera.position.x
    this.camera.position.y = 0 // this.$root.content.scenes[0].camera.position.y
    this.camera.position.z = 2000 // this.$root.content.scenes[0].camera.position.z
    this.camera.rotation.x = 0 // this.$root.content.scenes[0].camera.rotation.x
    this.camera.rotation.y = 0 // this.$root.content.scenes[0].camera.rotation.y
    this.camera.rotation.z = 0 // this.$root.content.scenes[0].camera.rotation.z

    this.init()
    this.animate()
    window.scene = this.scene
  },
}
</script>


<style scoped lang="sass">
@import index

</style>
