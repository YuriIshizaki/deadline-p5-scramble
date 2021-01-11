<template>
  <div class="home" ref="rootNode">
    <main-target :target="setting.mainTarget" ref="mainTargetRef" />
    <div class="target_wrap" ref="targetRef">
      <template v-for="(target, index) in setting.targets">
        <target
          v-if="setting.targets[index] !== ''"
          :target="target"
          :index="index"
          :key="target"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { DisplayMode } from "@/constants/display-mode";
import MainTarget from "@/components/scramble/MainTarget.vue";
import Target from "@/components/scramble/Target.vue";

const compare = (a: number, b: number) => {
  return a < b ? b : a;
};

const setWindowSize = (id: number, height: number, width: number) => {
  window.electronApi.resizeWindow(id, {
    height: height,
    width: width
  });
};

const DefaultTargetSetting = {
  mainTarget: "目標を達成しろ!",
  targets: ["目標を設定しろ"]
} as const;

interface TargetSettingInterface {
  mainTarget: string;
  targets: string[];
}

const getTargetSetting = (
  displayMode: string,
  index: string | number
): TargetSettingInterface => {
  const setting = window.electronApi.getStore(
    `setting.${displayMode}.${index}`,
    {
      mainTarget: "",
      targets: [""]
    }
  );
  if (setting.mainTarget === "") {
    setting.mainTarget = DefaultTargetSetting.mainTarget;
  }

  setting.targets = setting.targets.filter((target: string) => target !== "");
  if (
    setting.targets.length === 0 ||
    (setting.targets.length > 0 && setting.targets[0] === "")
  ) {
    setting.targets = DefaultTargetSetting.targets;
  }

  return setting;
};

export default defineComponent({
  name: "Scramble",
  components: { MainTarget, Target },
  setup() {
    const route = useRoute();
    let index = "none";
    if (route.query.index) {
      index = route.query.index as string;
    }
    const displayMode = window.electronApi.getStore(
      "settings.mode",
      DisplayMode.SCRAMBLE
    );
    const setting = getTargetSetting(displayMode, index);

    const rootNode = ref<HTMLDivElement>();
    const mainTargetRef = ref();
    const targetRef = ref<HTMLDivElement>();

    onMounted(() => {
      nextTick(() => {
        if (mainTargetRef.value.$el && targetRef.value) {
          const mainTargetWidth = mainTargetRef.value.$el.getBoundingClientRect()
            .width;
          const targetWidth = targetRef.value.getBoundingClientRect().width;
          const height = rootNode.value?.getBoundingClientRect()
            .height as number;
          const width = compare(mainTargetWidth, targetWidth);
          setWindowSize(
            Number(index),
            Math.ceil(height) + 20,
            Math.ceil(width) + 20
          );
        }
      });
    });

    return {
      setting,
      rootNode,
      mainTargetRef,
      targetRef
    };
  }
});
</script>

<style lang="scss" scoped>
.home {
  font-family: "ほのか丸ゴシック";
  overflow: hidden;
  padding: 10px;
  text-align: right;

  .target_wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
