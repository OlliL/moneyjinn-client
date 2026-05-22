import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerAccountServiceMocker from "@/service/mocker/ContractpartnerAccountServiceMocker";
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
  MobilePopupMenu,
  SwitchView,
} from "@/tests/TestViews";
import ListContractpartners from "@/views/contractpartner/ListContractpartners.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CrudEtfService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerAccountService");

class ListContractpartnersView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly ValidNowToggle = new SwitchView("div-filter-valid-now");
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new MobilePopupMenu("div-filter-mobile-sheet");
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly MobileValidNowToggle = new SwitchView(
    "div-filter-mobile-valid-now",
  );
  static readonly MobileAccordion = new RowView(
    "contractpartner-mobile-accordion",
  );
  static readonly MobileRowOne = new RowView("contractpartner-mobile-row-1");
  static readonly MobileRowTwo = new RowView("contractpartner-mobile-row-2");
  static readonly MobileEditOneButton = new ButtonView(
    "contractpartner-mobile-edit-1",
  );
  static readonly MobileDeleteOneButton = new ButtonView(
    "contractpartner-mobile-delete-1",
  );
  static readonly MobileAccountsOneButton = new ButtonView(
    "contractpartner-mobile-accounts-1",
  );
  static readonly RowOne = new RowView("contractpartner-row-1");
  static readonly RowTwo = new RowView("contractpartner-row-2");
  static readonly EditOneButton = new ButtonView("contractpartner-edit-1");
  static readonly DeleteOneButton = new ButtonView("contractpartner-delete-1");
  static readonly AccountsOneButton = new ButtonView(
    "contractpartner-accounts-1",
  );
  static readonly Modal = new ModalView("app-modal");
  static readonly EmptyRowDesktop = new RowView(
    "contractpartner-empty-desktop",
  );
  static readonly EmptyRowMobile = new RowView("contractpartner-empty-mobile");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([
    {
      id: 2,
      userId: 1,
      name: "Old partner",
      validFrom: new Date("1999-01-01"),
      validTil: new Date("2001-12-31"),
    },
    {
      id: 1,
      userId: 1,
      name: "Contractpartner 1",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    },
  ]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerAccountServiceMocker.mockFetchAllContractpartnerAccount([]);
});

test("ListContractpartners renders contractpartner rows", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.RowOne.assertToBeVisible();
  await ListContractpartnersView.RowTwo.assertNotToBeInDocument();
});

test("ListContractpartners toggles valid-now filter", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.ValidNowToggle.click();

  await ListContractpartnersView.RowTwo.assertToBeVisible();
});

test("ListContractpartners filters by search input", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.ValidNowToggle.click();
  await ListContractpartnersView.FilterInput.setValue("old");
  await ListContractpartnersView.RowTwo.assertToBeVisible();
  await ListContractpartnersView.RowOne.assertNotToBeInDocument();
});

test("ListContractpartners opens edit modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.RowOne.assertToBeVisible();
  await ListContractpartnersView.EditOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners opens delete modal from row action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.RowOne.assertToBeVisible();
  await ListContractpartnersView.DeleteOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners opens contractpartner accounts modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.RowOne.assertToBeVisible();
  await ListContractpartnersView.AccountsOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners filters via mobile sheet", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.MobileAccordion.assertToBeVisible();
  await ListContractpartnersView.MobileFilterTrigger.click();
  await ListContractpartnersView.MobileFilterSheet.assertToBeVisible();

  await ListContractpartnersView.MobileValidNowToggle.click();
  await ListContractpartnersView.MobileFilterInput.setValue("old");

  await ListContractpartnersView.MobileRowTwo.assertToBeVisible();
  await ListContractpartnersView.MobileRowOne.assertNotToBeInDocument();
});

test("ListContractpartners opens edit modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.MobileRowOne.assertToBeVisible();
  await ListContractpartnersView.MobileEditOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners opens delete modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.MobileRowOne.assertToBeVisible();
  await ListContractpartnersView.MobileDeleteOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners opens accounts modal from mobile action", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);

  await ListContractpartnersView.MobileRowOne.assertToBeVisible();
  await ListContractpartnersView.MobileAccountsOneButton.click();
  await ListContractpartnersView.Modal.assertOpen();
});

test("ListContractpartners shows empty state for empty list (Desktop and Mobile)", async () => {
  // Arrange: Mock for empty contract partners
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerAccountServiceMocker.mockFetchAllContractpartnerAccount([]);
  await StoreService.getInstance().initAllStores();
  render(ListContractpartners);
  await ListContractpartnersView.EmptyRowDesktop.assertToBeVisible();
  await ListContractpartnersView.EmptyRowMobile.assertToBeVisible();
});
