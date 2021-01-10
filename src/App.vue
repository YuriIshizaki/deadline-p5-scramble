<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App"
});
</script>

<style lang="scss">
*:not(input) {
  user-select: none;
  -webkit-app-region: drag;
}

body {
  height: 100vh;
  margin: 0;
  width: 100vw;
}
</style>
