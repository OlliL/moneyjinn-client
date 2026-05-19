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
  static readonly RowOne = new RowView("posting-account-row-1");
  static readonly RowTwo = new RowView("posting-account-row-2");
  static readonly EditOneButton = new ButtonView("posting-account-edit-1");
  static readonly DeleteOneButton = new ButtonView("posting-account-delete-1");
  static readonly Modal = new ModalView("app-modal");
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
