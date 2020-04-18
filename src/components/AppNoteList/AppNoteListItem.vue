<template>
  <div class="note-list-item">
    {{ note.gist }}
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.note-list-item {
  padding: 10px;
}
</style>
