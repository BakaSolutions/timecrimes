<template>
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
</template>

<script>
export default {
  props: {
    todos: {
      required: true
    },
    visibility: {
      required: true
    },
    remaining: {
      required: true
    }
  }
}
</script>
