<template>
  <section class="modal" v-show="toggle" @keyup.esc="closeModal">
    <div class="header flex">
      <div class="left">
        <slot name="header"></slot>
      </div>
      <button class="right" @click="closeModal">X</button>
    </div>
    <div>
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    show: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    toggle() {
      return this.show;
    }
  },
  methods: {
    closeModal() {
      this.show = false;
    }
  }
}
</script>

<style scoped>
.modal {
  background: var(--background-secondary);
  border: .25em var(--background-modal) solid;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal .header {
  background: var(--background-modal);
  color: var(--color-modal);
}
.modal .header > div {
  padding: .5em;
}

button {
  padding: .5em 2ch;
}
button:hover,
button:focus {
  outline: none;
  padding: .5em;
}
button:hover:before,
button:focus:before {
  content: '[';
}
button:hover:after,
button:focus:after {
  content: ']';
}
</style>
