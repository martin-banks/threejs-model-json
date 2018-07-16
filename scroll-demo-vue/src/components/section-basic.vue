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
}
</script>


<style scoped lang="sass">
@import index

.section__wrapper
  height: 80vh
  border: solid 5px orange

.content
  border: solid 1px red
  max-width: 500px
  padding: 24px
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)


</style>
