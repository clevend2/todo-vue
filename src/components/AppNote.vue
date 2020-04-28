<template>
  <article
    class="note"
    :class="{'show-skeleton': getting}"
  >
    <app-loader
      :changing="changing"
      :getting="getting"
    />
    <header>
      <h1 class="skeleton-element note-gist" />
      <h1
        ref="gist"
        class="flesh-element note-gist"
        contenteditable="true"
      />
    </header>
    <section>
      <div class="skeleton-element note-text" />
      <div
        ref="text"
        class="flesh-element note-text"
        contenteditable="true"
      />
    </section>
    <!-- <footer class="note-footer">
      <i v-show="dirty">Edited</i>
    </footer> -->
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { ID } from '@/api/types';
import { INote } from '@/entities/types';
import { logger } from '@/util';
import debounce from '@/util/debounce';
import { startObserving, stopObserving } from '@/util/text-observer';
import { prepareNoteData, sendNote } from '@/entities/services/note';
import AppLoader from './AppLoader.vue';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component({
  name: 'AppNote',
  components: {
    AppLoader,
  },
})
export default class AppNote extends Vue {
  /**
   * debounced emitter of `noteChanged` event
   */
  $_debounced_noteChanged!: () => void;

  /**
   * promise to fulfill when mounting is complete
   */

  $refs!: {
    'gist': HTMLElement;
    'text': HTMLElement;
  };

  @Prop()
  readonly noteId!: ID | null;

  /**
   * UI flag for outgoing data
   */
  changing: boolean = false;

  /**
   * UI flag for incoming data
   */
  getting: boolean = true;

  /**
   * UI flag for data desync from store
   */
  dirty: boolean = false;

  async created() {
    this.$_debounced_noteChanged = debounce(() => {
      this.$emit('noteChanged', {
        id: this.noteId,
        gist: this.$refs.gist.innerHTML || '',
        text: this.$refs.text.innerHTML || '',
      });
    }, 500);

    // for now, the event is caught here and data processing is done in-component
    this.$on('noteChanged', (note: INote) => {
      this.changing = true;

      const isNew = !note.id;

      sendNote(note).then((persistedNote) => {
        this.dirty = false;
        this.changing = false;

        if (isNew) {
          this.$router.replace(`/note/${persistedNote.id}`);
        }
      });
    });
  }

  beforeDestroy() {
    this.unmountUI();
  }

  // eslint-disable-next-line class-methods-use-this
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const noteDataPromise = prepareNoteData(to.params.noteId);

    // note about Vue Router's `next()`: it runs after the mounted() hook
    next(async (vm: AppNote) => {
      const that = vm;

      that.getting = true;
      await that.prepareUI(noteDataPromise);
      that.getting = false;
    });
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.unmountUI();
    this.getting = true;
    await this.prepareUI(prepareNoteData(to.params.noteId));
    this.getting = false;
    next();
  }

  beforeRouteLeave(to: Route, from: Route, next: Function) {
    this.unmountUI();
    next();
  }

  /**
   * populates the input fields and sets the mutation observers
   * to look for changes
   */
  async prepareUI(noteDataPromise: Promise<INote>): Promise<void> {
    const noteData = await noteDataPromise;

    this.$refs.gist.innerHTML = noteData.gist || '';
    this.$refs.text.innerHTML = noteData.text;

    startObserving(this.$refs.gist, this.wasEdited);
    startObserving(this.$refs.text, this.wasEdited);
  }

  /**
   * stop observation
   */
  unmountUI() {
    // pause observation (if any)
    stopObserving(this.$refs.gist);
    stopObserving(this.$refs.text);
  }

  /**
   * function to trigger with each observed change
   * @type MutationCallback
   */
  wasEdited() {
    this.dirty = true;
    this.$_debounced_noteChanged();
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as mixins;
@use '@/assets/scss/_font' as font;
@use '@/assets/scss/_skeletons';

.note {
  @include mixins.elevate(2);

  background-color: colors.$bg;
  margin: 0;
  padding: 0;

  header, section {
    padding: spacing.$text;
  }

  header {
    border-bottom: 1px dashed colors.$border-neutral;

    h1 {
      font-size: font.$base-size;
      font-weight: bold;
      margin: 0;
    }
  }

  footer {
    background-color: colors.$bg;
    border-top: 1px solid colors.$border-neutral;
    padding: spacing.$text;
    transition: height 0.2s;

    i {
      color: colors.$text-secondary;
    }
  }

  .note-gist, .note-text {
    color: colors.$text-focused;
    min-height: spacing.$text;
  }

  .note-text {
    min-height: spacing.$row-height;
  }
}
</style>
