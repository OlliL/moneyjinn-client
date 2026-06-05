import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import {
  ButtonView,
  DeclarativeModalStub,
  InputView,
  MobilePopupMenu,
  ModalView,
  RowView,
} from "@/tests/TestViews";
import ListGroups from "@/views/group/ListGroups.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/GroupService");

class ListGroupsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new MobilePopupMenu(
    "div-filter-mobile-sheet",
  );
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileAccordion = new RowView("group-mobile-accordion");
  static readonly MobileRowOne = new RowView("group-mobile-row-1");
  static readonly MobileRowTwo = new RowView("group-mobile-row-2");
  static readonly MobileEditOneButton = new ButtonView("group-mobile-edit-1");
  static readonly MobileDeleteOneButton = new ButtonView(
    "group-mobile-delete-1",
  );
  static readonly RowOne = new RowView("group-row-1");
  static readonly RowTwo = new RowView("group-row-2");
  static readonly EditOneButton = new ButtonView("group-edit-1");
  static readonly DeleteOneButton = new ButtonView("group-delete-1");
  static readonly CreateModal = new ModalView("app-modal-CreateGroup");
  static readonly DeleteModal = new ModalView("app-modal-DeleteGroup");
  static readonly EmptyRowDesktop = new RowView("group-empty-desktop");
  static readonly EmptyRowMobile = new RowView("group-empty-mobile");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  GroupServiceMocker.mockFetchAllGroup([
    { id: 1, name: "Group 1" },
    { id: 2, name: "Household" },
  ]);
});

test("ListGroups loads and renders groups on mount", async () => {
  render(ListGroups, {
    global: { stubs: { ModalVue: DeclarativeModalStub } },
  });

  await ListGroupsView.RowOne.assertToBeVisible();
});

test("ListGroups filters groups by search input", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.FilterInput.setValue("house");
  await ListGroupsView.RowTwo.assertToBeVisible();
  await ListGroupsView.RowOne.assertNotToBeInDocument();
});

test("ListGroups opens create modal", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.CreateButton.click();
  await ListGroupsView.CreateModal.assertOpen();
});

test("ListGroups opens edit modal from row action", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.EditOneButton.click();
  await ListGroupsView.CreateModal.assertOpen();
});

test("ListGroups opens delete modal from row action", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.DeleteOneButton.click();
  await ListGroupsView.DeleteModal.assertOpen();
});

test("ListGroups filters via mobile sheet", async () => {
  render(ListGroups);

  await ListGroupsView.MobileAccordion.assertToBeVisible();
  await ListGroupsView.MobileFilterTrigger.click();
  await ListGroupsView.MobileFilterSheet.assertToBeVisible();
  await ListGroupsView.MobileFilterInput.setValue("house");

  await ListGroupsView.MobileRowTwo.assertToBeVisible();
  await ListGroupsView.MobileRowOne.assertNotToBeInDocument();
});

test("ListGroups opens edit modal from mobile action", async () => {
  render(ListGroups);

  await ListGroupsView.MobileRowOne.assertToBeVisible();
  await ListGroupsView.MobileEditOneButton.click();
  await ListGroupsView.CreateModal.assertOpen();
});

test("ListGroups opens delete modal from mobile action", async () => {
  render(ListGroups);

  await ListGroupsView.MobileRowOne.assertToBeVisible();
  await ListGroupsView.MobileDeleteOneButton.click();
  await ListGroupsView.DeleteModal.assertOpen();
});

test("ListGroups shows empty state for desktop and mobile if list is empty", async () => {
  // Arrange: Mock empty group list
  GroupServiceMocker.mockFetchAllGroup([]);

  // Act
  render(ListGroups);

  // Assert: Both empty states are visible
  await ListGroupsView.EmptyRowDesktop.assertToBeVisible();
  await ListGroupsView.EmptyRowMobile.assertToBeVisible();
});
