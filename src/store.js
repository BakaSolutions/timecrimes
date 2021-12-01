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
    actions: {
        getNextId({state}) {
            return new Promise(resolve => {
                if (!state.todos.length) {
                    return resolve(0);
                }
                let lastTodo = state.todos.length - 1;
                return resolve(state.todos[lastTodo].id + 1);
            });
        }
    },
    plugins: [
        createPersistedState(),
        sharedMutations({ predicate: ['addTodo', 'editTodo', 'removeTodo'] })
    ],
});
