import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { ButtonView, InputView, ModalView, RowView } from "@/tests/TestViews";
import ListPreDefMoneyflows from "@/views/predefmoneyflow/ListPreDefMoneyflows.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");

class ListPreDefMoneyflowsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new RowView("div-filter-mobile-sheet");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileAccordion = new RowView(
    "predef-moneyflow-mobile-accordion",
  );
  static readonly MobileRowOne = new RowView("predef-moneyflow-mobile-row-1");
  static readonly MobileRowTwo = new RowView("predef-moneyflow-mobile-row-2");
  static readonly MobileEditRowOneButton = new ButtonView(
    "predef-moneyflow-mobile-edit-1",
  );
  static readonly MobileDeleteRowOneButton = new ButtonView(
    "predef-moneyflow-mobile-delete-1",
  );
  static readonly RowOne = new RowView("predef-moneyflow-row-1");
  static readonly RowTwo = new RowView("predef-moneyflow-row-2");
  static readonly EditRowOneButton = new ButtonView("predef-moneyflow-edit-1");
  static readonly DeleteRowOneButton = new ButtonView(
    "predef-moneyflow-delete-1",
  );
  static readonly Modal = new ModalView("app-modal");
  static readonly EmptyRowDesktop = new RowView("predef-moneyflow-empty-desktop");
  static readonly EmptyRowMobile = new RowView("predef-moneyflow-empty-mobile");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([
    {
      id: 2,
      userId: 1,
      amount: 40,
      capitalsourceId: 1,
      contractpartnerId: 2,
      contractpartnerName: "Energy Corp",
      comment: "Electricity",
      onceAMonth: false,
      postingAccountId: 1,
    } as never,
    {
      id: 1,
      userId: 1,
      amount: 20.4,
      capitalsourceId: 1,
      contractpartnerId: 1,
      contractpartnerName: "Contractpartner 1",
      comment: "Rent",
      onceAMonth: false,
      postingAccountId: 1,
    } as never,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
});

test("ListPreDefMoneyflows loads and renders pre-defined moneyflows on mount", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.RowOne.assertToBeVisible();
});

test("ListPreDefMoneyflows filters rows by search input", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.RowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.FilterInput.setValue("energy");
  await ListPreDefMoneyflowsView.RowTwo.assertToBeVisible();
  await ListPreDefMoneyflowsView.RowOne.assertNotToBeInDocument();
});

test("ListPreDefMoneyflows opens create modal", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.RowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.CreateButton.click();
  await ListPreDefMoneyflowsView.Modal.assertOpen();
});

test("ListPreDefMoneyflows opens edit modal from row action", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.RowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.EditRowOneButton.click();
  await ListPreDefMoneyflowsView.Modal.assertOpen();
});

test("ListPreDefMoneyflows opens delete modal from row action", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.RowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.DeleteRowOneButton.click();
  await ListPreDefMoneyflowsView.Modal.assertOpen();
});

test("ListPreDefMoneyflows filters via mobile sheet", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.MobileAccordion.assertToBeVisible();
  await ListPreDefMoneyflowsView.MobileFilterTrigger.click();
  await ListPreDefMoneyflowsView.MobileFilterSheet.assertToBeVisible();
  await ListPreDefMoneyflowsView.MobileFilterInput.setValue("energy");

  await ListPreDefMoneyflowsView.MobileRowTwo.assertToBeVisible();
  await ListPreDefMoneyflowsView.MobileRowOne.assertNotToBeInDocument();
});

test("ListPreDefMoneyflows opens edit modal from mobile action", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.MobileRowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.MobileEditRowOneButton.click();
  await ListPreDefMoneyflowsView.Modal.assertOpen();
});

test("ListPreDefMoneyflows opens delete modal from mobile action", async () => {
  render(ListPreDefMoneyflows);

  await ListPreDefMoneyflowsView.MobileRowOne.assertToBeVisible();
  await ListPreDefMoneyflowsView.MobileDeleteRowOneButton.click();
  await ListPreDefMoneyflowsView.Modal.assertOpen();
});

test("ListPreDefMoneyflows shows empty state for empty list (Desktop and Mobile)", async () => {
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  render(ListPreDefMoneyflows);
  await ListPreDefMoneyflowsView.EmptyRowDesktop.assertToBeVisible();
  await ListPreDefMoneyflowsView.EmptyRowMobile.assertToBeVisible();
});
