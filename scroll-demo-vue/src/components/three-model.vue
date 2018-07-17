<template>
  <div class="threeModel"></div>

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
    THREE.ImageUtils.crossOrigin = "anonymous"
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75, // view angle
      window.innerWidth / 2 / (window.innerHeight / 2), // ratio
      0.1, // ???
      10000 // ?? depth ??
    )

    // this.scene.add(this.cubeCamera)
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
    const mtlLoader = new THREE.MTLLoader()
    mtlLoader.setPath('static/island/')
    mtlLoader.load('material.mtl', material => {
      material.preload()
      const objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(material)
      objLoader.setPath('static/island_obj/')
      objLoader.load('model.obj', object => {
        this.model = object
        // this.model.traverse(child => {
        //   if (child instanceof THREE.Mesh) {
        //     child.castShadow = true
        //     child.receiveShadow = true
        //   }
        // })
        // this.model.castShadow = true
        // this.model.receiveShadow = true
        this.scene.add(this.model)

        this.model.position.x = 0
        this.model.position.y = 0
        this.model.position.z = 0

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

    this.camera.position.x = 0 // this.$root.content.scenes[2].camera.position.x
    this.camera.position.y = 0 // this.$root.content.scenes[2].camera.position.y
    this.camera.position.z = 100 // this.$root.content.scenes[2].camera.position.z
    this.camera.rotation.x = 0 // this.$root.content.scenes[2].camera.rotation.x
    this.camera.rotation.y = 0 // this.$root.content.scenes[2].camera.rotation.y
    this.camera.rotation.z = 0 // this.$root.content.scenes[2].camera.rotation.z

    this.init()
    this.animate()
    window.scene = this.scene
  },
}
</script>


<style scoped lang="sass">
@import index

</style>
