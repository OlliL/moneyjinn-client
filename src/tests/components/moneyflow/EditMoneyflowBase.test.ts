import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import MoneyflowService from "@/service/MoneyflowService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import ImportedMoneyflowServiceMocker from "@/service/mocker/ImportedMoneyflowServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
  setupUserStandard,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  CollapseView,
  CollectionView,
  ComboboxView,
  InputView,
  ToastView,
  ToggleView,
} from "@/tests/TestViews";
import { createFormContext } from "@/tools/views/ValidationUtil";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref, type PropType } from "vue";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/CrudEtfService");
vi.mock("@/service/MoneyflowService");
vi.mock("@/service/ImportedMoneyflowService");

class EditMoneyflowBaseView {
  static readonly BookingDateInput = new InputView("bookingDate");
  static readonly InvoiceDateInput = new InputView("invoiceDate");
  static readonly AmountInput = new InputView("amount");
  static readonly CommentInput = new InputView("comment");
  static readonly ContractpartnerIdInput = new InputView(
    "contractpartnerCreateMoneyflow-id",
  );
  static readonly CapitalsourceIdInput = new InputView(
    "capitalsourceCreateMoneyflow-id",
  );
  static readonly PostingAccountIdInput = new InputView(
    "postingAccountCreateMoneyflow-id",
  );
  static readonly RemainderInput = new InputView("remainder");
  static readonly SplitEntriesCollapse = new CollapseView(
    "collapseSplitEntries",
  );
  static readonly SubbookingToggleButton = new ButtonView("subbookingToggle");
  static readonly AddSplitEntryRowButton = new ButtonView(
    "addMoneyflowSplitEntryRowButton",
  );
  static readonly RemainderButton = new ButtonView("remainderButton");
  static readonly SplitEntryRows = new CollectionView("splitEntryRow");

  static readonly PostingAccountCombobox = new ComboboxView(
    "postingAccountCreateMoneyflow",
  );
  static readonly ContractpartnerCombobox = new ComboboxView(
    "contractpartnerCreateMoneyflow",
  );
  static readonly CapitalsourceCombobox = new ComboboxView(
    "capitalsourceCreateMoneyflow",
  );

  static readonly PublicToggle = new ToggleView("Public");
  static readonly PrivateToggle = new ToggleView("Private");
  static readonly OnceToggle = new ToggleView("Once");
  static readonly FavoriteToggle = new ToggleView("Favorite");
  static readonly KeepToggle = new ToggleView("Keep");
  static readonly RenewToggle = new ToggleView("Renew");

  static amountSplitEntryInput(rowId: number): InputView {
    return new InputView(`amountSplitEntry#${rowId}`);
  }
  static commentSplitEntryInput(rowId: number): InputView {
    return new InputView(`commentSplitEntry#${rowId}`);
  }
  static postingAccountSplitEntryCombobox(rowId: number): ComboboxView {
    return new ComboboxView(`postingAccountSplitEntry#${rowId}`);
  }
  static splitEntryDeleteButton(rowId: number): ButtonView {
    return new ButtonView(`splitEntryRowDeleteButton#${rowId}`);
  }

  static readonly AmountError = new AlertView("amount-error-item");
  static readonly BookingDateError = new AlertView("bookingDate-error");
  static readonly ContractpartnerError = new AlertView(
    "contractpartnerCreateMoneyflow-error",
  );
  static readonly CapitalsourceError = new AlertView(
    "capitalsourceCreateMoneyflow-error",
  );
  static readonly PostingAccountError = new AlertView(
    "postingAccountCreateMoneyflow-error",
  );
  static readonly CommentError = new AlertView("comment-error-item");
  static readonly Toast = new ToastView();
}

const defaultPostingAccounts: PostingAccount[] = [
  { id: 1, name: "Posting Account 1" },
  { id: 2, name: "Posting Account 2" },
];
const defaultContractpartners: Contractpartner[] = [
  {
    id: 1,
    userId: 1,
    name: "Contractpartner 1",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    moneyflowComment: "Contractpartner Comment 1",
    postingAccountId: 1,
  },
];
const defaultCapitalsources: Capitalsource[] = [
  {
    id: 1,
    userId: 1,
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.CASH,
    comment: "cash",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  },
];

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  PostingAccountServiceMocker.mockFetchAllPostingAccount(
    defaultPostingAccounts,
  );
  ContractpartnerServiceMocker.mockFetchAllContractpartner(
    defaultContractpartners,
  );
  CapitalsourceServiceMocker.mockFetchAllCapitalsource(defaultCapitalsources);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  await StoreService.getInstance().initAllStores();
  setupUserStandard();
});

// Wir erstellen einen Wrapper, der den Kontext injiziert
const TestWrapper = defineComponent({
  components: { EditMoneyflowBase },
  props: {
    fillContractpartnerDefaults: {
      type: Boolean,
      default: false,
    },
    idSuffix: {
      type: String,
      default: "",
    },
    mmfToEdit: {
      type: Object as PropType<Moneyflow>,
      optional: true,
    },
  },
  setup() {
    createFormContext(); // Ruft intern provide(FormSymbol) auf
    return {};
  },
  template: `
    <EditMoneyflowBase 
      v-bind="$attrs" 
      :fillContractpartnerDefaults="fillContractpartnerDefaults"
      :idSuffix="idSuffix"
      :mmfToEdit="mmfToEdit"
    />
  `,
});

test("split entries handling", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.AmountInput.setValue("-100.15");
  await EditMoneyflowBaseView.CommentInput.setValue("Testcomment");
  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 2",
    "2",
  );

  await EditMoneyflowBaseView.SplitEntriesCollapse.assertCollapsed();
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.SplitEntriesCollapse.assertExpanded();
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(2);

  await EditMoneyflowBaseView.AddSplitEntryRowButton.click();
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(3);
  await EditMoneyflowBaseView.RemainderInput.assertValue("-100.15");

  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-50");
  await EditMoneyflowBaseView.CommentInput.assertNotToBeVisible();
  await EditMoneyflowBaseView.RemainderInput.assertValue("-50.15");

  await EditMoneyflowBaseView.RemainderButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-3).assertValue("-50.15");
  await EditMoneyflowBaseView.commentSplitEntryInput(-3).assertValue(
    "Testcomment",
  );
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(4);
  await EditMoneyflowBaseView.RemainderInput.assertNotToBeInDocument();

  await EditMoneyflowBaseView.splitEntryDeleteButton(-1).click();
  await EditMoneyflowBaseView.RemainderInput.assertValue("-50.00");

  await EditMoneyflowBaseView.splitEntryDeleteButton(-3).click();
  await EditMoneyflowBaseView.RemainderInput.assertValue("-100.15");
  await EditMoneyflowBaseView.CommentInput.assertValue("Testcomment");
});

test("select a Contractpartner - set and reset input fields", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );
  await EditMoneyflowBaseView.CommentInput.assertValue(
    "Contractpartner Comment 1",
  );
  await EditMoneyflowBaseView.PostingAccountIdInput.assertValue("1");

  await EditMoneyflowBaseView.ContractpartnerCombobox.clear();
  await EditMoneyflowBaseView.CommentInput.assertValue("");
  await EditMoneyflowBaseView.PostingAccountIdInput.assertValue("0");
});

test("select a Contractpartner - previously set input fields not overwritten", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.CommentInput.setValue("Testcomment");
  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 2",
    "2",
  );
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );

  await EditMoneyflowBaseView.CommentInput.assertValue("Testcomment");
  await EditMoneyflowBaseView.PostingAccountIdInput.assertValue("2");
});

test("no cash capitalsource available - no default capitalsource selected", async () => {
  const noCash: Capitalsource = {
    id: 5,
    userId: 1,
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.NON_CASH,
    comment: "non-cash only",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  };
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([noCash]);
  await StoreService.getInstance().initAllStores();

  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.CapitalsourceIdInput.assertValue("0");
});

test("invoiceDate set - contractpartner combobox uses invoiceDate for validity", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.InvoiceDateInput.setValue("01.01.2025");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );
  await EditMoneyflowBaseView.ContractpartnerIdInput.assertValue("1");
});

test("toggle private/public - switching works", async () => {
  render(TestWrapper);
  await EditMoneyflowBaseView.PublicToggle.assertChecked(); // This assertion should now pass due to resetForm being called by default.
  // Adding fillContractpartnerDefaults: true here for consistency, though it might not be strictly necessary if resetForm is called by default.
  // render(TestWrapper, { props: { fillContractpartnerDefaults: true } });
  await EditMoneyflowBaseView.PrivateToggle.click();
  await EditMoneyflowBaseView.PrivateToggle.assertChecked();
  await EditMoneyflowBaseView.PublicToggle.assertUnchecked();
});

test("selecting PreDefMoneyflow changes toggle labels to keep/renew", async () => {
  const preDef: PreDefMoneyflow = {
    id: 1,
    amount: 20.4,
    capitalsourceId: 1,
    contractpartnerId: 1,
    comment: "PreDef",
    postingAccountId: 1,
  } as PreDefMoneyflow;

  const { rerender } = render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.OnceToggle.assertChecked();

  await rerender({ selectedPreDefMoneyflow: preDef });
  await EditMoneyflowBaseView.KeepToggle.assertChecked();
  await EditMoneyflowBaseView.RenewToggle.assertUnchecked();
});

test("split entries - incomplete remainder makes remainder invalid", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.AmountInput.setValue("-100.00");
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-40.00");

  await EditMoneyflowBaseView.RemainderInput.assertValue("-60.00");
  await EditMoneyflowBaseView.RemainderInput.assertToBeVisible();
});

test("remainder button with no amount set - remainder stays zero", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.RemainderInput.assertNotToBeInDocument(500);
});

test("choose a PreDefMoneyflow - comment field is filled from PreDefMoneyflow", async () => {
  const preDef: PreDefMoneyflow = {
    id: 1,
    amount: 20.4,
    capitalsourceId: 1,
    contractpartnerId: 1,
    comment: "PreDef Comment",
    postingAccountId: 1,
  } as PreDefMoneyflow;

  const { rerender } = render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await rerender({ selectedPreDefMoneyflow: preDef });

  await EditMoneyflowBaseView.AmountInput.assertValue("20.4");
  await EditMoneyflowBaseView.CommentInput.assertValue("PreDef Comment");
});

test("resetForm resets the component state", async () => {
  const { rerender } = render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.AmountInput.setValue("50");
  await EditMoneyflowBaseView.CommentInput.setValue("To be reset");

  // Trigger reset by changing the mmfToEdit prop
  await rerender({ mmfToEdit: { bookingDate: new Date() } });

  await EditMoneyflowBaseView.AmountInput.assertValue("");
  await EditMoneyflowBaseView.CommentInput.assertValue("");
});

test("capitalsource defaults to CASH on mount", async () => {
  const cashSource: Capitalsource = {
    id: 1,
    userId: 1,
    state: CapitalsourceState.CASH,
    type: CapitalsourceType.CURRENT_ASSET,
    comment: "Cash",
    validFrom: new Date("2000-01-01"),
    validTil: new Date("2999-12-31"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  };
  const bankSource: Capitalsource = {
    id: 2,
    userId: 1,
    state: CapitalsourceState.NON_CASH,
    type: CapitalsourceType.CURRENT_ASSET,
    comment: "Bank",
    validFrom: new Date("2000-01-01"),
    validTil: new Date("2999-12-31"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  };

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    bankSource,
    cashSource,
  ]);
  await StoreService.getInstance().initAllStores();

  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.CapitalsourceIdInput.assertValue("1");
});

test("Toggle Labels change based on PreDefMoneyflow selection", async () => {
  const preDef = { id: 1 } as PreDefMoneyflow;
  const { rerender } = render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.OnceToggle.assertChecked();
  await rerender({ selectedPreDefMoneyflow: preDef });
  await EditMoneyflowBaseView.KeepToggle.assertChecked();
});

test("validation: amount is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.AmountInput.setValue("10");
  await EditMoneyflowBaseView.AmountInput.setValue("");
  await EditMoneyflowBaseView.AmountInput.pressEnter();

  await EditMoneyflowBaseView.AmountError.assertMessageContains(
    "Please specify an amount!",
  );
});

test("validation: bookingDate is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.BookingDateInput.setValue("01.01.2025");
  await EditMoneyflowBaseView.BookingDateInput.setValue("");
  await EditMoneyflowBaseView.BookingDateInput.pressEnter();

  await EditMoneyflowBaseView.BookingDateError.assertMessageContains(
    "Please specify a posting date!",
  );
});

test("validation: contractpartner is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );
  await EditMoneyflowBaseView.ContractpartnerCombobox.clear();

  await EditMoneyflowBaseView.ContractpartnerError.assertMessageContains(
    "Please specify a business partner!",
  );
});

test("validation: capitalsource is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  // Capitalsource defaults to 1 (Cash) on mount via resetForm
  await EditMoneyflowBaseView.CapitalsourceIdInput.assertValue("1");

  await EditMoneyflowBaseView.CapitalsourceCombobox.clear();

  await EditMoneyflowBaseView.CapitalsourceError.assertMessageContains(
    "Please specify an account!",
  );
});

test("validation: comment is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.CommentInput.setValue("trigger validation");
  await EditMoneyflowBaseView.CommentInput.setValue("");
  await EditMoneyflowBaseView.CommentInput.pressEnter();

  await EditMoneyflowBaseView.CommentError.assertMessageContains(
    "Please specify a comment!",
  );
});

test("validation: comment maximum length", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.CommentInput.setValue("a".repeat(101));
  await EditMoneyflowBaseView.CommentInput.pressEnter();

  await EditMoneyflowBaseView.CommentError.assertMessageContains(
    "Comment is too long!",
  );
});

test("validation: posting account is required", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    "1",
  );
  await EditMoneyflowBaseView.PostingAccountCombobox.clear();

  await EditMoneyflowBaseView.PostingAccountError.assertMessageContains(
    "Please specify a posting account!",
  );
});

test("validation: comment and posting account optional when split entries present", async () => {
  render(TestWrapper, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-10");

  await EditMoneyflowBaseView.CommentError.assertNotToBeInDocument();
  await EditMoneyflowBaseView.PostingAccountError.assertNotToBeInDocument();
});

test("initializes correctly in edit mode", async () => {
  const mmfToEdit = {
    id: 123,
    bookingDate: new Date("2024-05-20"),
    invoiceDate: new Date("2024-05-21"),
    amount: -50,
    contractpartnerId: 1,
    contractpartnerName: "Contractpartner 1",
    capitalsourceId: 1,
    capitalsourceComment: "cash",
    comment: "Main Comment",
    postingAccountId: 1,
    postingAccountName: "Posting Account 1",
    moneyflowSplitEntries: [
      { id: 10, amount: -20, comment: "Split 1", postingAccountId: 1 },
      { id: 11, amount: -30, comment: "Split 2", postingAccountId: 2 },
    ],
  } as any;

  render(TestWrapper, { props: { mmfToEdit } });

  await EditMoneyflowBaseView.AmountInput.assertValue("-50");
  // Main comment/posting account should be hidden when split entries exist
  await EditMoneyflowBaseView.CommentInput.assertNotToBeVisible();
  // 2 existing + 1 empty row added by resetEditForm logic
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(3);
  await EditMoneyflowBaseView.amountSplitEntryInput(10).assertValue("-20");
  await EditMoneyflowBaseView.amountSplitEntryInput(11).assertValue("-30");
});

test("updateMoneyflow sends correct diff arrays for split entries", async () => {
  const mmfToEdit = {
    id: 123,
    bookingDate: new Date("2024-05-20"),
    amount: -100,
    contractpartnerId: 1,
    capitalsourceId: 1,
    comment: "Old Main",
    postingAccountId: 1,
    moneyflowSplitEntries: [
      { id: 10, amount: -40, comment: "Old 1", postingAccountId: 1 },
      { id: 11, amount: -60, comment: "Old 2", postingAccountId: 1 },
    ],
  } as any;

  MoneyflowServiceMocker.mockUpdateMoneyflowResolved();

  // Helper to access exposed methods
  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, { ref: editRef, mmfToEdit });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  // 1. Delete first entry (ID 10)
  await EditMoneyflowBaseView.splitEntryDeleteButton(10).click();

  // 2. Update second entry (ID 11)
  await EditMoneyflowBaseView.commentSplitEntryInput(11).setValue("Updated 2");

  // 3. Add new entry (resetEditForm added ID -12, so this one gets -13)
  await EditMoneyflowBaseView.AddSplitEntryRowButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-13).setValue("-40");
  await EditMoneyflowBaseView.commentSplitEntryInput(-13).setValue("New Entry");
  await EditMoneyflowBaseView.postingAccountSplitEntryCombobox(-13).selectItem(
    "Posting Account 1",
    1,
  );

  // 4. Adjust ID 11 amount so sum matches total (-100)
  await EditMoneyflowBaseView.amountSplitEntryInput(11).setValue("-60");

  // Trigger update logic
  await editComponent.updateMoneyflow();

  await assertHaveBeenCalledWith(
    MoneyflowService.updateMoneyflow,
    expect.objectContaining({ id: 123 }),
    [
      expect.objectContaining({
        id: -13,
        comment: "New Entry",
        amount: -40,
      }),
    ],
    [expect.objectContaining({ id: 11, comment: "Updated 2" })],
    [10], // Deleted ID
  );
});

test("createMoneyflow returns false and does not call service if remainder is invalid", async () => {
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  // Setup basic valid data
  await EditMoneyflowBaseView.AmountInput.setValue("100.00");
  await EditMoneyflowBaseView.CommentInput.setValue("Main Comment");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    1,
  );
  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    1,
  );

  // Add a split entry that creates a remainder (100 - 40 = 60)
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("40.00");
  await EditMoneyflowBaseView.commentSplitEntryInput(-1).setValue("Split");
  await EditMoneyflowBaseView.postingAccountSplitEntryCombobox(-1).selectItem(
    "Posting Account 1",
    1,
  );

  const result = await editComponent.createMoneyflow();

  expect(result).toBe(false);
  await assertNotHaveBeenCalled(MoneyflowService.createMoneyflow);
});

test("watchers synchronize names in mmf object when IDs change", async () => {
  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 2",
    2,
  );
  expect(editComponent.mmf.postingAccountName).toBe("Posting Account 2");

  await EditMoneyflowBaseView.CapitalsourceCombobox.selectItem("cash", 1);
  expect(editComponent.mmf.capitalsourceComment).toBe("cash");
});

test("importImportedMoneyflow maps fields and calls service", async () => {
  const mimTechnicalFields: ImportedMoneyflow = {
    accountNumber: "DE123",
    bankCode: "BANK",
    externalid: "EXT123",
    name: "Imported Name",
    usage: "Imported Usage",
    accountNumberCapitalsource: "CSACC",
    bankCodeCapitalsource: "CSBANK",
  } as ImportedMoneyflow;
  ImportedMoneyflowServiceMocker.mockImportImportedMoneyflowResolved();

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  // 1. Setup UI state (functional fields)
  await EditMoneyflowBaseView.BookingDateInput.setValue("15.01.2024");
  await EditMoneyflowBaseView.AmountInput.setValue("-123.45");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    1,
  );

  // 2. Setup Subbookings in UI (since importImportedMoneyflow takes them from UI state)
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-50");
  await EditMoneyflowBaseView.commentSplitEntryInput(-1).setValue("Split A");
  await EditMoneyflowBaseView.postingAccountSplitEntryCombobox(-1).selectItem(
    "Posting Account 1",
    1,
  );

  await EditMoneyflowBaseView.amountSplitEntryInput(-2).setValue("-73.45");
  await EditMoneyflowBaseView.commentSplitEntryInput(-2).setValue("Split B");
  await EditMoneyflowBaseView.postingAccountSplitEntryCombobox(-2).selectItem(
    "Posting Account 2",
    2,
  );

  // 3. Trigger Import
  const result =
    await editComponent.importImportedMoneyflow(mimTechnicalFields);

  expect(result).toBe(true);

  // 4. Verify service call (merged model object)
  await assertHaveBeenCalledWith(
    ImportedMoneyflowService.importImportedMoneyflow,
    expect.objectContaining({
      amount: -123.45,
      accountNumber: "DE123",
      bankCode: "BANK",
      externalid: "EXT123",
      name: "Imported Name",
      usage: "Imported Usage",
      accountNumberCapitalsource: "CSACC",
      bankCodeCapitalsource: "CSBANK",
      moneyflowSplitEntries: expect.arrayContaining([
        expect.objectContaining({ amount: -50, comment: "Split A" }),
        expect.objectContaining({ amount: -73.45, comment: "Split B" }),
      ]),
    }),
  );
});

test("createMoneyflow sends saveAsPreDefMoneyflow=true when Favorite toggle is active", async () => {
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  // Setup basic valid data
  await EditMoneyflowBaseView.AmountInput.setValue("100.00");
  await EditMoneyflowBaseView.CommentInput.setValue("Favorite Moneyflow");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    1,
  );
  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    1,
  );

  // Activate Favorite toggle
  await EditMoneyflowBaseView.FavoriteToggle.click();
  await EditMoneyflowBaseView.FavoriteToggle.assertChecked();

  const result = await editComponent.createMoneyflow();

  expect(result).toBe(true);
  await assertHaveBeenCalledWith(
    MoneyflowService.createMoneyflow,
    expect.any(Object), // Moneyflow object
    0, // usedPreDefMoneyflowId
    true, // saveAsPreDefMoneyflow
  );
});

test("createMoneyflow sends saveAsPreDefMoneyflow=true when Renew toggle is active (from PreDefMoneyflow)", async () => {
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();

  const preDef: PreDefMoneyflow = {
    id: 42,
    amount: 50,
    capitalsourceId: 1,
    contractpartnerId: 1,
    comment: "PreDef to Renew",
    postingAccountId: 1,
  } as PreDefMoneyflow;

  const editRef = ref<any>();
  const selectedPreDef = ref<PreDefMoneyflow | undefined>(undefined);
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        selectedPreDefMoneyflow: selectedPreDef.value,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  // Trigger the non-immediate watcher in EditMoneyflowBase
  selectedPreDef.value = preDef;

  // The component should already be filled from preDef and Renew toggle should be active by default
  await EditMoneyflowBaseView.KeepToggle.assertChecked(); // Default state when preDef is selected

  // Click Renew toggle (which is the 'on' state for preDefMoneyflowId > 0)
  await EditMoneyflowBaseView.RenewToggle.click();
  await EditMoneyflowBaseView.RenewToggle.assertChecked();

  const result = await editComponent.createMoneyflow();

  expect(result).toBe(true);
  await assertHaveBeenCalledWith(
    MoneyflowService.createMoneyflow,
    expect.any(Object), // Moneyflow object
    42, // usedPreDefMoneyflowId
    true, // saveAsPreDefMoneyflow
  );
});

test("deleteImportedMoneyflow calls service and returns true", async () => {
  ImportedMoneyflowServiceMocker.mockDeleteImportedMoneyflowByIdResolved();

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, { ref: editRef });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  const result = await editComponent.deleteImportedMoneyflow(123);

  expect(result).toBe(true);
  await assertHaveBeenCalledWith(
    ImportedMoneyflowService.deleteImportedMoneyflow,
    123,
  );
});

test("createMoneyflow shows server errors on rejection", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  MoneyflowServiceMocker.mockCreateMoneyflowRejected(backendError);

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  await EditMoneyflowBaseView.AmountInput.setValue("10");
  await EditMoneyflowBaseView.CommentInput.setValue("Test");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    1,
  );
  await EditMoneyflowBaseView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    1,
  );

  const result = await editComponent.createMoneyflow();

  expect(result).toBe(false);
  await EditMoneyflowBaseView.Toast.assertError("Backend Error Message");
});

test("prepareServerCall fills main comment and posting account from split entries if empty", async () => {
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();

  const editRef = ref<any>();
  const TestWrapper = defineComponent({
    render() {
      return h(EditMoneyflowBase, {
        ref: editRef,
        fillContractpartnerDefaults: true,
      });
    },
  });
  render(TestWrapper);
  const editComponent = editRef.value;

  await EditMoneyflowBaseView.AmountInput.setValue("100.00");
  await EditMoneyflowBaseView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    1,
  );
  // Explicitly clear main comment and posting account to test filling from split entries
  await EditMoneyflowBaseView.CommentInput.setValue("");
  await EditMoneyflowBaseView.PostingAccountCombobox.clear();

  // Main comment and posting account are left EMPTY

  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("100.00");
  await EditMoneyflowBaseView.commentSplitEntryInput(-1).setValue(
    "Split Comment",
  );
  await EditMoneyflowBaseView.postingAccountSplitEntryCombobox(-1).selectItem(
    "Posting Account 2",
    2,
  );

  await editComponent.createMoneyflow();

  await assertHaveBeenCalledWith(
    MoneyflowService.createMoneyflow,
    expect.objectContaining({
      comment: "Split Comment",
      postingAccountId: 2,
    }),
    expect.any(Number),
    expect.any(Boolean),
  );
});

test("deleting a split entry row maintains at least 2 rows", async () => {
  render(TestWrapper, { props: { fillContractpartnerDefaults: true } });

  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(2);

  await EditMoneyflowBaseView.splitEntryDeleteButton(-1).click();
  await EditMoneyflowBaseView.SplitEntryRows.assertCount(2);
});
