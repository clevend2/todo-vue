<template functional>
  <div
    class="loader"
    :class="{'changing': props.changing, 'getting': props.getting}"
  />
</template>

<script>
export default {
  functional: true,
  props: {
    changing: {
      type: Boolean,
      default: false,
    },
    getting: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_colors' as colors;
@use '@/assets/scss/_spacing' as spacing;

$loader-height: 8em;
$loader-width: spacing.$text/2;
$loader-speed: 0.5s;
$loader-timing-function: ease-in-out;
$loader-max-opacity: 0.75;

@keyframes loader-changing {
  0% {
    opacity: 0;
    top: 100vh;
  }

  50% {
    opacity: $loader-max-opacity;
  }

  100% {
    opacity: 0;
    top: -($loader-height + $loader-width);
  }
}

@keyframes loader-getting {
  0% {
    opacity: 0;
    top: -($loader-height + $loader-width);
  }

  50% {
    opacity: $loader-max-opacity;
  }

  100% {
    opacity: 0;
    top: 100vh;
  }
}

.loader {
  border-radius: 0 $loader-width $loader-width 0;
  height: $loader-height;
  left: 0;
  position: fixed;
  top: -($loader-height);
  transition: opacity 0.5s;
  width: $loader-width;

  &.changing {
    background-color: colors.$bg-changing;
    border-radius: 0 $loader-width 0 0;

    animation:
      loader-changing $loader-speed $loader-timing-function infinite;
  }

  &.getting {
    background-color: colors.$bg-getting;
    border-radius: 0 0 $loader-width 0;

    animation:
      loader-getting $loader-speed $loader-timing-function infinite;
  }
}
</style>
