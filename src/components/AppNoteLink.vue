<template>
  <button class="note-list-item" @click="openNote">
    {{ note.gist }}
  </button>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { INote } from '@/entities/types';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component({
  name: 'AppNoteListItem',
})
export default class AppNoteListItem extends Vue {
  @Prop()
  readonly note!: INote;

  openNote() {
    this.$router.push({ path: `/notes/note/${this.note.id}` });
  }
}
</script>

<style lang="scss" scoped>
.note-list-item {
  padding: 10px;
}
</style>
