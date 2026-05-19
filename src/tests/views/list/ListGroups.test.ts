import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { ButtonView, InputView, ModalView, RowView } from "@/tests/TestViews";
import ListGroups from "@/views/group/ListGroups.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/GroupService");

class ListGroupsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly RowOne = new RowView("group-row-1");
  static readonly RowTwo = new RowView("group-row-2");
  static readonly EditOneButton = new ButtonView("group-edit-1");
  static readonly DeleteOneButton = new ButtonView("group-delete-1");
  static readonly Modal = new ModalView("app-modal");
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
  render(ListGroups);

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
  await ListGroupsView.Modal.assertOpen();
});

test("ListGroups opens edit modal from row action", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.EditOneButton.click();
  await ListGroupsView.Modal.assertOpen();
});

test("ListGroups opens delete modal from row action", async () => {
  render(ListGroups);

  await ListGroupsView.RowOne.assertToBeVisible();
  await ListGroupsView.DeleteOneButton.click();
  await ListGroupsView.Modal.assertOpen();
});
