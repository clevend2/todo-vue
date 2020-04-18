<template>
  <div class="app-note-list">
    <ul class="note-list">
      <app-note-list-item
        v-for="note in byParameters"
        :key="note.id"
        :note="note"
        @click="openNote(note.id)"
      />
    </ul>
    <router-view />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DEFAULT_PARAMETERS } from '../entities/defaults';
import { ID } from '../api/types';
import { INote } from '../entities/types';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component
export default class AppNoteList extends Vue {
  @Prop()
  keywords: string;

  @Prop()
  deadline: number | null;

  constructor(options: any) {
    super(options);
    this.keywords = DEFAULT_PARAMETERS.keywords;
    this.deadline = DEFAULT_PARAMETERS.deadline;
  }

  get parameters() {
    return {
      keywords: this.keywords,
      deadline: this.deadline,
    };
  }

  get notes() {
    return this.$store.state.notes.data;
  }

  async created() {
    this.$store.dispatch('notes/read', this.parameters);
  }

  openNote(noteId: ID): void {
    this.$router.push({ path: `/notes/note/${noteId}` });
  }
}
</script>

<style lang="scss" scoped>
.note-list {
  padding: 10px;
}
</style>
