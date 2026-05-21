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
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new RowView("div-filter-mobile-sheet");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileAccordion = new RowView("etf-mobile-accordion");
  static readonly MobileRowEtf1 = new RowView("etf-mobile-row-1");
  static readonly MobileRowGlobalEtf = new RowView("etf-mobile-row-2");
  static readonly MobileTriggerEtf1 = new ButtonView("etf-mobile-trigger-1");
  static readonly MobileContentEtf1 = new RowView("etf-mobile-content-1");
  static readonly MobileEditEtf1Button = new ButtonView("etf-mobile-edit-1");
  static readonly MobileDeleteEtf1Button = new ButtonView(
    "etf-mobile-delete-1",
  );
  static readonly MobileFavoriteEtf1 = new RowView("etf-mobile-favorite-1");
  static readonly MobileFavoriteGlobalEtf = new RowView(
    "etf-mobile-favorite-2",
  );
  static readonly RowEtf1 = new RowView("etf-row-1");
  static readonly RowGlobalEtf = new RowView("etf-row-2");
  static readonly EditEtf1Button = new ButtonView("etf-edit-1");
  static readonly DeleteEtf1Button = new ButtonView("etf-delete-1");
  static readonly Modal = new ModalView("app-modal");
  static readonly EmptyRowDesktop = new RowView("etf-empty-desktop");
  static readonly EmptyRowMobile = new RowView("etf-empty-mobile");
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

test("ListEtfs filters rows via mobile sheet", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.MobileAccordion.assertToBeVisible();
  await ListEtfsView.MobileFilterTrigger.click();
  await ListEtfsView.MobileFilterSheet.assertToBeVisible();
  await ListEtfsView.MobileFilterInput.setValue("global");

  await ListEtfsView.MobileRowGlobalEtf.assertToBeVisible();
  await ListEtfsView.MobileRowEtf1.assertNotToBeInDocument();
});

test("ListEtfs expands mobile accordion row", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.MobileRowEtf1.assertToBeVisible();
  await ListEtfsView.MobileTriggerEtf1.click();
  await ListEtfsView.MobileContentEtf1.assertToBeVisible();
});

test("ListEtfs opens edit modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.MobileRowEtf1.assertToBeVisible();
  await ListEtfsView.MobileEditEtf1Button.click();
  await ListEtfsView.Modal.assertOpen();
});

test("ListEtfs opens delete modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.MobileRowEtf1.assertToBeVisible();
  await ListEtfsView.MobileDeleteEtf1Button.click();
  await ListEtfsView.Modal.assertOpen();
});

test("ListEtfs shows favorite indicator only for favorite ETF on mobile", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListEtfs);

  await ListEtfsView.MobileRowEtf1.assertToBeVisible();
  await ListEtfsView.MobileFavoriteEtf1.assertToBeVisible();
  await ListEtfsView.MobileFavoriteGlobalEtf.assertNotToBeInDocument();
});

test("ListEtfs shows empty state for empty list (Desktop and Mobile)", async () => {
  // Desktop test
  await StoreService.getInstance().initAllStores();
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  render(ListEtfs);
  await ListEtfsView.EmptyRowDesktop.assertToBeVisible();

  // Mobile test: Set viewport to mobile size and re-render
  window.innerWidth = 375;
  window.dispatchEvent(new Event('resize'));
  render(ListEtfs);
  await ListEtfsView.EmptyRowMobile.assertToBeVisible();
});
