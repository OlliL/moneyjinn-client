import { WebSocketSingleton } from "@/config/WebSocketSingleton";
import router, { Routes } from "@/router";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import {
  assertHaveBeenCalled,
  assertHaveBeenCalledWith,
} from "@/tests/TestUtil";
import AppNavigation from "@/views/navigation/AppNavigation.vue";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { defineComponent } from "vue";

const {
  mockRouterPush,
  mockInitAllStores,
  mockConnectStompClient,
  mockDisconnectStompClient,
  mockClearAuthTokens,
  mockLogoutApiCall,
} = vi.hoisted(() => ({
  mockRouterPush: vi.fn(),
  mockInitAllStores: vi.fn(),
  mockConnectStompClient: vi.fn(),
  mockDisconnectStompClient: vi.fn(),
  mockClearAuthTokens: vi.fn(),
  mockLogoutApiCall: vi.fn(),
}));

vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return {
    ...actual,
    default: { push: mockRouterPush },
  };
});

vi.mock("@/stores/StoreService", () => ({
  StoreService: {
    getInstance: () => ({ initAllStores: mockInitAllStores }),
  },
}));

vi.mock("@/config/WebSocketSingleton", () => ({
  WebSocketSingleton: {
    getInstance: () => ({
      connectStompClient: mockConnectStompClient,
      disconnectStompClient: mockDisconnectStompClient,
    }),
  },
}));

vi.mock("axios-jwt", async () => {
  const actual = await vi.importActual<typeof import("axios-jwt")>("axios-jwt");
  return {
    ...actual,
    clearAuthTokens: mockClearAuthTokens,
  };
});

vi.mock("@/api", async () => {
  const actual = await vi.importActual<typeof import("@/api")>("@/api");
  return {
    ...actual,
    LogoutApi: class {
      logout() {
        return mockLogoutApiCall();
      }
    },
  };
});

vi.mock("@/config/AxiosSingleton", () => ({
  AxiosSingleton: {
    getInstance: () => ({ getAxiosInstance: () => ({}) }),
  },
}));

vi.mock("vue-router", async () => {
  const actual =
    await vi.importActual<typeof import("vue-router")>("vue-router");
  return {
    ...actual,
    useRoute: () => ({ meta: {} }),
  };
});

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  mockInitAllStores.mockResolvedValue(undefined);
  mockLogoutApiCall.mockResolvedValue(undefined);
  mockClearAuthTokens.mockResolvedValue(undefined);
  useUserSessionStore().setUserSession({
    userId: 7,
    userName: "oliver",
    userIsAdmin: true,
    userCanLogin: true,
    userIsNew: false,
  } as UserSession);
});

const renderView = (props: Record<string, unknown> = {}) => {
  render(defineComponent({
    setup() {
      return { props };
    },
    template: '<AppNavigation v-bind="props" />',
    components: { AppNavigation },
  }), {
    global: {
      stubs: {
        "router-link": {
          template: "<a><slot /></a>",
        },
        "router-view": {
          template: "<div />",
        },
      },
    },
  });
};

test("AppNavigation initializes websocket and stores on mount", async () => {
  renderView();

  await assertHaveBeenCalled(
    WebSocketSingleton.getInstance().connectStompClient,
  );
  await assertHaveBeenCalled(StoreService.getInstance().initAllStores);
});

test("AppNavigation redirects to login if store initialization fails", async () => {
  mockInitAllStores.mockRejectedValueOnce(new Error("init failed"));

  renderView();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.Login,
    }),
  );
});

test("AppNavigation logout clears session and redirects to login", async () => {
  renderView();

  const user = userEvent.setup();
  const logoutIcon = screen
    .getByTitle(/logout/i)
    .querySelector("svg.lucide-log-out") as SVGElement;
  await user.click(logoutIcon);

  await assertHaveBeenCalled(
    WebSocketSingleton.getInstance().disconnectStompClient,
  );
  await assertHaveBeenCalled(mockLogoutApiCall);
  await assertHaveBeenCalled(mockClearAuthTokens);
  await assertHaveBeenCalledWith(router.push, { name: Routes.Login });

  expect(useUserSessionStore().userSession.userId).toBe(0);
});
