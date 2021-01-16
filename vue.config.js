module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/plugins/preload.ts",
      nodeIntegration: false,
      builderOptions: {
        productName: "DeadlineP5-Scramble",
        appId: "com.yuri-ishizaki.deadlinep5scramble",
        mac: {
          icon: "icon/app_icon.png",
          target: [
            {
              target: "dmg",
              arch: ["x64"]
            }
          ]
        }
      }
    }
  }
};
