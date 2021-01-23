<template>
  <div class="preference_wrap">
    <div class="settings">
      <div>mode: {{ displayMode }}</div>
      <el-input
        v-model="mainTarget"
        class="setting_input bottom_space"
        placeholder="目標を達成しろ！"
        :maxlength="targetMaxlength.main"
      >
        <template #prepend>主目標</template>
      </el-input>
      <el-input
        v-for="(target, index) in targets"
        v-model="targets[index]"
        class="setting_input bottom_space"
        placeholder="目標を設定しろ"
        :maxlength="targetMaxlength.sub"
        :key="'target_' + index"
      >
        <template #prepend>目標{{ index + 1 }}</template>
      </el-input>
      <div class="checkboxes bottom_space">
        <el-checkbox-button v-model="others.onTop" label="最前面固定" />
      </div>
    </div>
    <el-button @click.stop="onSaveButtonClick" type="primary">保存</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from "vue";
import { DisplayMode } from "@/constants/display-mode";
import { WindowNames } from "@/constants/window-name";
import {
  scrambleModeTargetSettingDefault,
  scrambleModeTargetTextMaxlength,
  TargetSettingInterface
} from "@/constants/target";

export default defineComponent({
  name: "Preference",
  setup() {
    const displayMode = ref<string>(
      window.electronApi.getStore("settings.mode", DisplayMode.SCRAMBLE)
    );

    // TODO 複数window対応
    const settings: TargetSettingInterface = window.electronApi.getStore(
      `setting.${displayMode.value}.1`,
      scrambleModeTargetSettingDefault
    );
    const mainTarget = ref<string>(
      settings.mainTarget.slice(0, scrambleModeTargetTextMaxlength.main)
    );
    const targets = ref<string[]>([]);
    settings.targets.forEach((target: string) => {
      targets.value.push(target.slice(0, scrambleModeTargetTextMaxlength.main));
    });

    // other settings
    const others = ref(
      reactive({
        onTop: false
      })
    );
    if (settings.others && settings.others.onTop) {
      others.value.onTop = settings.others.onTop;
    }

    onMounted(() => {
      document.body.className = "preference";
    });

    const onSaveButtonClick = () => {
      window.electronApi.addStore(`setting.${displayMode.value}.1`, {
        mainTarget: mainTarget.value,
        targets: targets.value.map(target => target),
        others: {
          onTop: others.value.onTop
        }
      });
      // TODO 複数window対応
      window.electronApi.reloadWindow(WindowNames.Main);
      // FIXME Preferenceを開いたWindowのindexをここまで渡す
      window.electronApi.setAlwaysOnTop(1, others.value.onTop);

      window.electronApi.closeWindow(WindowNames.Preference);
    };

    const targetMaxlength = scrambleModeTargetTextMaxlength;

    return {
      displayMode,
      mainTarget,
      targets,
      others,
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

    .bottom_space {
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
