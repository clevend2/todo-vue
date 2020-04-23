<template>
  <div class="app-note-list">
    <ul class="note-list">
      <app-note-link
        v-for="note in notes"
        :key="note.id"
        :note="note"
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
import { logger } from '../util';
import AppNoteLink from './AppNoteLink.vue';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component({
  name: 'AppNoteList',
  components: {
    AppNoteLink,
  },
})
export default class AppNoteList extends Vue {
  @Prop({ default: DEFAULT_PARAMETERS.keywords })
  readonly keywords!: string;

  @Prop({ default: DEFAULT_PARAMETERS.deadline })
  readonly deadline!: number | null;

  get parameters() {
    return {
      keywords: this.keywords,
      deadline: this.deadline,
    };
  }

  get notes() {
    return this.$store.state.notes.data;
  }

  created() {
    logger.log('created...');
    this.$store.dispatch('notes/read', this.parameters);
  }
}
</script>

<style lang="scss" scoped>
.note-list {
  padding: 10px;
}
</style>
