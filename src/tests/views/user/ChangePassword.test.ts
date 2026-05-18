import router, { Routes } from "@/router";
import UserService from "@/service/UserService";
import { type UserSession, useUserSessionStore } from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, InputView } from "@/tests/TestViews";
import ChangePassword from "@/views/user/ChangePassword.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

const { mockRouterPush } = vi.hoisted(() => ({
  mockRouterPush: vi.fn(),
}));

vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return {
    ...actual,
    default: { push: mockRouterPush },
  };
});

vi.mock("@/service/UserService");

class ChangePasswordView {
  static readonly OldPasswordInput = new InputView("passwordOld");
  static readonly NewPasswordInput = new InputView("password1");
  static readonly VerifyPasswordInput = new InputView("password2");
  static readonly SubmitButton = new ButtonView("change-password-submit");
}

const fillAndSubmit = async () => {
  await ChangePasswordView.OldPasswordInput.setValue("old-secret");
  await ChangePasswordView.NewPasswordInput.setValue("new-secret");
  await ChangePasswordView.VerifyPasswordInput.setValue("new-secret");
  await ChangePasswordView.SubmitButton.click();
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "oliver",
    userIsAdmin: true,
    userCanLogin: true,
    userIsNew: false,
  } as UserSession);
  vi.mocked(UserService.changePassword).mockResolvedValue();
});

test("ChangePassword changes password and redirects existing users to home", async () => {
  render(ChangePassword);

  await fillAndSubmit();

  await assertHaveBeenCalledWith(
    UserService.changePassword,
    "old-secret",
    "new-secret",
  );
  await assertHaveBeenCalledWith(router.push, { name: Routes.Home });
});

test("ChangePassword logs out new users and redirects to login", async () => {
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "oliver",
    userIsAdmin: true,
    userCanLogin: true,
    userIsNew: true,
  } as UserSession);

  render(ChangePassword);

  await fillAndSubmit();

  await assertHaveBeenCalledWith(
    UserService.changePassword,
    "old-secret",
    "new-secret",
  );
  await assertHaveBeenCalledWith(router.push, { name: Routes.Login });
  expect(useUserSessionStore().userSession.userId).toBe(0);
});



