import { createApp } from "vue";
import { createI18n } from "vue-i18n";
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

import de from "./locales/de.json";
import en from "./locales/en.json";

const i18n = createI18n({
  legacy: false,
  locale: navigator.language,
  fallbackLocale: "en",
  messages: { de, en },
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(
  PiniaSharedState({
    enable: true,
  })
);

app.use(pinia);
app.use(router);
app.use(i18n);

AxiosInstanceHolder.getInstance();

app.mount("#app");
