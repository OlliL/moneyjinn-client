import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
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
import ListCapitalsources from "@/views/capitalsource/ListCapitalsources.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CrudEtfService");

class ListCapitalsourcesView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly ValidNowToggle = new SwitchView("div-filter-valid-now");
  static readonly MobileFilterTrigger = new ButtonView("div-filter-mobile-trigger");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileValidNowToggle = new SwitchView(
    "div-filter-mobile-valid-now",
  );
  static readonly MobileFilterSheet = new RowView("div-filter-mobile-sheet");
  static readonly MobileAccordion = new RowView("capitalsource-mobile-accordion");
  static readonly MobileRowCash = new RowView("capitalsource-mobile-row-1");
  static readonly MobileRowOldAccount = new RowView("capitalsource-mobile-row-2");
  static readonly MobileRowCashTrigger = new ButtonView(
    "capitalsource-mobile-trigger-1",
  );
  static readonly EditCashMobileButton = new ButtonView("capitalsource-mobile-edit-1");
  static readonly DeleteCashMobileButton = new ButtonView(
    "capitalsource-mobile-delete-1",
  );
  static readonly RowCash = new RowView("capitalsource-row-1");
  static readonly RowOldAccount = new RowView("capitalsource-row-2");
  static readonly EditCashButton = new ButtonView("capitalsource-edit-1");
  static readonly DeleteCashButton = new ButtonView("capitalsource-delete-1");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    {
      id: 2,
      userId: 1,
      comment: "Old account",
      type: CapitalsourceType.CURRENT_ASSET,
      state: CapitalsourceState.CASH,
      validFrom: new Date("1999-01-01"),
      validTil: new Date("2001-12-31"),
      groupUse: false,
      importAllowed: CapitalsourceImport.NOT_ALLOWED,
    },
    {
      id: 1,
      userId: 1,
      comment: "Cash",
      type: CapitalsourceType.CURRENT_ASSET,
      state: CapitalsourceState.CASH,
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
      groupUse: false,
      importAllowed: CapitalsourceImport.NOT_ALLOWED,
    },
  ]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
});

test("ListCapitalsources renders capitalsource rows", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.RowCash.assertToBeVisible();
  await ListCapitalsourcesView.RowOldAccount.assertNotToBeInDocument();
});

test("ListCapitalsources toggles valid-now filter", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.ValidNowToggle.click();

  await ListCapitalsourcesView.RowOldAccount.assertToBeVisible();
});

test("ListCapitalsources filters by search input", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.ValidNowToggle.click();
  await ListCapitalsourcesView.FilterInput.setValue("old");

  await ListCapitalsourcesView.RowOldAccount.assertToBeVisible();
  await ListCapitalsourcesView.RowCash.assertNotToBeInDocument();
});

test("ListCapitalsources opens edit modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.EditCashButton.click();
  await ListCapitalsourcesView.Modal.assertOpen();
});

test("ListCapitalsources opens delete modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.DeleteCashButton.click();
  await ListCapitalsourcesView.Modal.assertOpen();
});

test("ListCapitalsources filters via mobile sheet", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.MobileAccordion.assertToBeVisible();
  await ListCapitalsourcesView.MobileFilterTrigger.click();
  await ListCapitalsourcesView.MobileFilterSheet.assertToBeVisible();

  await ListCapitalsourcesView.MobileValidNowToggle.click();
  await ListCapitalsourcesView.MobileFilterInput.setValue("old");

  await ListCapitalsourcesView.MobileRowOldAccount.assertToBeVisible();
  await ListCapitalsourcesView.MobileRowCash.assertNotToBeInDocument();
});

test("ListCapitalsources opens edit modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.MobileRowCash.assertToBeVisible();
  await ListCapitalsourcesView.MobileRowCashTrigger.click();
  await ListCapitalsourcesView.EditCashMobileButton.click();
  await ListCapitalsourcesView.Modal.assertOpen();
});

test("ListCapitalsources opens delete modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListCapitalsources);

  await ListCapitalsourcesView.MobileRowCash.assertToBeVisible();
  await ListCapitalsourcesView.MobileRowCashTrigger.click();
  await ListCapitalsourcesView.DeleteCashMobileButton.click();
  await ListCapitalsourcesView.Modal.assertOpen();
});

