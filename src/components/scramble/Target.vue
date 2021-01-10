<template>
  <div class="target">
    <span v-if="index === 0" class="current">
      『&nbsp;&nbsp;&nbsp;{{ target }}&nbsp;&nbsp;&nbsp;』
    </span>
    <span v-else>{{ target }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Target",
  props: {
    target: String,
    index: Number
  }
});
</script>

<style lang="scss" scoped>
.target {
  color: white;
  font-weight: bolder;
  display: inline-block;
  text-shadow: -4px -2px black;

  &:not(:last-of-type) {
    margin: 0 0 10px 0;
  }

  > span {
    background: linear-gradient(transparent, black, transparent);
    font-size: 20px;
    white-space: nowrap;
    &.current {
      font-size: 28px;
    }
  }
}
</style>
