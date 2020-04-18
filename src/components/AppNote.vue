<template>
  <div class="note">
    <h3
      class="note-gist"
      data-name="gist"
      contenteditable="true"
      @change="edited"
    >
      {{ gist }}
    </h3>
    <div
      class="note-text"
      data-name="text"
      contenteditable="true"
      @change="edited"
    >
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DEFAULT_NOTEBOOK_NOTE } from '../entities/defaults';
import debounce from '../util/debounce';
import { ID } from '../api/types';
import { INote } from '../entities/types';
import { EditableContentEvent } from './types';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component
export default class AppNote extends Vue {
  @Prop()
  taskId: ID | null;

  @Prop()
  noteId: ID | null;

  note: INote = {
    ...DEFAULT_NOTEBOOK_NOTE,
  };

  $_debouncedEmitter: () => void;

  constructor(options: any) {
    super(options);
    this.taskId = null;
    this.noteId = null;
    this.$_debouncedEmitter = () => null;
  }

  get persistedNote() {
    return this.$store.getters['notes/byId'].get(this.taskId || this.noteId);
  }

  async created() {
    if (this.taskId || this.noteId) {
      if (!this.persistedNote) {
        await this.$store.dispatch('notes/read', {
          id: this.taskId || this.noteId,
        });
      }

      this.note = { ...this.persistedNote };
    }

    this.$_debouncedEmitter = debounce(() => this.emitChanges(), 500);

    // for now, the event is caught here and data processing is done in-component
    this.$on('noteChanged', (note: INote) => {
      const action = note.id ? 'notes/update' : 'notes/create';
      this.$store.dispatch(action, note);
    });
  }

  edited(e: EditableContentEvent) {
    const targetElement = e.target;

    if (targetElement) {
      this.note[targetElement.dataset.name] = targetElement.textContent || '';

      this.$_debouncedEmitter();
    }
  }

  emitChanges() {
    this.$emit('noteChanged', this.note);
  }
}
</script>

<style lang="scss" scoped>
.note {
  padding: 10px;
}
</style>
