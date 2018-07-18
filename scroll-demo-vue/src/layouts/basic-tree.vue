<template>
  <div>
    <three-model
      :pct="activePct"
      :rotation="rotation"
      :cameraupdate="camera"
      :activeindex="activeScene"
    />
    <h1>3d demo</h1>
    <section-basic
      v-for="(part, i) in $root.content.parts"
      :id="`section-${i}`"
      class="threesection"
      :key="`section-${i}`"
      :text="part"
      :index="i"
      @activeindex="setActive"
      @activepct="setActivePct"

    />

  </div>

</template>


<script>
import SectionBasic from '@/components/section-basic.vue'
// import ThreeModel from '@/components/three-model.vue'
// import ThreeModel from '@/components/three-model-parsed.vue'
// import ThreeModel from '@/components/three-model-gltf.vue'
import ThreeModel from '@/components/three-loader-test.vue'

export default {
  name: 'basic-tree',
  props: [],
  components: {
    SectionBasic,
    ThreeModel,
  },
  data () {
    return {
      // prevScene: 0, // ! depricated
      activeScene: false,
      activePct: 0,
      prevScroll: 0,
      activeScroll: 0,
      animate: false,

      camera: {
        rotation: {
          x: this.$root.content.scenes[this.activeScene || 0].camera.rotation.x,
          y: this.$root.content.scenes[this.activeScene || 0].camera.rotation.y,
          z: this.$root.content.scenes[this.activeScene || 0].camera.rotation.z,
        },
        position: {
          x: this.$root.content.scenes[this.activeScene || 0].camera.position.x,
          y: this.$root.content.scenes[this.activeScene || 0].camera.position.y,
          z: this.$root.content.scenes[this.activeScene || 0].camera.position.z,
        },
      },
      rotation: {
        y: 0,
      },

      content: {
        height: 1,
        start: 1,
      },
      pct: 0,
      // used to track and cancel previous updates in animations
      // updates are caculated from percent of total change.
      // so a constant baseline is required to transition from
      prevChanges: {
        camera: {
          rotation: { x: 0, y: 0, z: 0 },
          position: { x: 0, y: 0, z: 0 },
        },
      },
    }
  },

  methods: {
    setActive (i) {
      if (window.scrollY >= this.prevScroll) {
        this.activeScene = i 
      } else {
        this.activeScene = i + 1
      }
      // this.prevChanges.camera = {
      //   rotation: {
      //     x: this.camera.rotation.x,
      //     y: this.camera.rotation.y,
      //     z: this.camera.rotation.z,
      //   },
      //   position: {
      //     x: this.camera.position.x,
      //     y: this.camera.position.y,
      //     z: this.camera.position.z,
      //   },
      // }

      // first remove previous change amount
      // calculate difference of current position to target
      // calculate percentage of difference
      // apply pct of diff
      // store new value in prevChanges

      // this.camera = {
      //   rotation: {
      //     x: (this.$root.content.scenes[this.activeScene || 0].camera.rotation.x * this.activePct),
      //     y: (this.$root.content.scenes[this.activeScene || 0].camera.rotation.y * this.activePct),
      //     z: (this.$root.content.scenes[this.activeScene || 0].camera.rotation.z * this.activePct),
      //   },
      //   position: {
      //     x: (this.$root.content.scenes[this.activeScene || 0].camera.position.x * this.activePct),
      //     y: (this.$root.content.scenes[this.activeScene || 0].camera.position.y * this.activePct),
      //     z: (this.$root.content.scenes[this.activeScene || 0].camera.position.z * this.activePct),
      //   },
      // }
    },
    setActivePct (pct) {
      const complete = Math.sqrt(Math.pow(pct, 2)) //(top * -1) / height
      this.activePct = window.scrollY >= this.prevScroll ? complete : 1 - complete
    }
  },
  computed: {},

  mounted () {
    const sections = this.$el.querySelectorAll('.threesection')
    this.content.height = [...sections]
      .reduce((total, section) => total + section.getBoundingClientRect().height, 0)
    this.content.end = this.content.height - window.innerHeight
    this.content.start = sections[0].getBoundingClientRect().top + window.scrollY

    window.addEventListener('scroll', () => {
      if (window.scrollY < this.content.start) return
      this.prevScroll = this.activeScroll
      this.activeScroll = window.scrollY
      
      // time to do scroll stuff
      // const { top } = sections[0].getBoundingClientRect()
      // const height = this.content.height - window.innerHeight
      // const complete = Math.sqrt(Math.pow(this.activePct, 2)) //(top * -1) / height
      // this.activePct = window.scrollY >= this.prevScroll ? complete : 1 - complete
      // this.rotation.y = this.pct * 90
    })
  },
}
</script>


<style scoped lang="sass">
@import index



</style>
