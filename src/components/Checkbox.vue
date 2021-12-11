<template>
  <div @click="handleInput">
    [{{ content ? "x" : "_" }}]
  </div>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    modelValue: {
      required: true
    }
  },
  data() {
    return {
      content: this.modelValue
    }
  },
  methods: {
    handleInput() {
      this.content = !this.content
      this.$emit('update:modelValue', this.content)
    },
  }
}
</script>

<style scoped>
  div {
    cursor: pointer;
    user-select: none;
    padding: var(--padding-topsides) var(--padding-sides);
  }
</style>
