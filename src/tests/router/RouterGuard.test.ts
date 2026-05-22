import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

const mockIsLoggedIn = vi.fn();
const mockRouterGo = vi.fn();

let registeredGuard: ((to: any, from: any) => Promise<any> | any) | undefined =
  undefined;

vi.mock("axios-jwt", () => ({
  isLoggedIn: mockIsLoggedIn,
}));

vi.mock("vue-router", () => ({
  createWebHistory: vi.fn(),
  createRouter: vi.fn(() => ({
    beforeEach: (guard: (to: any, from: any) => Promise<any> | any) => {
      registeredGuard = guard;
    },
    go: mockRouterGo,
  })),
}));

beforeEach(async () => {
  vi.resetModules();
  setActivePinia(createPinia());
  vi.clearAllMocks();
  registeredGuard = undefined;
  await import("@/router");
});

test("redirects to login when route requires auth and user is not logged in", async () => {
  const { Routes } = await import("@/router");
  mockIsLoggedIn.mockResolvedValueOnce(false);

  const result = await registeredGuard?.(
    {
      matched: [{ meta: {} }],
      name: Routes.Home,
      fullPath: "/app",
    },
    {
      fullPath: "/login",
    },
  );

  expect(result).toEqual({ name: Routes.Login });
});

test("allows change-password route directly", async () => {
  const { Routes } = await import("@/router");
  mockIsLoggedIn.mockResolvedValueOnce(true);

  const result = await registeredGuard?.(
    {
      matched: [{ meta: {} }],
      name: Routes.ChangePassword,
      fullPath: "/app/changePassword",
    },
    {
      fullPath: "/app",
    },
  );

  expect(result).toBe(true);
});

test("redirects new users to change-password", async () => {
  const { Routes } = await import("@/router");
  mockIsLoggedIn.mockResolvedValueOnce(true);
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "new-user",
    userIsAdmin: false,
    userCanLogin: true,
    userIsNew: true,
  } as UserSession);

  const result = await registeredGuard?.(
    {
      matched: [{ meta: {} }],
      name: Routes.Home,
      fullPath: "/app",
    },
    {
      fullPath: "/login",
    },
  );

  expect(result).toEqual({ name: Routes.ChangePassword });
});

test("reloads and cancels navigation when target equals source fullPath", async () => {
  const { Routes } = await import("@/router");
  mockIsLoggedIn.mockResolvedValueOnce(true);
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "oliver",
    userIsAdmin: true,
    userCanLogin: true,
    userIsNew: false,
  } as UserSession);

  const result = await registeredGuard?.(
    {
      matched: [{ meta: {} }],
      name: Routes.Home,
      fullPath: "/app/listReports",
    },
    {
      fullPath: "/app/listReports",
    },
  );

  await assertHaveBeenCalledWith(mockRouterGo, 0);
  expect(result).toBe(false);
});
