<template>
  <div class="note">
    <h3
      ref="gist"
      class="note-gist"
      contenteditable="true"
      v-html="note.gist"
    >
    </h3>
    <div
      ref="text"
      class="note-text"
      contenteditable="true"
      v-html="note.text"
    >
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
import { logger } from '../util';
/* eslint-enable no-unused-vars, import/no-unresolved */

const observeConfig = { characterData: true, attributes: false, childList: true, subtree: false };

@Component({
  name: 'AppNote',
})
export default class AppNote extends Vue {
  // holds the return for the debounced change event emitter
  $_debouncedEmitter?: () => void;

  // holds the mutation observer for the editable content
  $_mutationObserver?: MutationObserver;

  @Prop()
  readonly noteId!: ID | null;

  note: INote = {
    ...DEFAULT_NOTEBOOK_NOTE,
  };

  get persistedNote() {
    return this.$store.getters['notes/byId'].get(this.noteId);
  }

  async created() {
    this.$_debouncedEmitter = debounce(() => this.emitChanges(), 500);

    // for now, the event is caught here and data processing is done in-component
    this.$on('noteChanged', (note: INote) => {
      const action = note.id ? 'notes/update' : 'notes/create';
      this.$store.dispatch(action, note);
    });

    // set up the watcher for id changes since this component persists through routes
    this.$watch('noteId', () => {
      logger.log('note watched');
      if (this.noteId) {
        logger.log('note id changed', this.noteId);
        
        this.getNoteData().then(() => {
          this.setObserver();
        })
      }
    }, { immediate: true });
  }

  beforeDestroy() {
    if (this.$_mutationObserver) {
      this.$_mutationObserver.disconnect();
    }
  }

  initializeObserver() {
    logger.log(`initializeObserver triggered`);
    const observedByRef: Map<string, Set<Element>> = new Map();

    // want to explicitely track every new node that has been added so it can be specifically monitored,
    // and tied to the root element, rather than tracking the subtree and marking every change indescriminantly
    this.$_mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      logger.log(`mutationObserver triggered`);
    
      for (let mutation of mutations) {
        const target: Element = <Element>mutation.target;
        let mutatedRef: string | null = null;
        let observedElsForRef: Set<Element> | null = null;

        // look in the sets of observed elements for which one it looks like this target belongs to
        for (let [ref, observedEls] of observedByRef) {
          if (observedEls.has(target)) {
            mutatedRef = ref;
            observedElsForRef = observedEls;
          }
        }

        if (mutatedRef && observedElsForRef) {
          logger.log(`mutatedRef found`);
          switch (mutation.type) {
            case 'childList':
              // add it to the observed elements for the found ref
              for (let addedNode of mutation.addedNodes) {
                logger.log(`addedNode`);
                observedElsForRef.add(<Element>addedNode);
                if (this.$_mutationObserver) {
                  this.$_mutationObserver.observe(addedNode, observeConfig)
                }
              }

              // remove a deleted element from observed array
              for (let removedNode of mutation.removedNodes) {
                logger.log(`removedNode`);
                observedElsForRef.delete(<Element>removedNode);
              }
              break;
          }

          this.edited(mutatedRef);
        }
      }
    });

    // initialize observer on root elements
    for (let ref in this.$refs) {
      const input: Element = <Element>this.$refs[ref];

      observedByRef.set(ref, new Set([input]));
      this.$_mutationObserver.observe(input, observeConfig);
    }
  }

  setObserver() {
    if (this.$_mutationObserver) {
      this.$_mutationObserver.disconnect();
    }

    this.initializeObserver();
  }

  edited(ref: string) {
    const targetElement = <Element>this.$refs[ref];
    logger.log(`edited: '${ref}'`);

    if (targetElement) {
      this.note[ref] = targetElement.innerHTML || '';
      logger.log(`Changed ref '${ref}': ${this.note[ref]}`);

      this.$_debouncedEmitter!();
    }
  }

  async getNoteData() {
    if (!this.persistedNote) {
      logger.log("need new persisted note");

      await this.$store.dispatch('notes/read', {
        id: this.noteId,
      });

      logger.log("persisted note fetched");
    }

    logger.log("applying persisted note to data");

    this.note = { ...this.persistedNote };
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
