<template>
  <div class="preference_wrap">
    <div class="settings">
      <div>mode: {{ displayMode }}</div>
      <el-input
        v-model="mainTarget"
        class="setting_input"
        placeholder="目標を達成しろ！"
        :maxlength="targetMaxlength.main"
      >
        <template #prepend>主目標</template>
      </el-input>
      <el-input
        v-for="(target, index) in targets"
        v-model="targets[index]"
        class="setting_input"
        placeholder="目標を設定しろ"
        :maxlength="targetMaxlength.sub"
        :key="'target_' + index"
      >
        <template #prepend>目標{{ index + 1 }}</template>
      </el-input>
    </div>
    <el-button @click.stop="onSaveButtonClick" type="primary">保存</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { DisplayMode } from "@/constants/display-mode";
import { WindowNames } from "@/constants/window-name";
import { scrambleModeTargetTextMaxlength } from "@/constants/target";

export default defineComponent({
  name: "Preference",
  setup() {
    const displayMode = ref<string>(
      window.electronApi.getStore("settings.mode", DisplayMode.SCRAMBLE)
    );

    // TODO 複数window対応
    const settings = window.electronApi.getStore(
      `setting.${displayMode.value}.1`,
      {
        mainTarget: "",
        targets: ["", "", ""]
      }
    );
    const mainTarget = ref<string>(
      settings.mainTarget.slice(0, scrambleModeTargetTextMaxlength.main)
    );
    const targets = ref<string[]>([]);
    settings.targets.forEach((target: string) => {
      targets.value.push(target.slice(0, scrambleModeTargetTextMaxlength.main));
    });

    const onSaveButtonClick = () => {
      window.electronApi.addStore(`setting.${displayMode.value}.1`, {
        mainTarget: mainTarget.value,
        targets: targets.value.map(target => target)
      });
      // TODO 複数window対応
      window.electronApi.reloadWindow(WindowNames.Main);
      window.electronApi.closeWindow(WindowNames.Preference);
    };

    onMounted(() => {
      document.body.className = "preference";
    });

    const targetMaxlength = scrambleModeTargetTextMaxlength;

    return {
      displayMode,
      mainTarget,
      targets,
      onSaveButtonClick,
      targetMaxlength
    };
  }
});
</script>

<style lang="scss" scoped>
.preference_wrap {
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;

  .settings {
    width: 100%;

    .setting_input {
      margin: 0 0 10px 0;
    }
  }
}
</style>

<style lang="scss">
body.preference {
  background-color: white;
  height: calc(100vh - 10px * 2);
  margin: 10px;
  width: calc(100vw - 10px * 2);

  #app {
    height: 100%;
    width: 100%;
  }
}
</style>
