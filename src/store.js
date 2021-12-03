import { createStore } from 'vuex';
import sharedMutations from 'vuex-shared-mutations';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state() {
    return {
      todos: []
    }
  },
  mutations: {
    addTodo(state, todo) {
      if (state.todos.length === 0) {
        todo.id = 0
      } else {
        const maxId = state.todos.reduce(
          (max, todo) => (todo.id > max ? todo.id : max),
          state.todos[0].id
        );
        todo.id = maxId + 1;
      }

      state.todos.push(todo);
    },
    editTodo(state, todo) {
      let index = state.todos.findIndex(t => t.id === todo.id);
      if (index < 0) {
        return;
      }
      state.todos[index] = todo;
    },
    removeTodo(state, todo) {
      state.todos.splice(state.todos.indexOf(todo), 1);
    },
    removeCompletedTodos(state) {
      state.todos = state.todos.filter(todo => !todo.completed)
    }
  },
  getters: {
    allTodos: state => state.todos,
    remainingTodos: state => state.todos.filter(todo => !todo.completed),
    completedTodos: state => state.todos.filter(todo => todo.completed),
    filteredTodos: (state, getters) => (type, sortedBy, sorted) => {
      let map = {
        all: "allTodos",
        active: "remainingTodos",
        completed: "completedTodos"
      };
      let todos = getters[map[type]];

      if (sortedBy && sorted) {
        todos = todos.sort((a, b) => {
          let modifier = sorted === "asc" ? 1 : -1;
          if (a[sortedBy] > b[sortedBy]) {
            return modifier;
          }
          if (a[sortedBy] < b[sortedBy]) {
            return -1 * modifier;
          }
          if (typeof a[sortedBy] === "undefined"
            && typeof b[sortedBy] === "undefined") {
            return 0;
          }
          if (typeof a[sortedBy] === "undefined") {
            return 1;
          }
          if (typeof b[sortedBy] === "undefined") {
            return -1;
          }
          return 0;
        })
      }

      return todos;
    }
  },
  plugins: [
    createPersistedState(),
    sharedMutations({
      predicate: ['addTodo', 'editTodo', 'removeTodo', 'removeCompletedTodos']
    })
  ],
});
