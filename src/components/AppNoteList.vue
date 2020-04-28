<template>
  <div
    class="note-list"
    :class="{'show-skeleton': getting}"
  >
    <app-loader
      :getting="getting"
    />
    <ul>
      <li class="note-link-container new-note-container">
        <router-link
          class="note-link new-note"
          :to="`/notes/new`"
        />
      </li>
      <li
        v-for="n in ['sk-1','sk-2','sk-3']"
        :key="n"
        class="note-link-container skeleton-element"
      />
      <li
        v-for="note in notes"
        :key="note.id"
        class="note-link-container flesh-element"
      >
        <router-link
          class="note-link"
          :to="`/note/${note.id}`"
        >
          {{ note.gist }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { DEFAULT_PARAMETERS } from '@/entities/defaults';
import { ID, Persisted } from '@/api/types';
import { INote, IEntityParameters } from '@/entities/types';
import { logger } from '@/util';
import rootStore from '@/store';
import AppLoader from './AppLoader.vue';
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
    AppLoader,
  },
})
export default class AppNoteList extends Vue {
  @Prop({ default: DEFAULT_PARAMETERS.keywords })
  readonly keywords!: string;

  @Prop({ default: DEFAULT_PARAMETERS.deadline })
  readonly deadline!: number | null;

  /**
   * UI flag for incoming data
   */
  getting: boolean = true;

  notes: Persisted<INote>[] = [];

  // eslint-disable-next-line class-methods-use-this
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const parameters = getParameters(to.params);

    const notesPromise = rootStore.dispatch('notes/read', parameters);

    next((vm: AppNoteList) => {
      const that = vm;
      that.getting = true;
      notesPromise.then(() => {
        that.notes = that.$store.state.notes.data;
        that.getting = false;
      });
    });
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as mixins;
@use '@/assets/scss/_skeletons';
@use '@/assets/scss/notes';

.note-list {
  ul {
    display: flex;
    flex-wrap: wrap;
    margin: spacing.$between/2;
    padding: 0;

    >li {
      @include mixins.elevate();

      margin: spacing.$between/2;

      >.note-link, >.skeleton-element {
        height: spacing.$row-height;
      }

      &.skeleton-element {
        width: spacing.$row-height*spacing.$the-ratio;
      }

      >.note-link {
        display: block;
        color: colors.$text;
      }

      &.new-note-container {
        box-shadow: none !important;

        >.new-note {
          background-color: colors.$bg-dark;
          border-color: colors.$border-dark;

          color: colors.$bg;
          padding: spacing.$text;

          &:hover, &:focus {
            background-color: colors.$bg-dark-focused;
            border-color: colors.$border-dark-focused;
            color: colors.$bg;
          }

          &:before {
            content: "+";
            font-size: spacing.$row-height;
            line-height: spacing.$text;
          }
        }
      }
    }
  }
}
</style>
