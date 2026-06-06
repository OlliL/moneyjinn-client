import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import ContractpartnerMatchingService from "@/service/ContractpartnerMatchingService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerMatchingServiceMocker from "@/service/mocker/ContractpartnerMatchingServiceMocker";
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
import { useCreateContractpartnerMatchingModalStore } from "@/views/contractpartnermatching/elements/CreateContractpartnerMatchingModal.store";
import CreateContractpartnerMatchingModal from "@/views/contractpartnermatching/elements/CreateContractpartnerMatchingModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock("@/service/ContractpartnerMatchingService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateContractpartnerMatchingModalView {
  static readonly Modal = new ModalView(
    "app-modal-CreateContractpartnerMatching",
  );
  static readonly MatchingTextInput = new InputView("name");
  static readonly ContractpartnerSelect = new ComboboxView(
    "contractpartnerCreateContractpartnerMatching",
  );
  static readonly MoneyflowCommentInput = new InputView("moneyflowComment");
  static readonly PostingAccountSelect = new ComboboxView(
    "postingAccountCreateContractpartner",
  );

  static readonly SaveButton = new ButtonView(
    "createContractpartnerMatchingSaveButton",
  );
  static readonly ResetButton = new ButtonView(
    "createContractpartnerMatchingResetButton",
  );

  static readonly MatchingTextError = new AlertView("name-error-item");
  static readonly ContractpartnerError = new AlertView(
    "contractpartnerCreateContractpartnerMatching-error",
  );
  static readonly MoneyflowCommentError = new AlertView(
    "moneyflowComment-error-item",
  );
  static readonly Toast = new ToastView();
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  ContractpartnerServiceMocker.mockFetchAllContractpartner([
    { id: 1, name: "Partner 1" } as any,
  ]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([
    { id: 1, name: "Account 1" } as any,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  ContractpartnerMatchingServiceMocker.mockCreateContractpartnerMatchingResolved(
    { id: 1 } as any,
  );
  ContractpartnerMatchingServiceMocker.mockUpdateContractpartnerMatchingResolved();

  await StoreService.getInstance().initAllStores();
});

test("creates a new matching", async () => {
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openCreateContractpartnerMatching();

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "Match text",
  );
  await CreateContractpartnerMatchingModalView.ContractpartnerSelect.selectItem(
    "Partner 1",
    1,
  );
  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(
    ContractpartnerMatchingService.createContractpartnerMatching,
  );
  await CreateContractpartnerMatchingModalView.Modal.assertClosed();
});

test("updates an existing matching", async () => {
  const existing = {
    id: 1,
    matchingText: "Old text",
    contractpartnerId: 1,
  } as ContractpartnerMatching;

  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openEditContractpartnerMatching(
    existing,
  );

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "New text",
  );
  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    ContractpartnerMatchingService.updateContractpartnerMatching,
    expect.objectContaining({ id: 1, matchingText: "New text" }),
  );
  await CreateContractpartnerMatchingModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openCreateContractpartnerMatching();

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "Something",
  );
  await CreateContractpartnerMatchingModalView.ResetButton.click();

  await CreateContractpartnerMatchingModalView.MatchingTextInput.assertValue(
    "",
  );
});

test("reset button reverts changes in edit mode", async () => {
  const existing = {
    id: 1,
    matchingText: "Original",
    contractpartnerId: 1,
  } as ContractpartnerMatching;
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openEditContractpartnerMatching(
    existing,
  );

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "Changed",
  );
  await CreateContractpartnerMatchingModalView.ResetButton.click();

  await CreateContractpartnerMatchingModalView.MatchingTextInput.assertValue(
    "Original",
  );
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  ContractpartnerMatchingService.updateContractpartnerMatching = vi
    .fn()
    .mockRejectedValue(backendError);

  const existing = {
    id: 1,
    matchingText: "Old text",
    contractpartnerId: 1,
  } as ContractpartnerMatching;

  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openEditContractpartnerMatching(
    existing,
  );

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "valid",
  );
  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await CreateContractpartnerMatchingModalView.Toast.assertError(
    "Backend Error Message",
  );
  await CreateContractpartnerMatchingModalView.Modal.assertOpen();
});

test("validation: mandatory fields are required", async () => {
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openCreateContractpartnerMatching();

  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await CreateContractpartnerMatchingModalView.Modal.assertOpen();
  await CreateContractpartnerMatchingModalView.MatchingTextError.assertMessageContains(
    "Please specify a partial text!",
  );
  await CreateContractpartnerMatchingModalView.ContractpartnerError.assertMessageContains(
    "Please specify a business partner!",
  );
  await assertNotHaveBeenCalled(
    ContractpartnerMatchingService.createContractpartnerMatching,
  );
});

test("validation: matchingText maximum length", async () => {
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openCreateContractpartnerMatching();

  await CreateContractpartnerMatchingModalView.MatchingTextInput.setValue(
    "a".repeat(51),
  );
  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await CreateContractpartnerMatchingModalView.MatchingTextError.assertMessageContains(
    "The partial text must not exceed 50 characters!",
  );
});

test("validation: moneyflowComment maximum length", async () => {
  renderDeclarativeModal(CreateContractpartnerMatchingModal);
  useCreateContractpartnerMatchingModalStore().openCreateContractpartnerMatching();

  await CreateContractpartnerMatchingModalView.MoneyflowCommentInput.setValue(
    "a".repeat(101),
  );
  await CreateContractpartnerMatchingModalView.SaveButton.click();

  await CreateContractpartnerMatchingModalView.MoneyflowCommentError.assertMessageContains(
    "Comment is too long!",
  );
});
