import { createApp, devtools } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { PiniaSharedState } from "pinia-shared-state";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import "../node_modules/vanillajs-datepicker/dist/css/datepicker-bs5.min.css";
import WebServer from "./handler/WebServer";

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

app.mount("#app");

const server = devtools ? "localhost:8080" : "bomba.salatschuessel.net:8080";
WebServer.setWebServer(server);
