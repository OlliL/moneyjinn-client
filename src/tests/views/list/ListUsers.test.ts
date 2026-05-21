import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
import UserServiceMocker from "@/service/mocker/UserServiceMocker";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { ButtonView, InputView, ModalView, RowView } from "@/tests/TestViews";
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
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new RowView("div-filter-mobile-sheet");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileAccordion = new RowView("user-mobile-accordion");
  static readonly MobileRowAdmin = new RowView("user-mobile-row-1");
  static readonly MobileRowSusan = new RowView("user-mobile-row-2");
  static readonly MobileEditAdminButton = new ButtonView("user-mobile-edit-1");
  static readonly MobileDeleteAdminButton = new ButtonView(
    "user-mobile-delete-1",
  );
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

test("ListUsers filters via mobile sheet", async () => {
  render(ListUsers);

  await ListUsersView.MobileAccordion.assertToBeVisible();
  await ListUsersView.MobileFilterTrigger.click();
  await ListUsersView.MobileFilterSheet.assertToBeVisible();
  await ListUsersView.MobileFilterInput.setValue("sus");

  await ListUsersView.MobileRowSusan.assertToBeVisible();
  await ListUsersView.MobileRowAdmin.assertNotToBeInDocument();
});

test("ListUsers opens edit modal from mobile action", async () => {
  render(ListUsers);

  await ListUsersView.MobileRowAdmin.assertToBeVisible();
  await ListUsersView.MobileEditAdminButton.click();
  await ListUsersView.Modal.assertOpen();
});

test("ListUsers opens delete modal from mobile action", async () => {
  render(ListUsers);

  await ListUsersView.MobileRowAdmin.assertToBeVisible();
  await ListUsersView.MobileDeleteAdminButton.click();
  await ListUsersView.Modal.assertOpen();
});
