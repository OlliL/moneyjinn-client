import CreatePostingAccountModal from "@/components/postingaccount/CreatePostingAccountModal.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
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
  InputView,
  ModalView,
  renderModalWithRef,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreatePostingAccountModalView {
  static readonly Modal = new ModalView("app-modal");
  static readonly NameInput = new InputView("name");
  static readonly SaveButton = new ButtonView("createPostingAccountSaveButton");
  static readonly ResetButton = new ButtonView(
    "createPostingAccountResetButton",
  );

  static readonly NameError = new AlertView("name-error-item");
  static readonly ServerErrorItem = new AlertView("serverError-item");
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  PostingAccountServiceMocker.mockCreatePostingAccountResolved();
  PostingAccountServiceMocker.mockUpdatePostingAccountResolved();

  await StoreService.getInstance().initAllStores();
});

test("creates a new posting account", async () => {
  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show();

  await CreatePostingAccountModalView.Modal.assertOpen();

  await CreatePostingAccountModalView.NameInput.setValue("New Posting Account");
  await CreatePostingAccountModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(PostingAccountService.createPostingAccount);
  await CreatePostingAccountModalView.Modal.assertClosed();
});

test("updates an existing posting account", async () => {
  const existingMpa = {
    id: 1,
    name: "Existing Posting Account",
  } as PostingAccount;

  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show(existingMpa);

  await CreatePostingAccountModalView.NameInput.setValue(
    "Updated Posting Account",
  );
  await CreatePostingAccountModalView.SaveButton.click();

  await assertHaveBeenCalledWith(PostingAccountService.updatePostingAccount, {
    ...existingMpa,
    name: "Updated Posting Account",
  });
  await CreatePostingAccountModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show();

  await CreatePostingAccountModalView.NameInput.setValue("To be cleared");
  await CreatePostingAccountModalView.ResetButton.click();

  await CreatePostingAccountModalView.NameInput.assertValue("");
});

test("reset button reverts changes in edit mode", async () => {
  const existingMpa = {
    id: 1,
    name: "Original Name",
  } as PostingAccount;
  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show(existingMpa);

  await CreatePostingAccountModalView.NameInput.setValue("Changed Name");
  await CreatePostingAccountModalView.ResetButton.click();

  await CreatePostingAccountModalView.NameInput.assertValue("Original Name");
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  PostingAccountServiceMocker.mockCreatePostingAccountRejected(backendError);

  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show();

  await CreatePostingAccountModalView.NameInput.setValue("Valid Name");
  await CreatePostingAccountModalView.SaveButton.click();

  await CreatePostingAccountModalView.ServerErrorItem.assertMessageContains(
    "Backend Error Message",
  );
  await CreatePostingAccountModalView.Modal.assertOpen();
});

test("validation: name is required", async () => {
  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show();

  await CreatePostingAccountModalView.NameInput.setValue("trigger validation");
  await CreatePostingAccountModalView.NameInput.setValue("");
  await CreatePostingAccountModalView.SaveButton.click();

  await CreatePostingAccountModalView.NameError.assertMessageContains(
    "Please specify a name!",
  );
  await CreatePostingAccountModalView.Modal.assertOpen();
  await assertNotHaveBeenCalled(PostingAccountService.createPostingAccount);
});

test("validation: name maximum length", async () => {
  const modalRef = renderModalWithRef<any>(CreatePostingAccountModal);
  await modalRef.value._show();

  await CreatePostingAccountModalView.NameInput.setValue("a".repeat(101));
  await CreatePostingAccountModalView.SaveButton.click();

  await CreatePostingAccountModalView.NameError.assertMessageContains(
    "Name is too long!",
  );
  await CreatePostingAccountModalView.Modal.assertOpen();
  await assertNotHaveBeenCalled(PostingAccountService.createPostingAccount);
});
