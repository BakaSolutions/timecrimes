<template>
  <section
    class="modal"
    v-show="show"
    @keyup.esc="closeModal"
    ref="dragElement">
    <div class="header flex" ref="dragHandle">
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


<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import { useDraggability } from "vue-draggability";

defineProps({
  show: {
    default: false,
    type: Boolean
  }
});

const emit = defineEmits(["modal-show"]);

const dragElement = ref(null);
const dragHandle = ref(null);

onMounted(() => {
  useDraggability(dragElement, dragHandle);
});

function closeModal() {
  emit("modal-show", !this.show);
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
.modal .header > div, button {
  padding: .5em var(--padding-sides);
}
button:hover,
button:focus {
  outline: none;
  padding: .5em 0;
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
