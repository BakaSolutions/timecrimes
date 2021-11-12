<template>
  <div @click="handleInput">
    [{{ content ? "x" : "_" }}]
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    }
  },
  data() {
    return {
      content: this.value
    }
  },
  methods: {
    handleInput() {
      this.content = !this.content
      this.$emit('input', this.content)
    },
  }
}
</script>

<style scoped>
  div {
    cursor: pointer;
    user-select: none;
    padding: 0.5em;
  }
</style>
