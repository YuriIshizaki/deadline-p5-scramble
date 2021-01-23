<template>
  <div class="home" ref="rootNode">
    <main-target
      :width="mainTargetSvgWidth"
      :target="setting.mainTarget"
      class="main_target"
      @onMountedText="onMountedMainTargetText"
    />
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
import { scrambleWindowMinSize } from "@/constants/window-size";
import { scrambleModeTargetTextMaxlength } from "@/constants/target";
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
    setting.mainTarget = DefaultTargetSetting.mainTarget.slice(
      0,
      scrambleModeTargetTextMaxlength.main
    );
  }

  const targetTemp: string[] = [];
  setting.targets
    .filter((target: string) => target !== "")
    .forEach((target: string) => {
      targetTemp.push(target.slice(0, scrambleModeTargetTextMaxlength.sub));
    });
  setting.targets = targetTemp;
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
    const targetRef = ref<HTMLDivElement>();

    const mainTargetWidth = ref<number>(0);
    const targetWidth = ref<number>(0);

    const _setWindowSize = () => {
      if (
        rootNode.value &&
        mainTargetWidth.value !== 0 &&
        targetWidth.value !== 0
      ) {
        const height = rootNode.value.getBoundingClientRect().height as number;
        const width = compare(mainTargetWidth.value, targetWidth.value);
        setWindowSize(
          Number(index),
          Math.ceil(height) + 20,
          Math.ceil(width) + 20
        );
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (targetRef.value) {
          targetWidth.value = Math.ceil(
            targetRef.value.getBoundingClientRect().width
          );
          _setWindowSize();
        }
      });
    });

    const mainTargetSvgWidth = ref<number>(scrambleWindowMinSize.width);
    const onMountedMainTargetText = (width: number) => {
      const temp = width + 50;
      mainTargetSvgWidth.value =
        temp < scrambleWindowMinSize.width ? scrambleWindowMinSize.width : temp;

      mainTargetWidth.value = mainTargetSvgWidth.value;
      _setWindowSize();
    };

    return {
      setting,
      rootNode,
      targetRef,
      onMountedMainTargetText,
      mainTargetSvgWidth
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

  .main_target {
    margin: 0 0 10px 0;
  }

  .target_wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
