<template>
  <div class="main_target">
    <div class="wrap">
      <span class="r">{{ target }}</span>
    </div>
    <div class="wrap">
      <span class="g">{{ target }}</span>
    </div>
    <div class="wrap">
      <span class="b">{{ target }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainTarget",
  props: {
    target: String
  }
});
</script>

<style lang="scss" scoped>
.main_target {
  display: inline-block;
  position: relative;

  .wrap {
    animation: scramble-target-animation1 0.8s linear infinite;
    background-color: rgba(255, 0, 0, 0.3);
    border: 1px solid transparent;
    border-radius: 3px;
    box-shadow: 0px 0px 5px 1px rgba(255, 0, 0, 0.2);
    display: inline-block;
    padding: 10px 70px;
    position: absolute;
    right: 0;

    $originDelay: 3s;
    &:first-of-type {
      animation-delay: $originDelay * 2;
      margin: 0 0 20px 0;
      position: static;
    }
    &:nth-of-type(2) {
      animation-delay: $originDelay;
    }
    &:nth-of-type(3) {
      animation-delay: $originDelay * 3;
    }

    > span {
      animation: scramble-target-animation2 1s linear infinite;
      color: white;
      font-size: 40px;
      font-weight: bolder;
      display: inline-block;
      white-space: nowrap;
    }
  }
}

@keyframes scramble-target-animation1 {
  0%,
  100% {
    right: 0;
    transform: rotate(0);
  }
  25% {
    right: 1.5px;
    transform: rotate(-0.5deg);
  }
  75% {
    right: -1.5px;
    transform: rotate(0.5deg);
  }
}

@keyframes scramble-target-animation2 {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(0.5deg);
  }
  75% {
    transform: rotate(-0.5deg);
  }
}
</style>
