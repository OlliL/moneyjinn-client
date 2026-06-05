import { useCreatePreDefMoneyflowModalStore } from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.store";
import CreatePreDefMoneyflowModal from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
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
  CollectionView,
  ComboboxView,
  InputView,
  ModalView,
  renderDeclarativeModal,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/CrudEtfService");

class CreatePreDefMoneyflowModalView {
  static readonly Modal = new ModalView("app-modal-CreatePreDefMoneyflow");
  static readonly AmountInput = new InputView("amount");
  static readonly CommentInput = new InputView("comment");
  static readonly FavoriteAbbreviationInput = new InputView(
    "favoriteAbbreviation",
  );
  static readonly ContractpartnerCombobox = new ComboboxView(
    "contractpartnerCreatePreDefMoneyflow",
  );
  static readonly CapitalsourceCombobox = new ComboboxView(
    "capitalsourceCreatePreDefMoneyflow",
  );
  static readonly PostingAccountCombobox = new ComboboxView(
    "postingAccountCreatePreDefMoneyflow",
  );
  static readonly FavoriteButton = new ButtonView(
    "createPreDefMoneyflowFavoriteButton",
  );
  static readonly FavoriteColorTrigger = new ButtonView("favoriteColorPicker");
  static readonly FavoriteColorOptions = new CollectionView(
    "favoriteColorOption",
  );
  static readonly ResetColorsButton = new ButtonView(
    "createPreDefMoneyflowResetColorsButton",
  );
  static readonly ResetButton = new ButtonView(
    "createPreDefMoneyflowResetButton",
  );
  static readonly SaveButton = new ButtonView(
    "createPreDefMoneyflowSaveButton",
  );
  static readonly AmountError = new AlertView("amount-error-item");
  static readonly CommentError = new AlertView("comment-error-item");
  static readonly FavoriteAbbreviationError = new AlertView(
    "favoriteAbbreviation-error-item",
  );
  static readonly ContractpartnerError = new AlertView(
    "contractpartnerCreatePreDefMoneyflow-error",
  );
  static readonly CapitalsourceError = new AlertView(
    "capitalsourceCreatePreDefMoneyflow-error",
  );
  static readonly PostingAccountError = new AlertView(
    "postingAccountCreatePreDefMoneyflow-error",
  );
  static readonly ServerErrorItem = new AlertView("serverError-item");
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  CrudEtfServiceMocker.mockFetchAllEtf([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([
    {
      id: 1,
      userId: 1,
      name: "Partner 1",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
    } as any,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    {
      id: 1,
      userId: 1,
      type: CapitalsourceType.CURRENT_ASSET,
      state: CapitalsourceState.CASH,
      comment: "Cash",
      validFrom: new Date("2000-01-01"),
      validTil: new Date("2999-12-31"),
      groupUse: false,
      importAllowed: CapitalsourceImport.NOT_ALLOWED,
    } as any,
  ]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([
    { id: 1, name: "Account 1" } as any,
  ]);
  PreDefMoneyflowServiceMocker.mockCreatePreDefMoneyflowResolved();

  await StoreService.getInstance().initAllStores();
});

test("CreatePreDefMoneyflowModal creates a new predefined moneyflow", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.Modal.assertOpen();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("100.50");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test Comment");

  await CreatePreDefMoneyflowModalView.ContractpartnerCombobox.selectItem(
    "Partner 1",
    1,
  );
  await CreatePreDefMoneyflowModalView.CapitalsourceCombobox.selectItem(
    "Cash",
    1,
  );
  await CreatePreDefMoneyflowModalView.PostingAccountCombobox.selectItem(
    "Account 1",
    1,
  );

  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertClosed();
});

test("CreatePreDefMoneyflowModal updates an existing predefined moneyflow", async () => {
  const existingMpm = {
    id: 42,
    amount: 10,
    comment: "Existing",
    contractpartnerId: 1,
    capitalsourceId: 1,
    postingAccountId: 1,
    isFavorite: false,
  } as any;
  PreDefMoneyflowServiceMocker.mockUpdatePreDefMoneyflowResolved();

  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow(existingMpm);

  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Updated Comment");
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertHaveBeenCalledWith(PreDefMoneyflowService.updatePreDefMoneyflow, {
    ...existingMpm,
    comment: "Updated Comment",
  });
  await CreatePreDefMoneyflowModalView.Modal.assertClosed();
});

test("CreatePreDefMoneyflowModal shows server errors on failed save", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Server Error Message",
  );
  PreDefMoneyflowServiceMocker.mockCreatePreDefMoneyflowRejected(backendError);

  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test");
  await CreatePreDefMoneyflowModalView.ContractpartnerCombobox.selectItem(
    "Partner 1",
    1,
  );
  await CreatePreDefMoneyflowModalView.CapitalsourceCombobox.selectItem(
    "Cash",
    1,
  );
  await CreatePreDefMoneyflowModalView.PostingAccountCombobox.selectItem(
    "Account 1",
    1,
  );

  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await CreatePreDefMoneyflowModalView.ServerErrorItem.assertMessageContains(
    "Server Error Message",
  );
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
});

test("CreatePreDefMoneyflowModal reset button clears the form", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("123.45");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue(
    "Temporary Comment",
  );

  await CreatePreDefMoneyflowModalView.ResetButton.click();

  await CreatePreDefMoneyflowModalView.AmountInput.assertValue("");
  await CreatePreDefMoneyflowModalView.CommentInput.assertValue("");
});

test("CreatePreDefMoneyflowModal handles favorite abbreviation visibility", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertNotToBeInDocument();

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertToBeVisible();
  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.setValue(
    "ABC",
  );

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertNotToBeInDocument();
});

test("CreatePreDefMoneyflowModal handles favorite color selection", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();
  await CreatePreDefMoneyflowModalView.FavoriteColorTrigger.click();

  await CreatePreDefMoneyflowModalView.FavoriteColorOptions.assertCount(10);

  await CreatePreDefMoneyflowModalView.ResetColorsButton.click();
  await CreatePreDefMoneyflowModalView.FavoriteColorOptions.assertCount(10);

  await CreatePreDefMoneyflowModalView.FavoriteColorOptions.clickOption(0);

  await CreatePreDefMoneyflowModalView.FavoriteColorOptions.assertCount(0);
});

test("CreatePreDefMoneyflowModal validation: amount is required", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.AmountError.assertMessageContains(
    "Please specify an amount!",
  );
});

test("CreatePreDefMoneyflowModal validation: comment is required", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.CommentError.assertMessageContains(
    "Please specify a comment!",
  );
});

test("CreatePreDefMoneyflowModal validation: comment maximum length", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("a".repeat(101));
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.CommentError.assertMessageContains(
    "Comment is too long!",
  );
});

test("CreatePreDefMoneyflowModal validation: contractpartner is required", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test");
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.ContractpartnerError.assertMessageContains(
    "Please specify a business partner!",
  );
});

test("CreatePreDefMoneyflowModal validation: capitalsource is required", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test");
  await CreatePreDefMoneyflowModalView.ContractpartnerCombobox.selectItem(
    "Partner 1",
    1,
  );
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.CapitalsourceError.assertMessageContains(
    "Please specify an account!",
  );
});

test("CreatePreDefMoneyflowModal validation: posting account is required", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test");
  await CreatePreDefMoneyflowModalView.ContractpartnerCombobox.selectItem(
    "Partner 1",
    1,
  );
  await CreatePreDefMoneyflowModalView.CapitalsourceCombobox.selectItem(
    "Cash",
    1,
  );
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.PostingAccountError.assertMessageContains(
    "Please specify a posting account!",
  );
});

test("CreatePreDefMoneyflowModal validation: favorite abbreviation is required when favorite active", async () => {
  renderDeclarativeModal(CreatePreDefMoneyflowModal);
  useCreatePreDefMoneyflowModalStore().openCreatePreDefMoneyflow();

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("10");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Test");
  await CreatePreDefMoneyflowModalView.ContractpartnerCombobox.selectItem(
    "Partner 1",
    1,
  );
  await CreatePreDefMoneyflowModalView.CapitalsourceCombobox.selectItem(
    "Cash",
    1,
  );
  await CreatePreDefMoneyflowModalView.PostingAccountCombobox.selectItem(
    "Account 1",
    1,
  );

  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertNotHaveBeenCalled(PreDefMoneyflowService.createPreDefMoneyflow);
  await CreatePreDefMoneyflowModalView.Modal.assertOpen();
  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertToBeVisible();
  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationError.assertMessageContains(
    "enter!",
  );
});
