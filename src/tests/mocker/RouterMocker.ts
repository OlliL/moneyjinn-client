import { vi } from "vitest";

export default class RouterMocker {
  static readonly push = vi.fn();

  static createModule(actual: typeof import("@/router")) {
    return {
      ...actual,
      default: {
        ...actual.default,
        push: RouterMocker.push,
      },
    };
  }

  static reset(): void {
    RouterMocker.push.mockReset();
  }
}

