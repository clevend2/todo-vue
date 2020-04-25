<template functional>
  <div
    class="skeleton-container"
    :class="{'show': contentReady}"
  >
    <div
      class="skeleton-element"
      :class="data.class"
    />
    <slot :class="data.class" />
  </div>
</template>

<script>
export default {
  functional: true,
  inheritAttrs: false,
  props: {
    contentReady: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as decor;

.skeleton-container {
  background-color: colors.$bg-secondary;
  margin: spacing.$text;

  >:not(.skeleton-element), &.show>.skeleton-element {
    display: none;
  }

  &.show>:not(.skeleton-element) {
    display: initial;
  }
}
</style>
