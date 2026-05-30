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
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  ComboboxView,
  InputView,
  ModalStub,
  ModalView,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/CrudEtfService");

class CreatePreDefMoneyflowModalView {
  static readonly Modal = new ModalView("app-modal");
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
  static readonly ResetButton = new ButtonView(
    "createPreDefMoneyflowResetButton",
  );
  static readonly SaveButton = new ButtonView(
    "createPreDefMoneyflowSaveButton",
  );
  static readonly ServerErrorItem = new AlertView("serverError-item");
}

beforeEach(() => {
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
});

test("CreatePreDefMoneyflowModal creates a new predefined moneyflow", async () => {
  await StoreService.getInstance().initAllStores();

  const modalRef = ref();

  render(
    defineComponent({
      setup() {
        return () => h(CreatePreDefMoneyflowModal, { ref: modalRef });
      },
    }),
    {
      global: {
        stubs: { ModalVue: ModalStub },
      },
    },
  );

  await modalRef.value._show();

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
  await StoreService.getInstance().initAllStores();
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

  const modalRef = ref();
  render(
    defineComponent({
      setup() {
        return () => h(CreatePreDefMoneyflowModal, { ref: modalRef });
      },
    }),
    { global: { stubs: { ModalVue: ModalStub } } },
  );

  await modalRef.value._show(existingMpm);

  await CreatePreDefMoneyflowModalView.CommentInput.setValue("Updated Comment");
  await CreatePreDefMoneyflowModalView.SaveButton.click();

  await assertHaveBeenCalledWith(PreDefMoneyflowService.updatePreDefMoneyflow, {
    ...existingMpm,
    comment: "Updated Comment",
  });
  await CreatePreDefMoneyflowModalView.Modal.assertClosed();
});

test("CreatePreDefMoneyflowModal shows server errors on failed save", async () => {
  await StoreService.getInstance().initAllStores();
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Server Error Message",
  );
  PreDefMoneyflowServiceMocker.mockCreatePreDefMoneyflowRejected(backendError);

  const modalRef = ref();
  render(
    defineComponent({
      setup() {
        return () => h(CreatePreDefMoneyflowModal, { ref: modalRef });
      },
    }),
    { global: { stubs: { ModalVue: ModalStub } } },
  );

  await modalRef.value._show();

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
  await StoreService.getInstance().initAllStores();

  const modalRef = ref();
  render(
    defineComponent({
      setup() {
        return () => h(CreatePreDefMoneyflowModal, { ref: modalRef });
      },
    }),
    { global: { stubs: { ModalVue: ModalStub } } },
  );

  await modalRef.value._show();

  await CreatePreDefMoneyflowModalView.AmountInput.setValue("123.45");
  await CreatePreDefMoneyflowModalView.CommentInput.setValue(
    "Temporary Comment",
  );

  await CreatePreDefMoneyflowModalView.ResetButton.click();

  await CreatePreDefMoneyflowModalView.AmountInput.assertValue("");
  await CreatePreDefMoneyflowModalView.CommentInput.assertValue("");
});

test("CreatePreDefMoneyflowModal handles favorite abbreviation visibility", async () => {
  await StoreService.getInstance().initAllStores();

  const modalRef = ref();
  render(
    defineComponent({
      setup() {
        return () => h(CreatePreDefMoneyflowModal, { ref: modalRef });
      },
    }),
    { global: { stubs: { ModalVue: ModalStub } } },
  );

  await modalRef.value._show();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertNotToBeInDocument();

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertToBeVisible();
  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.setValue(
    "ABC",
  );

  await CreatePreDefMoneyflowModalView.FavoriteButton.click();

  await CreatePreDefMoneyflowModalView.FavoriteAbbreviationInput.assertNotToBeInDocument();
});
