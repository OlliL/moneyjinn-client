import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

import App from "./App.vue";
import router from "./router";

import "vanillajs-datepicker/css/datepicker.min.css";

import "./style.css";

import I18nSingleton from "./config/I18nSingleton";
import { jsonParseWithDate } from "./tools/PiniaUtil";
import { AxiosSingleton } from "./config/AxiosSingleton";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(
  PiniaSharedState({
    enable: true,
    serializer: {
      serialize: JSON.stringify,
      deserialize: jsonParseWithDate,
    },
  }),
);

app.use(router);
app.use(I18nSingleton.getI18n());
app.use(pinia);

AxiosSingleton.getInstance();

app.mount("#app");
