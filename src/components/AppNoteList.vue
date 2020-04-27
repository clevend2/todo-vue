<template>
  <ul class="note-list">
    <li>
      <router-link
        class="note-link new-note"
        :to="`/notes/new`"
      />
    </li>
    <li
      v-for="note in notes"
      :key="note.id"
    >
      <app-note-link
        :note="note"
      />
    </li>
  </ul>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DEFAULT_PARAMETERS } from '@/entities/defaults';
import { ID, Persisted } from '@/api/types';
import { INote, IEntityParameters } from '@/entities/types';
import { logger } from '@/util';
import rootStore from '@/store';
import { Route } from 'vue-router';
import AppNoteLink from './AppNoteLink.vue';
/* eslint-enable no-unused-vars, import/no-unresolved */

function getParameters(context: Partial<IEntityParameters>): IEntityParameters {
  return {
    keywords: context.keywords || '',
    deadline: context.deadline || null,
  };
}

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

  notes: Persisted<INote>[] = [];

  // eslint-disable-next-line class-methods-use-this
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const parameters = getParameters(to.params);

    const notesPromise = rootStore.dispatch('notes/read', parameters);

    next((vm: AppNoteList) => {
      const that = vm;
      notesPromise.then(() => {
        that.notes = that.$store.state.notes.data;
      });
    });
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as decor;

.note-list {
  display: flex;
  flex-wrap: wrap;
  margin: spacing.$text/2;
  padding: 0;

  >* {
    @include decor.elevateOnFocus(colors.$shadow, spacing.$text/4);

    margin: spacing.$text/2;
    overflow: hidden;

    >.note-link {
      background-color: colors.$bg;
      border: 1px solid colors.$border;
      color: colors.$text;
      display: block;
      height: spacing.$row;
      padding: spacing.$text spacing.$text*2 spacing.$text spacing.$text;
      transition: color 0.2s;

      &.new-note {
        padding: spacing.$text;
        text-decoration: none;

        &:before {
          content: "+";
          font-size: spacing.$row;
        }
      }

      &:hover, &:focus {
        background-color: colors.$bg-hover;
        color: colors.$text-focus;
      }
    }
  }
}
</style>
