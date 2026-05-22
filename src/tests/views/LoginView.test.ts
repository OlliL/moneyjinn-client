import router, { Routes } from "@/router";
import UserService from "@/service/UserService";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { AlertView, ButtonView, InputView } from "@/tests/TestViews";
import LoginView from "@/views/LoginView.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

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

class LoginViewPage {
  static readonly UsernameInput = new InputView("username");
  static readonly PasswordInput = new InputView("password");
  static readonly SubmitButton = new ButtonView("login-submit");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
});

test("LoginView logs in and redirects to home", async () => {
  vi.mocked(UserService.login).mockResolvedValue();

  render(LoginView);

  await LoginViewPage.UsernameInput.setValue("oliver");
  await LoginViewPage.PasswordInput.setValue("secret");
  await LoginViewPage.SubmitButton.click();

  await assertHaveBeenCalledWith(UserService.login, "oliver", "secret");
  await assertHaveBeenCalledWith(router.push, { name: Routes.Home });
});

test("LoginView shows provided login error", async () => {
  render(LoginView, {
    props: {
      error: "Session abgelaufen",
    },
  });

  await new AlertView("serverError-item").assertMessageContains(
    "Session abgelaufen",
  );
});
