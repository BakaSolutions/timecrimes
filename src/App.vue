<template>
  <div id="app">
    <header class="flex">
      <div class="left">Timecrimes</div>
      <div class="right">no time management is a crime</div>
    </header>
    <main>
      <section class="main" v-show="todos.length">
        <ul class="todo-list">
          <li class="flex">
            <div v-for="c in columns" :key="c.column"
                 @click="sortBy(c.column)"
                 class="title"
                 :class="{selected: sortedBy === c.column,
                  asc: sorted === 'asc',
                  desc: sorted === 'desc',
                  'time': c.column === 'date'}">{{c.title}}</div>
          </li>
          <li class="todo" v-for="todo in filteredTodos" :key="todo.id">
            <ToDoItem :todo="todo"
                      :edited-todo="editedTodo"
                      @todo-edit="editTodo(todo)"
                      @todo-edit-done="doneEdit(todo)"
                      @todo-edit-cancel="cancelEdit(todo)"
            />
          </li>
          <li class="todo empty" v-show="!filteredTodos.length">
            No tasks yet :c
          </li>
        </ul>
      </section>
      <div class="new-task">
        <form @submit.prevent="addTodo">
          <input
              type="text"
              autofocus
              autocomplete="off"
              placeholder="What needs to be done?"
              v-model.trim.lazy="newTodo.title" />
          <input type="datetime-local" v-model="newTodo.date" />
        </form>
      </div>
      <div class="flex equal pagination" v-show="limit < todos.length">
        <div>
          <button v-if="currentPage > 1" @click="prevPage">&lt;&lt; Previous</button>
        </div>
        <div>
          Page {{currentPage}}/{{Math.floor(todos.length/limit)+1}}
        </div>
        <div>
          <button v-if="currentPage*limit < todos.length" @click="nextPage">Next &gt;&gt;</button>
        </div>
      </div>
      <ul class="filters flex equal" v-show="todos.length">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">
            All
            <span class="counter" v-show="todos.length">
              ({{ todos.length }})
            </span>
          </a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">
            Active
            <span class="counter" v-show="remaining">
              ({{ remaining }})
            </span>
          </a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">
            Completed
            <span class="counter" v-show="todos.length - remaining">
              ({{ todos.length - remaining }})
            </span>
          </a>
        </li>
      </ul>
      <footer v-show="todos.length">
        <button
            class="clear-completed"
            @click="removeCompleted"
            v-show="todos.length > remaining"
        >
          [ Clear completed tasks ]
        </button>
        <div>
          Baka Solutions, 2021
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import "./assets/App.css";

let filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed),
};
import ToDoItem from "@/components/ToDoItem";

export default {
  name: 'Timecrimes',
  components: {
    ToDoItem
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
      return filters[this.visibility](this.todos).sort((a,b) => {
        let modifier = this.sorted === "asc" ? 1 : -1;
        if (a[this.sortedBy] > b[this.sortedBy]) {
          return modifier;
        }
        if (a[this.sortedBy] < b[this.sortedBy]) {
          return -1 * modifier;
        }
        if (typeof a[this.sortedBy] === "undefined"
          && typeof b[this.sortedBy] === "undefined") {
          return 0;
        }
        if (typeof a[this.sortedBy] === "undefined") {
          return 1;
        }
        if (typeof b[this.sortedBy] === "undefined") {
          return -1;
        }
        return 0;
      }).filter((_, index) => {
        let start = (this.currentPage - 1) * this.limit;
        let end = this.currentPage * this.limit;
        if (index >= start && index < end) {
          return true;
        }
      });
    },
    remaining() {
      return filters.active(this.todos).length;
    },
    allDone: {
      get() {
        return this.remaining === 0;
      },
      set(value) {
        this.todos.forEach(todo => todo.completed = value);
      }
    }
  },
  filters: {
    pluralize(n) {
      return n === 1 ? "item" : "items";
    }
  },
  methods: {
    onHashChange() {
      let visibility = window.location.hash.replace(/#\/?/, "");
      if (filters[visibility]) {
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
      this.todos = filters.active(this.todos);
    }
  }
}
</script>

<style>
header {
  background: var(--background-secondary);
  color: var(--color-secondary);
  padding: 1em;
}
.left {
  text-align: left;
}
.right {
  text-align: right;
}
.flex {
  display: flex;
  align-items: center;
}
.flex > * {
  flex-grow: 1;
}
.flex.equal > * {
  flex-basis: 0;
}
.flex > .fix-width,
.title.time {
  flex-grow: 0;
  flex-shrink: 0;
}
.filters a {
  display: block;
  padding: 1em;
  text-decoration: none;
}
a:before {
  content: "[ ";
}
a:after {
  content: " ]";
}
.todo.empty {
  padding: var(--padding-topsides) 0;
}
.title, .pagination > div {
  padding: var(--padding-topsides) 0;
}
.title.selected, a.selected {
  text-decoration: underline;
}
.selected.asc:after {
  content: " (asc)";
}
.selected.desc:after {
  content: " (desc)";
}
</style>
