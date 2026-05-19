import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import {
  ButtonView,
  InputView,
  ModalView,
  RowView,
  SwitchView,
} from "@/tests/TestViews";
import ListEtfs from "@/views/etf/ListEtfs.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/CrudEtfService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");

class ListEtfsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly AllButton = new ButtonView("div-filter-all");
  static readonly ValidNowToggle = new SwitchView("div-filter-valid-now");
  static readonly RowEtf1 = new RowView("etf-row-1");
  static readonly RowGlobalEtf = new RowView("etf-row-2");
  static readonly EditEtf1Button = new ButtonView("etf-edit-1");
  static readonly DeleteEtf1Button = new ButtonView("etf-delete-1");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  CrudEtfServiceMocker.mockFetchAllEtf([
    {
      id: 2,
      name: "Global ETF",
      isFavorite: false,
      partialTaxExemption: 30,
    } as never,
    {
      id: 1,
      name: "ETF 1",
      isFavorite: true,
      partialTaxExemption: 30,
    } as never,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
});

test("ListEtfs loads and renders ETF rows on mount", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
});

test("ListEtfs hides valid-now toggle in filter", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.ValidNowToggle.assertNotToBeInDocument();
});

test("ListEtfs filters rows by search input", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.FilterInput.setValue("global");
  await ListEtfsView.RowGlobalEtf.assertToBeVisible();
  await ListEtfsView.RowEtf1.assertNotToBeInDocument();
});

test("ListEtfs clears search filter via all button", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.FilterInput.setValue("global");
  await ListEtfsView.RowEtf1.assertNotToBeInDocument();

  await ListEtfsView.AllButton.click();

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.RowGlobalEtf.assertToBeVisible();
});

test("ListEtfs opens create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.CreateButton.click();
  await ListEtfsView.Modal.assertOpen();
});

test("ListEtfs opens edit modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.EditEtf1Button.click();
  await ListEtfsView.Modal.assertOpen();
});

test("ListEtfs opens delete modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.RowEtf1.assertToBeVisible();
  await ListEtfsView.DeleteEtf1Button.click();
  await ListEtfsView.Modal.assertOpen();
});
