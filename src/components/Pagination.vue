<template>
  <div class="flex equal pagination" v-show="limit < length">
    <div>
      <button v-if="page > 1" @click="prevPage(page)">&lt;&lt; Previous</button>
    </div>
    <div>
      Page {{page}}/{{Math.floor(length/limit)+1}}
    </div>
    <div>
      <button v-if="page*limit < length" @click="nextPage(page)">Next &gt;&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
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
