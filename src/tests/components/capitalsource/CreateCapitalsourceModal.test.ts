import CreateCapitalsourceModal from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import CapitalsourceService from "@/service/CapitalsourceService";
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
  renderModalWithRef,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateCapitalsourceModalView {
  static readonly Modal = new ModalView("app-modal");
  static readonly CommentInput = new InputView("comment");
  static readonly TypeSelect = new ComboboxView("type");
  static readonly StateSelect = new ComboboxView("state");
  static readonly ValidFromInput = new InputView("validFrom");
  static readonly ValidTilInput = new InputView("validTil");
  static readonly GroupUseSelect = new ComboboxView("groupUse");
  static readonly ImportAllowedSelect = new ComboboxView("importAllowed");
  static readonly AccountNumberInput = new InputView("accountNumber");
  static readonly BankCodeInput = new InputView("bankCode");

  static readonly SaveButton = new ButtonView("createCapitalsourceSaveButton");
  static readonly ResetButton = new ButtonView(
    "createCapitalsourceResetButton",
  );

  static readonly CommentError = new AlertView("comment-error-item");
  static readonly TypeError = new AlertView("type-error");
  static readonly StateError = new AlertView("state-error");
  static readonly ValidFromError = new AlertView("validFrom-error");
  static readonly ValidTilError = new AlertView("validTil-error");
  static readonly GroupUseError = new AlertView("groupUse-error");
  static readonly ImportAllowedError = new AlertView("importAllowed-error");
  static readonly AccountNumberError = new AlertView(
    "accountNumber-error-item",
  );
  static readonly BankCodeError = new AlertView("bankCode-error-item");
  static readonly ServerErrorItem = new AlertView("serverError-item");
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  CapitalsourceServiceMocker.mockCreateCapitalsourceResolved();
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  await StoreService.getInstance().initAllStores();
});

test("creates a new capitalsource", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.Modal.assertOpen();

  await CreateCapitalsourceModalView.CommentInput.setValue("New Source");
  await CreateCapitalsourceModalView.TypeSelect.selectItem(
    "Current Asset",
    CapitalsourceType.CURRENT_ASSET,
  );
  await CreateCapitalsourceModalView.StateSelect.selectItem(
    "Cash",
    CapitalsourceState.CASH,
  );
  await CreateCapitalsourceModalView.GroupUseSelect.selectItem("No", "false");
  await CreateCapitalsourceModalView.ImportAllowedSelect.selectItem(
    "No",
    CapitalsourceImport.NOT_ALLOWED,
  );

  await CreateCapitalsourceModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(CapitalsourceService.createCapitalsource);
  await CreateCapitalsourceModalView.Modal.assertClosed();
});

test("updates an existing capitalsource", async () => {
  const existingMcs = {
    id: 1,
    comment: "Existing",
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.CASH,
    validFrom: new Date("2024-01-01"),
    validTil: new Date("2999-12-31"),
    groupUse: true,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  } as any;
  CapitalsourceServiceMocker.mockUpdateCapitalsourceResolved();

  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show(existingMcs);

  await CreateCapitalsourceModalView.CommentInput.setValue("Updated Comment");
  await CreateCapitalsourceModalView.SaveButton.click();

  await assertHaveBeenCalledWith(CapitalsourceService.updateCapitalsource, {
    ...existingMcs,
    comment: "Updated Comment",
  });
  await CreateCapitalsourceModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.CommentInput.setValue("To be cleared");
  await CreateCapitalsourceModalView.ResetButton.click();

  await CreateCapitalsourceModalView.CommentInput.assertValue("");
});

test("reset button reverts changes in edit mode", async () => {
  const existingMcs = {
    id: 1,
    comment: "Original",
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.CASH,
    validFrom: new Date("2024-01-01"),
    validTil: new Date("2999-12-31"),
    groupUse: true,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  } as any;
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show(existingMcs);

  await CreateCapitalsourceModalView.CommentInput.setValue("Changed");
  await CreateCapitalsourceModalView.ResetButton.click();

  await CreateCapitalsourceModalView.CommentInput.assertValue("Original");
});

test("can save without optional account data", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.CommentInput.setValue("Minimal Source");
  await CreateCapitalsourceModalView.TypeSelect.selectItem(
    "Current Asset",
    CapitalsourceType.CURRENT_ASSET,
  );
  await CreateCapitalsourceModalView.StateSelect.selectItem(
    "Cash",
    CapitalsourceState.CASH,
  );
  await CreateCapitalsourceModalView.GroupUseSelect.selectItem("No", "false");
  await CreateCapitalsourceModalView.ImportAllowedSelect.selectItem(
    "No",
    CapitalsourceImport.NOT_ALLOWED,
  );

  await CreateCapitalsourceModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CapitalsourceService.createCapitalsource,
    expect.objectContaining({
      comment: "Minimal Source",
    }),
  );
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error",
  );
  CapitalsourceServiceMocker.mockCreateCapitalsourceRejected(backendError);

  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.CommentInput.setValue("Valid");
  await CreateCapitalsourceModalView.TypeSelect.selectItem(
    "Current Asset",
    CapitalsourceType.CURRENT_ASSET,
  );
  await CreateCapitalsourceModalView.StateSelect.selectItem(
    "Cash",
    CapitalsourceState.CASH,
  );
  await CreateCapitalsourceModalView.GroupUseSelect.selectItem("No", "false");
  await CreateCapitalsourceModalView.ImportAllowedSelect.selectItem(
    "No",
    CapitalsourceImport.NOT_ALLOWED,
  );

  await CreateCapitalsourceModalView.SaveButton.click();

  await CreateCapitalsourceModalView.ServerErrorItem.assertMessageContains(
    "Backend Error",
  );
  await CreateCapitalsourceModalView.Modal.assertOpen();
});

test("validation: mandatory fields", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  // Trigger validation by clearing defaults or clicking save
  await CreateCapitalsourceModalView.SaveButton.click();

  await CreateCapitalsourceModalView.CommentError.assertMessageContains(
    "Please specify a name!",
  );
  await CreateCapitalsourceModalView.TypeError.assertMessageContains(
    "Please specify a type!",
  );
  await CreateCapitalsourceModalView.StateError.assertMessageContains(
    "Please specify a state!",
  );
  await CreateCapitalsourceModalView.GroupUseError.assertMessageContains(
    "Please select a group usage value!",
  );
  await CreateCapitalsourceModalView.ImportAllowedError.assertMessageContains(
    "Please select an import type!",
  );

  await assertNotHaveBeenCalled(CapitalsourceService.createCapitalsource);
});

test("validation: date fields", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.ValidFromInput.setValue("");
  await CreateCapitalsourceModalView.ValidTilInput.setValue("");
  await CreateCapitalsourceModalView.SaveButton.click();

  await CreateCapitalsourceModalView.ValidFromError.assertMessageContains(
    "Please specify a valid from date!",
  );
  await CreateCapitalsourceModalView.ValidTilError.assertMessageContains(
    "Please specify a valid until date!",
  );
});

test("validation: field lengths", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.CommentInput.setValue("a".repeat(256));
  await CreateCapitalsourceModalView.AccountNumberInput.setValue(
    "a".repeat(35),
  );
  await CreateCapitalsourceModalView.BankCodeInput.setValue("a".repeat(12));
  await CreateCapitalsourceModalView.SaveButton.click();

  await CreateCapitalsourceModalView.CommentError.assertMessageContains(
    "Name is too long!",
  );
  await CreateCapitalsourceModalView.AccountNumberError.assertMessageContains(
    "IBAN is too long!",
  );
  await CreateCapitalsourceModalView.BankCodeError.assertMessageContains(
    "BIC is too long!",
  );
});

test("validation: numeric ranges for selects", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  await CreateCapitalsourceModalView.TypeSelect.selectItem(
    "Current Asset",
    CapitalsourceType.CURRENT_ASSET,
  );
  await CreateCapitalsourceModalView.TypeSelect.clear();
  await CreateCapitalsourceModalView.SaveButton.click();
  await CreateCapitalsourceModalView.TypeError.assertMessageContains(
    "Please specify a type!",
  );
});

test("date inputs initialized with defaults", async () => {
  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show();

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formattedToday = `${dd}.${mm}.${yyyy}`;

  await CreateCapitalsourceModalView.ValidFromInput.assertValue(formattedToday);
  await CreateCapitalsourceModalView.ValidTilInput.assertValue("31.12.2999");
});

test("edit mode pre-fills data", async () => {
  const mcs = {
    id: 1,
    comment: "Test Source",
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.NON_CASH,
    validFrom: new Date("2024-01-01"),
    validTil: new Date("2024-12-31"),
    groupUse: false,
    importAllowed: CapitalsourceImport.ALL_ALLOWED,
  } as any;

  const modalRef = renderModalWithRef<any>(CreateCapitalsourceModal);
  await modalRef.value._show(mcs);

  await CreateCapitalsourceModalView.CommentInput.assertValue("Test Source");
  await CreateCapitalsourceModalView.ValidFromInput.assertValue("01.01.2024");
  await CreateCapitalsourceModalView.ValidTilInput.assertValue("31.12.2024");
});
