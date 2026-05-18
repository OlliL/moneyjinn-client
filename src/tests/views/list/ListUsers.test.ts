import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
import UserServiceMocker from "@/service/mocker/UserServiceMocker";
import { ButtonView, InputView, ModalView, RowView } from "@/tests/TestViews";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import ListUsers from "@/views/user/ListUsers.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/UserService");
vi.mock("@/service/GroupService");

class ListUsersView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly RowAdmin = new RowView("user-row-1");
  static readonly RowSusan = new RowView("user-row-2");
  static readonly EditAdminButton = new ButtonView("user-edit-1");
  static readonly DeleteAdminButton = new ButtonView("user-delete-1");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  GroupServiceMocker.mockFetchAllGroup([{ id: 1, name: "Default group" }]);
  UserServiceMocker.mockFetchAllUser([
    {
      id: 2,
      userName: "susan",
      userIsNew: true,
      role: "USER",
    } as never,
    {
      id: 1,
      userName: "admin",
      userIsNew: false,
      role: "ADMIN",
    } as never,
  ]);
  UserServiceMocker.mockGetAllAccessRelations([]);
});

test("ListUsers loads and renders users on mount", async () => {
  render(ListUsers);

  await ListUsersView.RowAdmin.assertToBeVisible();
});

test("ListUsers filters rows by search input", async () => {
  render(ListUsers);

  await ListUsersView.RowAdmin.assertToBeVisible();
  await ListUsersView.FilterInput.setValue("sus");
  await ListUsersView.RowSusan.assertToBeVisible();
  await ListUsersView.RowAdmin.assertNotToBeInDocument();
});

test("ListUsers opens create modal", async () => {
  render(ListUsers);

  await ListUsersView.RowAdmin.assertToBeVisible();
  await ListUsersView.CreateButton.click();
  await ListUsersView.Modal.assertOpen();
});

test("ListUsers opens edit modal from row action", async () => {
  render(ListUsers);

  await ListUsersView.RowAdmin.assertToBeVisible();
  await ListUsersView.EditAdminButton.click();
  await ListUsersView.Modal.assertOpen();
});

test("ListUsers opens delete modal from row action", async () => {
  render(ListUsers);

  await ListUsersView.RowAdmin.assertToBeVisible();
  await ListUsersView.DeleteAdminButton.click();
  await ListUsersView.Modal.assertOpen();
});

