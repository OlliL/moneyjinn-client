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
  renderModalWithRef,
} from "@/tests/TestViews";
import CreateUserModal from "@/views/user/elements/CreateUserModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/UserService");
vi.mock("@/service/GroupService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class CreateUserModalView {
  static readonly Modal = new ModalView("app-modal");
  static readonly NameInput = new InputView("name");
  static readonly Password1Input = new InputView("password1");
  static readonly Password2Input = new InputView("password2");
  static readonly RoleSelect = new ComboboxView("role");
  static readonly RoleInput = new InputView("role");
  static readonly GroupSelect = new ComboboxView("groupId");
  static readonly GroupInput = new InputView("groupId");
  static readonly ValidFromInput = new InputView("validFrom");
  static readonly UserIsNewSelect = new ComboboxView("userIsNew");
  static readonly UserIsNewInput = new InputView("userIsNew");

  static readonly SaveButton = new ButtonView("createUserSaveButton");
  static readonly ResetButton = new ButtonView("createUserResetButton");

  static readonly NameError = new AlertView("name-error-item");
  static readonly GroupError = new AlertView("groupId-error");
  static readonly RoleError = new AlertView("role-error");
  static readonly PasswordError = new AlertView("password1-error-item");
  static readonly ValidFromError = new AlertView("validFrom-error");
  static readonly UserIsNewError = new AlertView("userIsNew-error");
  static readonly ServerErrorItem = new AlertView("serverError-item");
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

  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

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

  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show(existingUser);

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
  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

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
  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show(existingUser);

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

  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

  await CreateUserModalView.NameInput.setValue("valid");
  await CreateUserModalView.Password1Input.setValue("abcABC123!");
  await CreateUserModalView.Password2Input.setValue("abcABC123!");
  await CreateUserModalView.RoleSelect.selectItem(
    "Standard User",
    UserRole.STANDARD,
  );
  await CreateUserModalView.GroupSelect.selectItem("Group 1", 1);

  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.ServerErrorItem.assertMessageContains(
    "Backend Error Message",
  );
  await CreateUserModalView.Modal.assertOpen();
});

test("validation: mandatory fields in create mode", async () => {
  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

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
  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

  await CreateUserModalView.Password1Input.setValue("password123");
  await CreateUserModalView.Password2Input.setValue("different");
  await CreateUserModalView.SaveButton.click();

  await CreateUserModalView.PasswordError.assertMessageContains(
    "Passwords do not match!",
  );
});

test("validation: field lengths", async () => {
  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show();

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

  const modalRef = renderModalWithRef<any>(CreateUserModal);
  await modalRef.value._show(existingUser);

  await CreateUserModalView.NameInput.assertValue("prefilled");
  await CreateUserModalView.GroupInput.assertValue("Group 2");
  await CreateUserModalView.RoleInput.assertValue("Administrator");
  await CreateUserModalView.UserIsNewInput.assertValue("No");
});
