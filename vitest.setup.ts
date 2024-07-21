import { config } from "@vue/test-utils";
import I18nSingleton from "./src/config/I18nSingleton";

config.global.plugins.push(I18nSingleton.getI18n());

/**
 * jest's jsdom impl fails to call listeners when an event is dispatched.
 * @see https://github.com/jsdom/jsdom/issues/2156
 */
global.EventTarget = class {
  listeners = {};

  addEventListener(type, listener) {
    if (this.listeners === undefined) {
      this.listeners = {};
    }
    (this.listeners[type] || (this.listeners[type] = new Set())).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners[type]?.delete(listener);
  }

  dispatchEvent(event) {
    this.listeners[event.type].forEach((listener) => listener(event));
    return !event.defaultPrevented;
  }
};
