<template functional>
  <div
    class="loader"
    :class="{'uploading': props.uploading, 'downloading': props.downloading}"
  />
</template>

<script>
export default {
  functional: true,
  props: {
    uploading: {
      type: Boolean,
      default: false,
    },
    downloading: {
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

@keyframes loader-uploading {
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

@keyframes loader-downloading {
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
  height: $loader-height;
  left: 0;
  position: fixed;
  top: -($loader-height);
  transition: opacity 0.5s;
  width: $loader-width;

  &.uploading:after, &.uploading:before,
  &.downloading:after, &.downloading:before {
    content: "";
    height: 0;
    left: 0;
    position: absolute;
    width: 0;
  }

  &.uploading {
    background-color: colors.$bg-upload;

    &:before {
      border-top: 0;
      border-bottom: $loader-width solid colors.$bg-upload;
      border-left: 0;
      border-right: $loader-width solid transparent;
      top: -($loader-width);
    }

    &:after {
      border-top: $loader-width solid colors.$bg-upload;
      border-bottom: 0;
      border-left: $loader-width solid transparent;
      border-right: 0;

      bottom: -($loader-width);
    }

    animation:
      loader-uploading $loader-speed $loader-timing-function infinite;
  }

  &.downloading {
    background-color: colors.$bg-download;

    &:before {
      border-top: 0;
      border-bottom: $loader-width solid colors.$bg-download;
      border-left: $loader-width solid transparent;
      border-right: 0;
      top: -($loader-width);
    }

    &:after {
      border-top: $loader-width solid colors.$bg-download;
      border-bottom: 0;
      border-left: 0;
      border-right: $loader-width solid transparent;
      bottom: -($loader-width);
    }

    animation:
      loader-downloading $loader-speed $loader-timing-function infinite;
  }
}
</style>
