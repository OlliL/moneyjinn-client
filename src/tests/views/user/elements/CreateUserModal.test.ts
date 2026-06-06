import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Group } from "@/model/group/Group";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";
import { UserRole } from "@/model/user/UserRole";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import GroupServiceMocker from "@/service/mocker/GroupServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import UserServiceMocker from "@/service/mocker/UserServiceMocker";
import UserService from "@/service/UserService";
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
import { useCreateUserModalStore } from "@/views/user/elements/CreateUserModal.store";
import CreateUserModal from "@/views/user/elements/CreateUserModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock("@/service/UserService");
vi.mock("@/service/GroupService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateUserModalView {
  static readonly Modal = new ModalView("app-modal-CreateUser");
  static readonly NameInput = new InputView("name-CreateUser");
  static readonly Password1Input = new InputView("password1-CreateUser");
  static readonly Password2Input = new InputView("password2-CreateUser");
  static readonly RoleSelect = new ComboboxView("role-CreateUser");
  static readonly RoleInput = new InputView("role-CreateUser");
  static readonly GroupSelect = new ComboboxView("groupId-CreateUser");
  static readonly GroupInput = new InputView("groupId-CreateUser");
  static readonly ValidFromInput = new InputView("validFrom-CreateUser");
  static readonly UserIsNewSelect = new ComboboxView("userIsNew-CreateUser");
  static readonly UserIsNewInput = new InputView("userIsNew-CreateUser");

  static readonly SaveButton = new ButtonView("createUserSaveButton");
  static readonly ResetButton = new ButtonView("createUserResetButton");

  static readonly NameError = new AlertView("name-CreateUser-error-item");
  static readonly GroupError = new AlertView("groupId-CreateUser-error");
  static readonly RoleError = new AlertView("role-CreateUser-error-item");
  static readonly PasswordError = new AlertView(
    "password1-CreateUser-error-item",
  );
  static readonly ValidFromError = new AlertView(
    "validFrom-CreateUser-error-item",
  );
  static readonly UserIsNewError = new AlertView(
    "userIsNew-CreateUser-error-item",
  );
  static readonly Toast = new ToastView();
}

const defaultGroups: Group[] = [
  { id: 1, name: "Group 1" },
  { id: 2, name: "Group 2" },
];

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  GroupServiceMocker.mockFetchAllGroup(defaultGroups);
  UserServiceMocker.mockGetAllAccessRelationsResolved([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  await StoreService.getInstance().initAllStores();
});

test("creates a new user", async () => {
  const newUser = {
    id: 10,
    userName: "newuser",
    role: UserRole.STANDARD,
    groupId: 1,
    userIsNew: true,
  } as User;
  UserServiceMocker.mockCreateUserResolved(newUser);

  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.Modal.assertOpen();

  await CreateUserModalView.NameInput.setValue("newuser");
  await CreateUserModalView.Password1Input.setValue("abcABC123!");
  await CreateUserModalView.Password2Input.setValue("abcABC123!");
  await CreateUserModalView.RoleSelect.selectItem(
    "Standard User",
    UserRole.STANDARD,
  );
  await CreateUserModalView.GroupSelect.selectItem("Group 1", 1);

  await CreateUserModalView.SaveButton.click();

  await assertHaveBeenCalledOnce(UserService.createUser);
  await CreateUserModalView.Modal.assertClosed();
});

test("updates an existing user", async () => {
  const existingUser = {
    id: 10,
    userName: "existing",
    role: UserRole.STANDARD,
    groupId: 1,
    userIsNew: false,
  } as User;
  UserServiceMocker.mockUpdateUserResolved();

  useCreateUserModalStore().openEditUser(existingUser);
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.setValue("updated");
  await CreateUserModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    UserService.updateUser,
    expect.objectContaining({ id: 10, userName: "updated" }),
    expect.objectContaining({ id: 10, refId: 1 }),
  );
  await CreateUserModalView.Modal.assertClosed();
});

test("reset button clears form in create mode", async () => {
  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.setValue("to be cleared");
  await CreateUserModalView.ResetButton.click();

  await CreateUserModalView.NameInput.assertValue("");
});

test("reset button reverts changes in edit mode", async () => {
  const existingUser = {
    id: 10,
    userName: "original",
    role: UserRole.STANDARD,
    groupId: 1,
    userIsNew: false,
  } as User;
  useCreateUserModalStore().openEditUser(existingUser);
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.setValue("changed");
  await CreateUserModalView.ResetButton.click();

  await CreateUserModalView.NameInput.assertValue("original");
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  UserServiceMocker.mockCreateUserRejected(backendError);

  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.setValue("valid");
  await CreateUserModalView.Password1Input.setValue("abcABC123!");
  await CreateUserModalView.Password2Input.setValue("abcABC123!");
  await CreateUserModalView.RoleSelect.selectItem(
    "Standard User",
    UserRole.STANDARD,
  );
  await CreateUserModalView.GroupSelect.selectItem("Group 1", 1);

  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.Toast.assertError("Backend Error Message");
  await CreateUserModalView.Modal.assertOpen();
});

test("validation: mandatory fields in create mode", async () => {
  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.NameError.assertMessageContains(
    "Please specify a name!",
  );
  await CreateUserModalView.GroupError.assertMessageContains(
    "Please select a group!",
  );
  await CreateUserModalView.PasswordError.assertMessageContains(
    "Please specify a password!",
  );

  await assertNotHaveBeenCalled(UserService.createUser);
});

test("validation: password mismatch", async () => {
  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.Password1Input.setValue("password123");
  await CreateUserModalView.Password2Input.setValue("different");
  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.PasswordError.assertMessageContains(
    "Passwords do not match!",
  );
});

test("validation: field lengths", async () => {
  useCreateUserModalStore().openCreateUser();
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.setValue("a".repeat(21));
  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.NameError.assertMessageContains(
    "Name is too long!",
  );
});

test("edit mode pre-fills data and shows history", async () => {
  const existingUser = {
    id: 10,
    userName: "prefilled",
    role: UserRole.ADMIN,
    groupId: 2,
    userIsNew: false,
  } as User;
  const accessRelations: AccessRelation[] = [
    {
      id: 10,
      refId: 2,
      validFrom: new Date("2024-01-01"),
      validTil: new Date("2999-12-31"),
    },
  ];
  UserServiceMocker.mockGetAllAccessRelationsResolved(accessRelations);

  useCreateUserModalStore().openEditUser(existingUser);
  renderDeclarativeModal(CreateUserModal);

  await CreateUserModalView.NameInput.assertValue("prefilled");
  await CreateUserModalView.GroupInput.assertValue("Group 2");
  await CreateUserModalView.RoleInput.assertValue("Administrator");
  await CreateUserModalView.UserIsNewInput.assertValue("No");
});
