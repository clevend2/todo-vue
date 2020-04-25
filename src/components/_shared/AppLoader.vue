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

@keyframes loader-uploading {
  0% {
    opacity: 0;
    top: 100vh;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    top: -($loader-height + $loader-width/2);
  }
}

@keyframes loader-downloading {
  0% {
    opacity: 0;
    top: -($loader-height + $loader-width/2);
  }

  50% {
    opacity: 1;
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
      border-top: $loader-width/2 solid transparent;
      border-bottom: $loader-width/2 solid colors.$bg-upload;
      border-left: $loader-width/2 solid colors.$bg-upload;
      border-right: $loader-width/2 solid transparent;
      top: -($loader-width/2);
    }

    &:after {
      border-top: $loader-width/2 solid colors.$bg-upload;
      border-bottom: $loader-width/2 solid transparent;
      border-left: $loader-width/2 solid transparent;
      border-right: $loader-width solid colors.$bg-upload;

      top: $loader-height;
    }

    animation:
      loader-uploading $loader-speed $loader-timing-function infinite;
  }

  &.downloading {
    background-color: colors.$bg-download;

    &:before {
      border-top: $loader-width/2 solid transparent;
      border-bottom: $loader-width/2 solid colors.$bg-download;
      border-left: $loader-width/2 solid transparent;
      border-right: $loader-width/2 solid colors.$bg-download;
      top: -($loader-width/2);
    }

    &:after {
      border-top: $loader-width/2 solid colors.$bg-download;
      border-bottom: $loader-width/2 solid transparent;
      border-left: $loader-width/2 solid colors.$bg-download;
      border-right: $loader-width/2 solid transparent;
      bottom: -($loader-width);
    }

    animation:
      loader-downloading $loader-speed $loader-timing-function infinite;
  }
}
</style>
