import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import "../node_modules/vanillajs-datepicker/dist/css/datepicker-bs5.min.css";

import { AxiosInstanceHolder } from "./handler/AxiosInstanceHolder";
import I18nHolder from "./handler/I18nHolder";
import { jsonParseWithDate } from "./tools/PiniaUtil";

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
app.use(I18nHolder.getI18n());
app.use(pinia);

AxiosInstanceHolder.getInstance();

app.mount("#app");
