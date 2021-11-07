<template>
  <div class="task" :class="{ completed: todo.completed, editing }">
    <form class="flex" @submit.prevent="doneEdit(todo)">
      <input type="button"
             @click="cancelEdit(todo)"
             v-show="editing"
             value="Cancel" />
      <input class="toggle"
             type="checkbox"
             v-show="!editing"
             v-model="todo.completed" />
      <label @click="editTodo(todo)"
             v-show="!editing">
        {{todo.title}}
      </label>
      <Timer :date="todo.date"
             @click="editTodo(todo)"
             v-show="!editing" />
      <input
          class="edit"
          type="text"
          v-model="todo.title"
          v-show="editing"
          @keyup.esc="cancelEdit(todo)"
      />
      <input type="datetime-local"
             @keyup.esc="cancelEdit(todo)"
             v-model="todo.date"
             v-show="editing"
      />
    </form>
  </div>
</template>

<script>
import Timer from './Timer';

export default {
  components: {
    Timer
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
  padding: 1em;
  width: 100%;
}
.editing {
  box-shadow: 0 0 .4em #ff0;
}
.completed {
  background: #0f06;
}
</style>
