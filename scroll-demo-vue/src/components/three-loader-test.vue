<template>
  <div class="threeModel"></div>

</template>


<script>
export default {
  name: 'three-loader-test',
  props: [
    'pct',
    'cameray',
    'rotation',
    'cameraupdate',
    'activeindex',
  ],
  components: {},
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      model: null,

      prevScroll: window.scrollY,
      activeScroll: window.scrollY,

      prevChanges: {
        camera: {
          rotation: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 },
        },
      },
    }
  },
  methods: {
    init () {
      this.$el.appendChild(this.renderer.domElement)
    },
    angle (degree) {
      return degree * (Math.PI / 180)
    },
    animate () {
      // this.model.rotation.y += 0.005
      // if (this.pct > 0.01) {
      //   this.$el.style.opacity = 1
      // } else {
      //   this.$el.style.opacity = 0.5

      // }

      // this.model.rotation.y = this.angle(this.rotation.y)

      // this.camera.position.x = this.cameraupdate.position.x // this.$root.content.scenes[2].camera.position.x
      // this.camera.position.y = this.cameraupdate.position.y // this.$root.content.scenes[2].camera.position.y
      // this.camera.position.z = this.cameraupdate.position.z // this.$root.content.scenes[2].camera.position.z
      // this.camera.rotation.x = this.cameraupdate.rotation.x // this.$root.content.scenes[2].camera.rotation.x
      // this.camera.rotation.y = this.cameraupdate.rotation.y // this.$root.content.scenes[2].camera.rotation.y
      // this.camera.rotation.z = this.cameraupdate.rotation.z // this.$root.content.scenes[2].camera.rotation.z
      
      // this.camera.position.x = this.$root.content.scenes[this.activeindex || 0].camera.position.x
      // this.camera.position.y = this.$root.content.scenes[this.activeindex || 0].camera.position.y
      // this.camera.position.z = this.$root.content.scenes[this.activeindex || 0].camera.position.z
      // this.camera.rotation.x = this.$root.content.scenes[this.activeindex || 0].camera.rotation.x
      // this.camera.rotation.y = this.$root.content.scenes[this.activeindex || 0].camera.rotation.y
      // this.camera.rotation.z = this.$root.content.scenes[this.activeindex || 0].camera.rotation.z


      


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
      window.innerWidth / (window.innerHeight), // ratio
      0.1, // ???
      10000 // ?? depth ??
    )


    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.renderer.setPixelRatio(window.devicePixels)
    this.renderer.setClearColor('#fff')
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Add lights
    // const keyLight = new THREE.DirectionalLight('#330000', 0.3)
    // keyLight.position.set(0, 200, 1000)
    // this.scene.add(keyLight)

    const ambient = new THREE.AmbientLight('#fff', 0.3) // soft white light
    this.scene.add(ambient)

    const light = new THREE.DirectionalLight('#ccb', 0.95)
    light.position.set(100, 200, 100)
    light.shadowMapWidth = 512
    light.shadowMapHeight = 512
    // light.castShadow = true
    this.scene.add(light)
    // light.shadow.mapSize.width = 512;  // default
    // light.shadow.mapSize.height = 512; // default
    // light.shadow.camera.near = 0.5;       // default
    // light.shadow.camera.far = 500      // default

    // const backLight = new THREE.DirectionalLight(0xffffff, 1)
    // backLight.position.set(-50, 0, -100).normalize()
    // this.scene.add(backLight)

    // Create a helper for the shadow camera (optional)
    var helper = new THREE.CameraHelper(light.shadow.camera)
    this.scene.add(helper)

    const mtlLoader = new THREE.MTLLoader()
    mtlLoader.setPath('static/test_model/')
    const inlineMaterial = mtlLoader.parse(this.$root.content.material)
    inlineMaterial.crossOrigin = 'anonymous'
    inlineMaterial.preload()
    const objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(inlineMaterial)
    this.model = objLoader.parse(this.$root.content.model)

    console.log({ inlineMaterial })

    // mtlLoader.load('Martin_test_1.mtl', material => {
    //   material.preload()

    //   // objLoader.setMaterials(material)
    //   // objLoader.setPath('static/test_model/')
    //   // objLoader.load('Martin_test_1.obj', object => {
    //   //   this.model = object
    //   //   this.model.castShadow = true
    //   //   this.model.receiveShadow = true
    //   //   this.model.traverse(child => {
    //   //     child.castShadow = true
    //   //     child.receiveShadow = true
    //   //   })
    //   // })
    // })

    // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.enableDamping = true
    // this.controls.campingFactor = 0.25
    // this.controls.enableZoom = true

    

    this.scene.add(this.model)
    this.init()
    this.animate()
    window.scene = this.scene

    window.addEventListener('scroll', () => {
      const scene = this.$root.content.scenes[this.activeindex || 0]

      // this.camera.position.x -= this.prevChanges.camera.position.x
      // this.camera.position.y -= this.prevChanges.camera.position.y
      // this.camera.position.z -= this.prevChanges.camera.position.z

      const changes = {
        rotation: {},
        position: {
          x: (this.pct * (scene.camera.position.x - this.camera.position.x)),
          y: (this.pct * (scene.camera.position.y - this.camera.position.y)),
          z: (this.pct * (scene.camera.position.z - this.camera.position.z)),
        }
      }
      // console.log({ changes })
      this.camera.position.x -= this.prevChanges.camera.position.x 
      this.camera.position.x += changes.position.x
      this.prevChanges.camera.position.x = changes.position.x

      this.camera.position.y -= this.prevChanges.camera.position.y
      this.camera.position.y += changes.position.y
      this.prevChanges.camera.position.y = changes.position.y

      this.camera.position.z -= this.prevChanges.camera.position.z
      this.camera.position.z += changes.position.z
      this.prevChanges.camera.position.z = changes.position.z




      this.camera.rotation.x -= this.prevChanges.camera.rotation.x
      this.camera.rotation.x += (this.pct * (scene.camera.rotation.x - this.camera.rotation.x))
      this.prevChanges.camera.rotation.x = (this.pct * (scene.camera.rotation.x - this.camera.rotation.x))

      this.camera.rotation.y -= this.prevChanges.camera.rotation.y
      this.camera.rotation.y += (this.pct * (scene.camera.rotation.y - this.camera.rotation.y))
      this.prevChanges.camera.rotation.y = (this.pct * (scene.camera.rotation.y - this.camera.rotation.y))
      
      this.camera.rotation.z -= this.prevChanges.camera.rotation.z
      this.camera.rotation.z += (this.pct * (scene.camera.rotation.z - this.camera.rotation.z))
      this.prevChanges.camera.rotation.z = (this.pct * (scene.camera.rotation.z - this.camera.rotation.z))
    })

  },

}
</script>


<style scoped lang="sass">
@import index

.threeModel
  position: fixed
  top: 0
  left: 0
  z-index: -1
  opacity: 0.5
  transition: opacity 300ms

</style>
