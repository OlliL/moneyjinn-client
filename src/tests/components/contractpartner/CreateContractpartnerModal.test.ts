import { useCreateContractpartnerModalStore } from "@/components/contractpartner/CreateContractpartnerModal.store";
import CreateContractpartnerModal from "@/components/contractpartner/CreateContractpartnerModal.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import {
  assertHaveBeenCalledOnce,
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  ComboboxView,
  InputView,
  ModalView,
  renderDeclarativeModal,
  ToastView,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateContractpartnerModalView {
  static readonly Modal = new ModalView("app-modal-CreateContractpartner");
  static readonly NameInput = new InputView("name-CreateContractpartner");
  static readonly MoneyflowCommentInput = new InputView(
    "moneyflowComment-CreateContractpartner",
  );
  static readonly PostingAccountCombobox = new ComboboxView(
    "postingAccount-CreateContractpartner",
  );
  static readonly PostingAccountIdInput = new InputView(
    "postingAccount-CreateContractpartner-id",
  );
  static readonly ValidFromInput = new InputView(
    "validFrom-CreateContractpartner",
  );
  static readonly ValidTilInput = new InputView(
    "validTil-CreateContractpartner",
  );
  static readonly AddressDataCollapsibleTrigger = new ButtonView(
    "addressDataCollapsibleTrigger-CreateContractpartner",
  );
  static readonly StreetInput = new InputView("street-CreateContractpartner");
  static readonly PostcodeInput = new InputView(
    "postcode-CreateContractpartner",
  );
  static readonly TownInput = new InputView("town-CreateContractpartner");
  static readonly CountryInput = new InputView("country-CreateContractpartner");

  static readonly SaveButton = new ButtonView(
    "createContractpartnerSaveButton",
  );
  static readonly ResetButton = new ButtonView(
    "createContractpartnerResetButton",
  );

  static readonly NameError = new AlertView(
    "name-CreateContractpartner-error-item",
  );
  static readonly MoneyflowCommentError = new AlertView(
    "moneyflowComment-CreateContractpartner-error-item",
  );
  static readonly PostingAccountError = new AlertView(
    "postingAccountCreateContractpartner-CreateContractpartner-error",
  );
  static readonly ValidFromError = new AlertView(
    "validFrom-CreateContractpartner-error",
  );
  static readonly ValidTilError = new AlertView(
    "validTil-CreateContractpartner-error",
  );
  static readonly StreetError = new AlertView(
    "street-CreateContractpartner-error-item",
  );
  static readonly PostcodeError = new AlertView(
    "postcode-CreateContractpartner-error-item",
  );
  static readonly TownError = new AlertView(
    "town-CreateContractpartner-error-item",
  );
  static readonly CountryError = new AlertView(
    "country-CreateContractpartner-error-item",
  );
  static readonly Toast = new ToastView();
}

const defaultPostingAccounts = [
  { id: 1, name: "Posting Account 1" },
  { id: 2, name: "Posting Account 2" },
];

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  ContractpartnerServiceMocker.mockCreateContractpartnerResolved();
  ContractpartnerServiceMocker.mockUpdateContractpartnerResolved();
  PostingAccountServiceMocker.mockFetchAllPostingAccount(
    defaultPostingAccounts,
  );
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  await StoreService.getInstance().initAllStores();
});

test("creates a new contractpartner", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("New Partner");
  await CreateContractpartnerModalView.ValidFromInput.setValue("01.01.2024");
  await CreateContractpartnerModalView.ValidTilInput.setValue("31.12.2999");

  await CreateContractpartnerModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(ContractpartnerService.createContractpartner);
  await CreateContractpartnerModalView.Modal.assertClosed();
});

test("updates an existing contractpartner", async () => {
  const existingMcp = {
    id: 1,
    name: "Existing Partner",
    validFrom: new Date("2024-01-01"),
    validTil: new Date("2999-12-31"),
  } as Contractpartner;

  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openEditContractpartner(existingMcp);
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("Updated Partner");
  await CreateContractpartnerModalView.SaveButton.click();

  await assertHaveBeenCalledWith(ContractpartnerService.updateContractpartner, {
    ...existingMcp,
    name: "Updated Partner",
  });
  await CreateContractpartnerModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("To be cleared");
  await CreateContractpartnerModalView.ResetButton.click();

  await CreateContractpartnerModalView.NameInput.assertValue("");
});

test("reset button reverts changes in edit mode", async () => {
  const existingMcp = {
    id: 1,
    name: "Original Partner",
    validFrom: new Date("2024-01-01"),
    validTil: new Date("2999-12-31"),
  } as Contractpartner;
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openEditContractpartner(existingMcp);
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("Changed Partner");
  await CreateContractpartnerModalView.ResetButton.click();

  await CreateContractpartnerModalView.NameInput.assertValue(
    "Original Partner",
  );
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error",
  );
  ContractpartnerServiceMocker.mockCreateContractpartnerRejected(backendError);

  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("Valid Name");
  await CreateContractpartnerModalView.ValidFromInput.setValue("01.01.2024");
  await CreateContractpartnerModalView.ValidTilInput.setValue("31.12.2999");
  await CreateContractpartnerModalView.SaveButton.click();

  await CreateContractpartnerModalView.Toast.assertError("Backend Error");
  await CreateContractpartnerModalView.Modal.assertOpen();
});

test("validation: name is required", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("");
  await CreateContractpartnerModalView.SaveButton.click();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameError.assertMessageContains(
    "Please specify a name!",
  );
  await assertNotHaveBeenCalled(ContractpartnerService.createContractpartner);
});

test("validation: name maximum length", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue("a".repeat(101));
  await CreateContractpartnerModalView.SaveButton.click();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameError.assertMessageContains(
    "Name is too long!",
  );
  await assertNotHaveBeenCalled(ContractpartnerService.createContractpartner);
});

test("validation: moneyflowComment maximum length", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.MoneyflowCommentInput.setValue(
    "a".repeat(101),
  );
  await CreateContractpartnerModalView.SaveButton.click();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.MoneyflowCommentError.assertMessageContains(
    "Comment is too long!",
  );
  await assertNotHaveBeenCalled(ContractpartnerService.createContractpartner);
});

test("validation: validFrom and validTil are required", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.ValidFromInput.setValue("");
  await CreateContractpartnerModalView.ValidTilInput.setValue("");

  await CreateContractpartnerModalView.SaveButton.click();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.ValidFromError.assertMessageContains(
    "Please specify a valid from date!",
  );
  await CreateContractpartnerModalView.ValidTilError.assertMessageContains(
    "Please specify a valid until date!",
  );
  await assertNotHaveBeenCalled(ContractpartnerService.createContractpartner);
});

test("address data fields are optional", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.setValue(
    "Partner with Address",
  );
  await CreateContractpartnerModalView.ValidFromInput.setValue("01.01.2024");
  await CreateContractpartnerModalView.ValidTilInput.setValue("31.12.2999");

  // Open collapsible to ensure fields are rendered
  await CreateContractpartnerModalView.AddressDataCollapsibleTrigger.click();

  await CreateContractpartnerModalView.StreetInput.setValue("Main Street"); // Set some value
  await CreateContractpartnerModalView.StreetInput.setValue(""); // Then clear it
  await CreateContractpartnerModalView.StreetInput.pressEnter();

  await CreateContractpartnerModalView.PostcodeInput.setValue("12345");
  await CreateContractpartnerModalView.PostcodeInput.setValue("");
  await CreateContractpartnerModalView.PostcodeInput.pressEnter();

  await CreateContractpartnerModalView.TownInput.setValue("Some Town");
  await CreateContractpartnerModalView.TownInput.setValue("");
  await CreateContractpartnerModalView.TownInput.pressEnter();

  await CreateContractpartnerModalView.CountryInput.setValue("Some Country");
  await CreateContractpartnerModalView.CountryInput.setValue("");
  await CreateContractpartnerModalView.CountryInput.pressEnter();

  await CreateContractpartnerModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    ContractpartnerService.createContractpartner,
    expect.objectContaining({
      name: "Partner with Address",
      street: "",
      postcode: "",
      town: "",
      country: "",
    }),
  );
  await CreateContractpartnerModalView.Modal.assertClosed();
});

test("date inputs initialized with defaults", async () => {
  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openCreateContractpartner();
  await CreateContractpartnerModalView.Modal.assertOpen();

  const today = new Date();
  const beginningOfPreviousMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  );

  const dd = String(beginningOfPreviousMonth.getDate()).padStart(2, "0");
  const mm = String(beginningOfPreviousMonth.getMonth() + 1).padStart(2, "0");
  const yyyy = beginningOfPreviousMonth.getFullYear();
  const formattedBeginningOfPreviousMonth = `${dd}.${mm}.${yyyy}`;

  await CreateContractpartnerModalView.ValidFromInput.assertValue(
    formattedBeginningOfPreviousMonth,
  );
  await CreateContractpartnerModalView.ValidTilInput.assertValue("31.12.2999");
});

test("edit mode pre-fills data", async () => {
  const mcp = {
    id: 1,
    name: "Test Partner",
    moneyflowComment: "Test Comment",
    postingAccountId: 1,
    validFrom: new Date("2023-01-01"),
    validTil: new Date("2025-12-31"),
    street: "Test Street",
    postcode: 12345,
    town: "Test Town",
    country: "Test Country",
  } as Contractpartner;

  renderDeclarativeModal(CreateContractpartnerModal);
  const modalStore = useCreateContractpartnerModalStore();
  modalStore.openEditContractpartner(mcp);
  await CreateContractpartnerModalView.Modal.assertOpen();

  await CreateContractpartnerModalView.NameInput.assertValue("Test Partner");
  await CreateContractpartnerModalView.MoneyflowCommentInput.assertValue(
    "Test Comment",
  );
  await CreateContractpartnerModalView.PostingAccountIdInput.assertValue("1");
  await CreateContractpartnerModalView.ValidFromInput.assertValue("01.01.2023");
  await CreateContractpartnerModalView.ValidTilInput.assertValue("31.12.2025");

  // Open collapsible to check address data
  await CreateContractpartnerModalView.AddressDataCollapsibleTrigger.click();
  await CreateContractpartnerModalView.StreetInput.assertValue("Test Street");
  await CreateContractpartnerModalView.PostcodeInput.assertValue("12345");
  await CreateContractpartnerModalView.TownInput.assertValue("Test Town");
  await CreateContractpartnerModalView.CountryInput.assertValue("Test Country");
});
