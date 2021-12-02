<template>
  <div class="flex equal pagination" v-show="limit < length">
    <div>
      <button v-if="page > 1" @click="prevPage">&lt;&lt; Previous</button>
    </div>
    <div>
      Page {{page}}/{{Math.floor(length/limit)+1}}
    </div>
    <div>
      <button v-if="page*limit < length" @click="nextPage">Next &gt;&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      required: true
    },
    limit: {
      required: true
    },
    page: {
      required: true
    }
  },
  methods: {
    prevPage(page) {
      this.$emit('page-prev', page);
    },
    nextPage(page) {
      this.$emit('page-next', page);
    }
  }
}
</script>
