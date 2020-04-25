<template functional>
  <div class="facade">
    <slot />
  </div>
</template>

<script>
export default {
  functional: true,
  props: {
    height: {
      type: [Number, String],
      default: '1em',
    },
    width: {
      type: [Number, String],
      default: '100%',
    },
  },
};
</script>

<style lang="scss">
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;
@use '@/assets/scss/_mixins' as decor;

.facade {
  margin: spacing.$text;
  background-color: colors.$bg-secondary;
}
</style>
