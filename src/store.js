import Vue from 'vue';
import Vuex from 'vuex';
import sharedMutations from 'vuex-shared-mutations';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        todos: [],
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
        }
    },
    plugins: [
        createPersistedState(),
        sharedMutations({ predicate: ['addTodo', 'editTodo', 'removeTodo'] })
    ],
});
