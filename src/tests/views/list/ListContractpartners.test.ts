import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import ContractpartnerAccountServiceMocker from "@/service/mocker/ContractpartnerAccountServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  ButtonView,
  InputView,
  ModalView,
  RowView,
  SwitchView,
} from "@/tests/TestViews";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
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
  static readonly RowOne = new RowView("contractpartner-row-1");
  static readonly RowTwo = new RowView("contractpartner-row-2");
  static readonly EditOneButton = new ButtonView("contractpartner-edit-1");
  static readonly DeleteOneButton = new ButtonView("contractpartner-delete-1");
  static readonly AccountsOneButton = new ButtonView(
    "contractpartner-accounts-1",
  );
  static readonly Modal = new ModalView("app-modal");
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


