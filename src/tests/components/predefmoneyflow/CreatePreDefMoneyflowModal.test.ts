import CreatePreDefMoneyflowModal from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
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
import { assertHaveBeenCalledOnce } from "@/tests/TestUtil";
import {
  ButtonView,
  ComboboxView,
  InputView,
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
  static readonly ContractpartnerCombobox = new ComboboxView(
    "contractpartnerCreatePreDefMoneyflow",
  );
  static readonly CapitalsourceCombobox = new ComboboxView(
    "capitalsourceCreatePreDefMoneyflow",
  );
  static readonly PostingAccountCombobox = new ComboboxView(
    "postingAccountCreatePreDefMoneyflow",
  );
  static readonly SaveButton = new ButtonView(
    "createPreDefMoneyflowSaveButton",
  );
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

  // Stubbing ModalVue to prevent eager rendering of its slots in JSDOM.
  // This ensures 'mpm' is initialized via _show() before the form is rendered.
  const ModalStub = defineComponent({
    data: () => ({ isOpen: false }),
    methods: {
      _show() {
        (this as any).isOpen = true;
      },
      _hide() {
        (this as any).isOpen = false;
      },
    },
    template:
      '<div v-if="isOpen" data-testid="app-modal"><slot name="body" /><slot name="footer" /></div>',
  });

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
