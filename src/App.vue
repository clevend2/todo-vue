<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@use '@/assets/scss/_colors' as colors;

@import url('~normalize.css/normalize.css');

body {
  background-color: colors.$backdrop;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
