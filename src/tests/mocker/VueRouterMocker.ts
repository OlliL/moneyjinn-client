import { vi } from "vitest";

type UseRouteResult = {
  name?: string;
  meta?: Record<string, unknown>;
};

export default class VueRouterMocker {
  static readonly onBeforeRouteUpdate = vi.fn();

  static readonly useRoute = vi.fn<() => UseRouteResult>(() => ({
    name: undefined,
    meta: {},
  }));

  static createModule(
    actual: typeof import("vue-router"),
    options?: {
      mockOnBeforeRouteUpdate?: boolean;
      mockUseRoute?: boolean;
    },
  ) {
    return {
      ...actual,
      ...(options?.mockOnBeforeRouteUpdate
        ? { onBeforeRouteUpdate: VueRouterMocker.onBeforeRouteUpdate }
        : {}),
      ...(options?.mockUseRoute ? { useRoute: VueRouterMocker.useRoute } : {}),
    };
  }

  static setRoute(route: UseRouteResult): void {
    VueRouterMocker.useRoute.mockReturnValue(route);
  }

  static reset(): void {
    VueRouterMocker.onBeforeRouteUpdate.mockReset();
    VueRouterMocker.useRoute.mockReset();
    VueRouterMocker.useRoute.mockReturnValue({ name: undefined, meta: {} });
  }
}

