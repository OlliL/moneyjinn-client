import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import ContractpartnerMatchingServiceMocker from "@/service/mocker/ContractpartnerMatchingServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { assertHaveBeenCalledOnce, setupUserStandard } from "@/tests/TestUtil";
import {
  ButtonView,
  ComboboxView,
  InputView,
  MobilePopupMenu,
  ModalView,
  RowView,
} from "@/tests/TestViews";
import ListContractpartnerMatchings from "@/views/contractpartnermatching/ListContractpartnerMatchings.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/ContractpartnerMatchingService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");

class ListContractpartnerMatchingsView {
  static readonly FilterInput = new InputView("div-filter-input");
  static readonly MobileFilterTrigger = new ButtonView(
    "div-filter-mobile-trigger",
  );
  static readonly MobileFilterSheet = new MobilePopupMenu(
    "div-filter-mobile-sheet",
  );
  static readonly MobileFilterInput = new InputView("div-filter-mobile-input");
  static readonly ContractpartnerFilterCombobox = new ComboboxView(
    "contractpartnerContractpartnerMatching-searchContractpartner",
  );
  static readonly ContractpartnerFilterIdInput = new InputView(
    "contractpartnerContractpartnerMatching-searchContractpartner-id",
  );
  static readonly CreateButton = new ButtonView("div-filter-create");
  static readonly MobileAccordion = new RowView(
    "contractpartner-matching-mobile-accordion",
  );
  static readonly MobileRowRent = new RowView(
    "contractpartner-matching-mobile-row-1",
  );
  static readonly MobileRowSalary = new RowView(
    "contractpartner-matching-mobile-row-2",
  );
  static readonly MobileEditRentButton = new ButtonView(
    "contractpartner-matching-mobile-edit-1",
  );
  static readonly MobileDeleteRentButton = new ButtonView(
    "contractpartner-matching-mobile-delete-1",
  );
  static readonly RowRent = new RowView("contractpartner-matching-row-1");
  static readonly RowSalary = new RowView("contractpartner-matching-row-2");
  static readonly EditRentButton = new ButtonView(
    "contractpartner-matching-edit-1",
  );
  static readonly DeleteRentButton = new ButtonView(
    "contractpartner-matching-delete-1",
  );
  static readonly CreateModal = new ModalView(
    "app-modal-CreateContractpartnerMatching",
  );
  static readonly DeleteModal = new ModalView(
    "app-modal-DeleteContractpartnerMatching",
  );
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupUserStandard();
  ContractpartnerMatchingServiceMocker.mockFetchAllContractpartnerMatching([
    {
      id: 1,
      userId: 1,
      matchingText: "Rent transfer",
      contractpartnerId: 1,
      contractpartnerName: "Landlord",
      postingAccountId: 1,
      postingAccountName: "Housing",
      moneyflowComment: "Monthly rent",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    } as never,
    {
      id: 2,
      userId: 1,
      matchingText: "Salary payment",
      contractpartnerId: 2,
      contractpartnerName: "Employer",
      postingAccountId: 1,
      postingAccountName: "Income",
      moneyflowComment: "Salary",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    } as never,
  ]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([
    {
      id: 1,
      userId: 1,
      name: "Landlord",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    } as never,
    {
      id: 2,
      userId: 1,
      name: "Employer",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    } as never,
  ]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);

  await useContractpartnerStore().initContractpartnerStore();
});

test("ListContractpartnerMatchings calls fetchAllContractpartnerMatching on mount", async () => {
  render(ListContractpartnerMatchings);

  await assertHaveBeenCalledOnce(
    ContractpartnerMatchingService.fetchAllContractpartnerMatching,
  );
});

test("ListContractpartnerMatchings filters by search input", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.RowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.FilterInput.setValue("salary");
  await ListContractpartnerMatchingsView.RowSalary.assertToBeVisible();
  await ListContractpartnerMatchingsView.RowRent.assertNotToBeInDocument();
});

test("ListContractpartnerMatchings updates contractpartner filter selection", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.ContractpartnerFilterCombobox.selectItem(
    "Landlord",
    "1",
  );

  await ListContractpartnerMatchingsView.ContractpartnerFilterIdInput.assertValue(
    "1",
  );
});

test("ListContractpartnerMatchings opens create modal", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.RowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.CreateButton.click();
  await ListContractpartnerMatchingsView.CreateModal.assertOpen();
});

test("ListContractpartnerMatchings opens edit modal from row action", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.RowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.EditRentButton.click();
  await ListContractpartnerMatchingsView.CreateModal.assertOpen();
});

test("ListContractpartnerMatchings opens delete modal from row action", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.RowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.DeleteRentButton.click();
  await ListContractpartnerMatchingsView.DeleteModal.assertOpen();
});

test("ListContractpartnerMatchings filters via mobile sheet", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.MobileAccordion.assertToBeVisible();
  await ListContractpartnerMatchingsView.MobileFilterTrigger.click();
  await ListContractpartnerMatchingsView.MobileFilterSheet.assertToBeVisible();
  await ListContractpartnerMatchingsView.MobileFilterInput.setValue("salary");

  await ListContractpartnerMatchingsView.MobileRowSalary.assertToBeVisible();
  await ListContractpartnerMatchingsView.MobileRowRent.assertNotToBeInDocument();
});

test("ListContractpartnerMatchings opens edit modal from mobile action", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.MobileRowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.MobileEditRentButton.click();
  await ListContractpartnerMatchingsView.CreateModal.assertOpen();
});

test("ListContractpartnerMatchings opens delete modal from mobile action", async () => {
  render(ListContractpartnerMatchings);

  await ListContractpartnerMatchingsView.MobileRowRent.assertToBeVisible();
  await ListContractpartnerMatchingsView.MobileDeleteRentButton.click();
  await ListContractpartnerMatchingsView.DeleteModal.assertOpen();
});
