<template>
  <router-link
    class="note-link"
    :to="`/note/${note.id}`"
  >
    {{ note.gist }}
  </router-link>
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
}
</script>

<style lang="scss" scoped>
.note-link {
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
