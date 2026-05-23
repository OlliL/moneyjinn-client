import { config } from "@vue/test-utils";
import I18nSingleton from "./src/config/I18nSingleton";
import "vitest-canvas-mock";

config.global.plugins.push(I18nSingleton.getI18n());
if (globalThis.HTMLElement !== undefined) {
  globalThis.HTMLElement.prototype.scrollIntoView = () => {};
}

/**
 * jest's jsdom impl fails to call listeners when an event is dispatched.
 * @see https://github.com/jsdom/jsdom/issues/2156
 */
type EventListenerLike = EventListenerOrEventListenerObject;
const eventListeners = new WeakMap<
  object,
  Map<string, Set<EventListenerLike>>
>();

const getListenersByType = (
  target: object,
): Map<string, Set<EventListenerLike>> => {
  let listenersByType = eventListeners.get(target);
  if (!listenersByType) {
    listenersByType = new Map<string, Set<EventListenerLike>>();
    eventListeners.set(target, listenersByType);
  }
  return listenersByType;
};

globalThis.EventTarget = class EventTargetPolyfill {
  addEventListener(type: string, listener: EventListenerLike | null): void {
    if (!listener) {
      return;
    }
    const listenersByType = getListenersByType(this);
    let typeListeners = listenersByType.get(type);
    if (!typeListeners) {
      typeListeners = new Set<EventListenerLike>();
      listenersByType.set(type, typeListeners);
    }
    typeListeners.add(listener);
  }

  removeEventListener(type: string, listener: EventListenerLike | null): void {
    if (!listener) {
      return;
    }
    getListenersByType(this).get(type)?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    getListenersByType(this)
      .get(event.type)
      ?.forEach((listener) => {
        if (typeof listener === "function") {
          listener.call(this, event);
        } else {
          listener.handleEvent(event);
        }
      });
    return !event.defaultPrevented;
  }
};

if (typeof Element !== "undefined") {
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.hasPointerCapture = () => false;
}

globalThis.PointerEvent = class PointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.pointerId = params.pointerId ?? 1;
    this.pointerType = params.pointerType ?? "mouse";
  }
} as unknown as typeof PointerEvent;

globalThis.ResizeObserver = class ResizeObserver implements ResizeObserver {
  observe(): void {
    // Mock observe method
  }
  unobserve(): void {
    // Mock unobserve method
  }
  disconnect(): void {
    // Mock disconnect method
  }
};

// for Modal.vue: force Dialog instead of Drawer because of timer issues in vitest
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query.includes("min-width") || query.includes("640px"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
