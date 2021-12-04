<template>
  <div>
    <button class="wide" @click="openModal()">
      + Add new task
    </button>

    <Modal :show="toggle" @modal-show="openModal">
      <template v-slot:header>
        Adding a new task
      </template>
      <form @submit.prevent="addTodo">
        <input ref="input"
               type="text"
               autocomplete="off"
               placeholder="What needs to be done?"
               v-model.trim="newTodo.title" />
        <input type="datetime-local" v-model="newTodo.date" />
        <button>
          Add
        </button>
      </form>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  components: {
    Modal
  },
  data() {
    return {
      toggle: false,
      newTodo: {}
    }
  },
  methods: {
    addTodo() {
      this.$emit('todo-new', this.newTodo);
      this.newTodo = {};
    },
    openModal(toggle) {
      this.toggle = toggle ?? !this.toggle;
      this.$nextTick(() => this.$refs.input.focus());
    }
  }
};
</script>

<style>
.wide {
  width: 100%;
}
</style>
