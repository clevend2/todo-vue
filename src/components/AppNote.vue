<template>
  <article class="note">
    <app-loader
      :uploading="uploading"
      :downloading="downloading"
    />
    <header>
      <h6
        ref="gist"
        class="note-gist"
        contenteditable="true"
      />
    </header>
    <section
      ref="text"
      class="note-text"
      contenteditable="true"
    />
    <footer class="note-footer">
      <i v-show="edited">Edited</i>
    </footer>
  </article>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars, import/no-unresolved */
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DEFAULT_NOTEBOOK_NOTE } from '../entities/defaults';
import debounce from '../util/debounce';
import RequestManager from '../util/request-manager';
import { ID } from '../api/types';
import { INote, IEntityReadResult } from '../entities/types';
import { logger } from '../util';
import AppLoader from './_shared/AppLoader.vue';
/* eslint-enable no-unused-vars, import/no-unresolved */

@Component({
  name: 'AppNote',
  components: {
    AppLoader,
  },
})
export default class AppNote extends Vue {
  // holds the return for the debounced change event emitter
  $_debouncedEmitter!: () => void;

  // holds the mutation observers for the editable content
  $_mutationObservers!: WeakMap<HTMLElement, MutationObserver>;

  // the request manager for server-side fetching of the note
  $_readMgr!: RequestManager<ID>;

  // request manager for updates/creates
  $_writeMgr!: RequestManager<INote>;

  $refs!: {
    'gist': HTMLElement;
    'text': HTMLElement;
  };

  @Prop()
  readonly noteId!: ID | null;

  uploading: boolean = false;

  downloading: boolean = false;

  edited: boolean = false;

  // this is simply here to take advantage of getter caching
  get noteFromStore() {
    return this.$store.getters['notes/byId'].get(this.noteId);
  }

  async created() {
    this.$_mutationObservers = new WeakMap();

    this.$_readMgr = new RequestManager(
      (id: ID) => this.$store.dispatch('notes/read', {
        id,
      }),
    );

    this.$_writeMgr = new RequestManager(
      (note: INote) => this.$store.dispatch(note.id ? 'notes/update' : 'notes/create', note),
    );

    this.$_debouncedEmitter = debounce(() => {
      this.$emit('noteChanged', {
        id: this.noteId,
        gist: this.$refs.gist.innerHTML || '',
        text: this.$refs.text.innerHTML || '',
      });
    }, 500);

    // this watcher allows any server-side requesting to happen
    // just a smidge faster than the mounting process
    // by kicking off the request before mounting
    this.$watch('noteId', () => {
      if (this.noteId && !this.noteFromStore) {
        this.downloading = true;
        this.$_readMgr.request(this.noteId).then(() => {
          this.downloading = false;
        });
      }
    }, { immediate: true });

    // for now, the event is caught here and data processing is done in-component
    this.$on('noteChanged', (note: INote) => {
      this.uploading = true;
      this.$_writeMgr.request(note).then(() => {
        this.edited = false;
        this.uploading = false;
      });
    });
  }

  mounted() {
    // this is in a separate watcher
    this.$watch('noteId', async () => {
      // pause observation (if any)
      this.stopObserving(this.$refs.gist);
      this.stopObserving(this.$refs.text);

      // initialize with "fresh" note data
      let noteData: INote = {
        ...DEFAULT_NOTEBOOK_NOTE,
      };

      // if there is a note id, check the store
      // (done via the persistedNote getter)
      if (this.noteId) {
        // if the note doesn't exist in the store, get it into the store
        // (this would have been started in the `created` hook)
        if (!this.noteFromStore) {
          this.downloading = true;
          await this.$_readMgr.request(this.noteId);
          this.downloading = false;
        }

        noteData = this.noteFromStore;
      }

      this.$refs.gist.innerHTML = noteData.gist || '';
      this.$refs.text.innerHTML = noteData.text;

      // start observing after initializing inputs
      this.startObserving(this.$refs.gist);
      this.startObserving(this.$refs.text);
    }, { immediate: true });
  }

  beforeDestroy() {
    this.stopObserving(this.$refs.gist);
    this.stopObserving(this.$refs.text);
  }

  startObserving(inputEl: HTMLElement) {
    const observer = new MutationObserver(() => {
      this.edited = true;
      this.$_debouncedEmitter();
    });

    observer.observe(inputEl, {
      characterData: true,
      attributes: false,
      childList: true,
      subtree: true,
    });

    this.$_mutationObservers.set(inputEl, observer);
  }

  stopObserving(inputEl: HTMLElement) {
    const observer = this.$_mutationObservers.get(inputEl);
    if (observer) {
      observer.disconnect();

      this.$_mutationObservers.delete(inputEl);
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as mixins;

.note {
  @include mixins.elevate(colors.$shadow, spacing.$text/2);

  background-color: colors.$bg;
  margin: 0 0 spacing.$row 0;

  .note-gist, .note-text {
    color: colors.$text-focus;
    min-height: spacing.$text;
  }

  header, section {
    padding: spacing.$text;
  }

  header {
    border-bottom: 1px dashed colors.$border-neutral;

    h6 {
      margin: 0;
    }
  }

  footer {
    background-color: colors.$bg-secondary;
    border-top: 1px solid colors.$border-neutral;
    padding: spacing.$text;
    transition: height 0.2s;

    i {
      color: colors.$text-secondary;
    }
  }
}
</style>
