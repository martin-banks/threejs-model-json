<template>
  <section class="section__wrapper">
    <div class="content">
      <h2>Section title {{ index }}</h2>
      <p>{{ text }}</p>
    </div>
  </section>

</template>


<script>
export default {
  name: 'section-basic',
  props: [
    'text',
    'index',
  ],
  components: {},
  data () {
    return {}
  },
  methods: {},
  computed: {},
  mounted () {
    window.addEventListener('scroll', () => {
      const { top, height } = this.$el.getBoundingClientRect()
      if (top < 0 && top > 0 - height) {
        const { top, height } = this.$el.getBoundingClientRect()
        this.$emit('activeindex', this.index)
        this.$emit('activepct', (top * -1) / height)
      }
    })
  }
}
</script>


<style scoped lang="sass">
@import index

.section__wrapper
  height: 200vh
  border: solid 5px orange

.content
  border: solid 1px red
  max-width: 500px
  padding: 24px
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background: rgba(white, 0.6)
  *
    background: none
    text-shadow: none


</style>
