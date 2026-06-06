import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
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
  renderDeclarativeModal,
  ToastView,
} from "@/tests/TestViews";
import { useCreateGroupModalStore } from "@/views/group/elements/CreateGroupModal.store";
import CreateGroupModal from "@/views/group/elements/CreateGroupModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock("@/service/GroupService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateGroupModalView {
  static readonly Modal = new ModalView("app-modal-CreateGroup");
  static readonly NameInput = new InputView("name");
  static readonly SaveButton = new ButtonView("createGroupSaveButton");
  static readonly ResetButton = new ButtonView("createGroupResetButton");

  static readonly NameError = new AlertView("name-error-item");
  static readonly Toast = new ToastView();
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  GroupServiceMocker.mockFetchAllGroup([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  GroupServiceMocker.mockCreateGroupResolved({ id: 1, name: "New Group" });
  GroupServiceMocker.mockUpdateGroupResolved();

  await StoreService.getInstance().initAllStores();
});

test("creates a new group", async () => {
  useCreateGroupModalStore().openCreateGroup();
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.Modal.assertOpen();

  await CreateGroupModalView.NameInput.setValue("New Group");
  await CreateGroupModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(GroupService.createGroup);
  await CreateGroupModalView.Modal.assertClosed();
});

test("updates an existing group", async () => {
  const existingGroup = {
    id: 1,
    name: "Existing Group",
  } as Group;

  useCreateGroupModalStore().openEditGroup(existingGroup);
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.NameInput.setValue("Updated Group");
  await CreateGroupModalView.SaveButton.click();

  await assertHaveBeenCalledWith(GroupService.updateGroup, {
    ...existingGroup,
    name: "Updated Group",
  });
  await CreateGroupModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  useCreateGroupModalStore().openCreateGroup();
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.NameInput.setValue("To be cleared");
  await CreateGroupModalView.ResetButton.click();

  await CreateGroupModalView.NameInput.assertValue("");
});

test("reset button reverts changes in edit mode", async () => {
  const existingGroup = {
    id: 1,
    name: "Original Name",
  } as Group;
  useCreateGroupModalStore().openEditGroup(existingGroup);
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.NameInput.setValue("Changed Name");
  await CreateGroupModalView.ResetButton.click();

  await CreateGroupModalView.NameInput.assertValue("Original Name");
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  GroupServiceMocker.mockCreateGroupRejected(backendError);

  useCreateGroupModalStore().openCreateGroup();
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.NameInput.setValue("Valid Name");
  await CreateGroupModalView.SaveButton.click();

  await CreateGroupModalView.Toast.assertError("Backend Error Message");
  await CreateGroupModalView.Modal.assertOpen();
});

test("validation: name is required", async () => {
  useCreateGroupModalStore().openCreateGroup();
  renderDeclarativeModal(CreateGroupModal);

  await CreateGroupModalView.NameInput.setValue("trigger validation");
  await CreateGroupModalView.NameInput.setValue("");
  await CreateGroupModalView.SaveButton.click();

  await CreateGroupModalView.NameError.assertMessageContains(
    "Please specify a name!",
  );
  await CreateGroupModalView.Modal.assertOpen();
  await assertNotHaveBeenCalled(GroupService.createGroup);
});
