import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { ElButton, ElInput } from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "@/assets/scss/font.scss";

const app = createApp(App).use(router);

const components = [ElButton, ElInput];
components.forEach(component => {
  app.component(component.name, component);
});

app.mount("#app");
