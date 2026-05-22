import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { ButtonView, InputView, ModalView, RowView } from "@/tests/TestViews";
import ListPostingAccounts from "@/views/postingaccount/ListPostingAccounts.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CrudEtfService");

class ListPostingAccountsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new RowView("div-filter-mobile-sheet");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileAccordion = new RowView(
    "posting-account-mobile-accordion",
  );
  static readonly MobileRowOne = new RowView("posting-account-mobile-row-1");
  static readonly MobileRowTwo = new RowView("posting-account-mobile-row-2");
  static readonly MobileEditOneButton = new ButtonView(
    "posting-account-mobile-edit-1",
  );
  static readonly MobileDeleteOneButton = new ButtonView(
    "posting-account-mobile-delete-1",
  );
  static readonly RowOne = new RowView("posting-account-row-1");
  static readonly RowTwo = new RowView("posting-account-row-2");
  static readonly EditOneButton = new ButtonView("posting-account-edit-1");
  static readonly DeleteOneButton = new ButtonView("posting-account-delete-1");
  static readonly Modal = new ModalView("app-modal");
  static readonly EmptyRowDesktop = new RowView(
    "posting-account-empty-desktop",
  );
  static readonly EmptyRowMobile = new RowView("posting-account-empty-mobile");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([
    { id: 2, name: "Savings" },
    { id: 1, name: "Posting Account 1" },
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
});

test("ListPostingAccounts renders posting account rows", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.RowOne.assertToBeVisible();
});

test("ListPostingAccounts filters rows by search input", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.RowOne.assertToBeVisible();
  await ListPostingAccountsView.FilterInput.setValue("savings");
  await ListPostingAccountsView.RowTwo.assertToBeVisible();
  await ListPostingAccountsView.RowOne.assertNotToBeInDocument();
});

test("ListPostingAccounts opens create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.RowOne.assertToBeVisible();
  await ListPostingAccountsView.CreateButton.click();
  await ListPostingAccountsView.Modal.assertOpen();
});

test("ListPostingAccounts opens edit modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.RowOne.assertToBeVisible();
  await ListPostingAccountsView.EditOneButton.click();
  await ListPostingAccountsView.Modal.assertOpen();
});

test("ListPostingAccounts opens delete modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.RowOne.assertToBeVisible();
  await ListPostingAccountsView.DeleteOneButton.click();
  await ListPostingAccountsView.Modal.assertOpen();
});

test("ListPostingAccounts filters via mobile sheet", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.MobileAccordion.assertToBeVisible();
  await ListPostingAccountsView.MobileFilterTrigger.click();
  await ListPostingAccountsView.MobileFilterSheet.assertToBeVisible();
  await ListPostingAccountsView.MobileFilterInput.setValue("savings");

  await ListPostingAccountsView.MobileRowTwo.assertToBeVisible();
  await ListPostingAccountsView.MobileRowOne.assertNotToBeInDocument();
});

test("ListPostingAccounts opens edit modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.MobileRowOne.assertToBeVisible();
  await ListPostingAccountsView.MobileEditOneButton.click();
  await ListPostingAccountsView.Modal.assertOpen();
});

test("ListPostingAccounts opens delete modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);

  await ListPostingAccountsView.MobileRowOne.assertToBeVisible();
  await ListPostingAccountsView.MobileDeleteOneButton.click();
  await ListPostingAccountsView.Modal.assertOpen();
});

test("ListPostingAccounts shows empty state for empty list (Desktop and Mobile)", async () => {
  // Arrange: Mock for empty PostingAccounts
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  await StoreService.getInstance().initAllStores();
  render(ListPostingAccounts);
  await ListPostingAccountsView.EmptyRowDesktop.assertToBeVisible();
  await ListPostingAccountsView.EmptyRowMobile.assertToBeVisible();
});
