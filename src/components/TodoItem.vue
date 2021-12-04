<template>
  <div class="task" :class="{ completed: todo.completed, editing }">
    <form class="flex" @submit.prevent="doneEdit(todo)">
      <input
          type="button"
          @click="cancelEdit(todo)"
          v-show="editing"
          value="Cancel" />
      <Checkbox
          v-show="!editing"
          :value="todo.completed" />
      <label
          @click="editTodo(todo)"
          v-show="!editing">
        {{todo.title}}
      </label>
      <Timer
          :date="todo.date"
          @click="editTodo(todo)"
          v-show="!editing" />
      <input
          class="edit"
          type="text"
          :value="todo.title"
          v-show="editing"
          @keyup.esc="cancelEdit(todo)"
      />
      <input
          type="datetime-local"
          @keyup.esc="cancelEdit(todo)"
          :value="todo.date"
          v-show="editing"
      />
    </form>
  </div>
</template>

<script>
import Timer from './Timer';
import Checkbox from './Checkbox';

export default {
  components: {
    Timer,
    Checkbox
  },
  props: {
    todo: {
      required: true
    },
    editedTodo: {
      required: true
    }
  },
  computed: {
    editing() {
      return this.todo.id === this.editedTodo.id
    }
  },
  methods: {
    editTodo(todo) {
      this.$emit('todo-edit', todo);
    },
    doneEdit(todo) {
      this.$emit('todo-edit-done', todo);
    },
    cancelEdit(todo) {
      this.$emit('todo-edit-cancel', todo);
    },
  }
}
</script>

<style>
.task label {
  cursor: text;
}
.task form {
  display: flex;
}
.task label {
  text-align: left;
  display: block;
  padding: var(--padding-topsides) 0;
  width: 100%;
}
.editing {
  background: #ff06;
}
.editing input {
  background: transparent;
}
.completed {
  background: #0f06;
}
</style>
