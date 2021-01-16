<template>
  <svg
    :style="{
      height: height,
      width: width
    }"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g stroke-linecap="round" :style="scaleStyle">
      <path class="main_path" :d="path" />
      <text
        ref="textRef"
        dominant-baseline="middle"
        :x="width * 0.5"
        :y="height * 0.5"
      >
        {{ target }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

export default defineComponent({
  name: "MainTarget",
  props: {
    target: String,
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 60
    },
    scale: {
      type: Number,
      default: 1.0
    }
  },
  setup(props, context) {
    const scaleStyle = computed(() => {
      return {
        transform: `scale(${props.scale}) translate(5px, 0)`
      };
    });

    const viewBox = computed(() => `0, 0, ${props.width}, ${props.height}`);
    const path = computed(
      () => `M0, 0
        L${props.width - 5 - 5}, 3
        L${props.width - 5}, ${props.height}
        L0, ${props.height}
        L-5, ${props.height * 0.25}
        L0,0 z`
    );

    const textRef = ref<HTMLElement>();

    onMounted(() => {
      if (textRef.value) {
        const textWidth = textRef.value.getBoundingClientRect().width;
        context.emit("onMountedText", Math.ceil(textWidth));
      }
    });

    return {
      scaleStyle,
      viewBox,
      path,
      textRef
    };
  }
});
</script>

<style lang="scss" scoped>
svg {
  path {
    $color: rgba(255, 20, 0, 0.8);
    fill: $color;
    stroke: $color;
    stroke-width: 0.5;
  }
  text {
    fill: white;
    font-size: 30px;
    font-weight: bold;
    text-anchor: middle;
    transform: rotate(-0.5deg);
    transform-origin: 50% 50%;
  }
}
</style>
