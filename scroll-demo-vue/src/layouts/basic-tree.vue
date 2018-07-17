<template>
  <div>
    <h1>Tree 2</h1>
    
    <three-model />
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
import ThreeModel from '@/components/three-model.vue'
// import ThreeModel from '@/components/three-model-parsed.vue'
// import ThreeModel from '@/components/three-model-gltf.vue'

export default {
  name: 'basic-tree',
  props: [],
  components: {
    SectionBasic,
    ThreeModel,
  },
  data() {
    return {
      // prevScene: 0, // ! depricated
      activeScene: 1,
      prevScroll: 0,
      activeScroll: 0,
      // scene: null,
      // camera: null,
      // renderer: null,
      // model: null,
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
    
  },

  computed: {},

  mounted () {
    
  },
}
</script>


<style scoped lang="sass">
@import index



</style>
