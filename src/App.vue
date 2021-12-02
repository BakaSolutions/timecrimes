<template>
  <div id="app">
    <Header />
    <main>
      <section class="main" v-show="todos.length">
        <ul class="todo-list">
          <li class="flex">
            <div v-for="c in columns" :key="c.column"
                 @click="sortBy(c.column)"
                 class="title"
                 :class="{
                   selected: sortedBy === c.column,
                   asc: sorted === 'asc',
                   desc: sorted === 'desc',
                   time: c.column === 'date'
                 }">{{c.title}}</div>
          </li>
          <li class="todo" v-for="todo in paginatedTodos" :key="todo.id">
            <ToDoItem
                :todo="todo"
                :edited-todo="editedTodo"
                @todo-edit="editTodo(todo)"
                @todo-edit-done="doneEdit(todo)"
                @todo-edit-cancel="cancelEdit(todo)" />
          </li>
          <li class="todo empty" v-show="!paginatedTodos.length">
            No tasks yet :c
          </li>
        </ul>
      </section>
      <div class="new-task">
        <form @submit.prevent="addTodo" class="flex">
          <input
              type="text"
              autofocus
              autocomplete="off"
              placeholder="What needs to be done?"
              v-model.trim.lazy="newTodo.title" />
          <input type="datetime-local" v-model="newTodo.date" />
        </form>
      </div>
      <Pagination
          :length="filteredTodos.length"
          :limit="limit"
          :page="currentPage"
          @page-prev="prevPage"
          @page-next="nextPage" />
      <TodoTabs :todos="todos"
                :visibility="visibility"
                :remaining="remaining" />
      <button
          class="clear-completed"
          @click="removeCompleted"
          v-show="todos.length > remaining"
      >
        [ Clear completed tasks ]
      </button>
      <Footer />
    </main>
  </div>
</template>

<script>
import "./assets/App.css";

import Header from "@/components/Header";
import ToDoItem from "@/components/ToDoItem";
import Pagination from "@/components/Pagination";
import TodoTabs from "@/components/TodoTabs";
import Footer from "@/components/Footer";

export default {
  name: 'Timecrimes',
  components: {
    Header,
    ToDoItem,
    Pagination,
    TodoTabs,
    Footer
  },
  data() {
    return {
      newTodo: {},
      editedTodo: {},
      beforeEditCache: {},

      visibility: "all",
      sortedBy: "date",
      sorted: "asc",
      columns: [
        //{column: 'id', title: 'Id'},
        {column: 'title', title: 'Task', grow: 2},
        {column: 'date', title: 'Time'}
      ],
      limit: 10,
      currentPage: 1
    }
  },
  created() {
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  },
  beforeDestroy() {
    window.removeEventListener("hashchange", this.onHashChange);
  },
  computed: {
    todos() {
      return this.$store.state.todos;
    },
    filteredTodos() {
      return this.$store.getters.filteredTodos(this.visibility, this.sortedBy, this.sorted);
    },
    paginatedTodos() {
      let todos = this.filteredTodos;

      if (this.limit) {
        todos = todos.filter((_, index) => {
          let start = (this.currentPage - 1) * this.limit;
          let end = this.currentPage * this.limit;
          if (index >= start && index < end) {
            return true;
          }
        })
      }

      return todos;
    },
    remaining() {
      return this.$store.getters.remainingTodos.length;
    }
  },
  methods: {
    onHashChange() {
      this.currentPage = 1;
      let visibility = window.location.hash.replace(/#\/?/, "");
      if (visibility === 'active' || visibility === 'completed') {
        return this.visibility = visibility;
      }
      window.location.hash = "";
      this.visibility = "all";
    },
    sortBy(column) {
      if (this.sortedBy === column) {
        this.sorted = (this.sorted === 'asc')
          ? 'desc'
          : 'asc';
      } else {
        this.sorted = 'asc';
      }
      this.sortedBy = column;
    },
    nextPage() {
      if((this.currentPage * this.limit) < this.todos.length) {
        this.currentPage++;
      }
    },
    prevPage() {
      if(this.currentPage > 1) {
        this.currentPage--;
      }
    },
    addTodo() {
      let {title, date} = this.newTodo;
      if (!title) {
        return;
      }
      let todo = {
        title,
        date,
        completed: false
      };
      this.$store.commit('addTodo', todo);
      this.newTodo = {};
    },
    removeTodo(todo) {
      this.$store.commit('removeTodo', todo);
    },
    editTodo(todo) {
      this.beforeEditCache = todo;
      this.editedTodo = todo;
    },
    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = {};
      if (!todo.title) {
        return this.removeTodo(todo);
      }
      this.$store.commit('editTodo', todo);
    },
    cancelEdit(todo) {
      this.editedTodo = {};
      todo.title = this.beforeEditCache.title;
      todo.date = this.beforeEditCache.date;
    },
    removeCompleted() {
      this.$store.commit('removeCompletedTodos');
    }
  }
}
</script>
