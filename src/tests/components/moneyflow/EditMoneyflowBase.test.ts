import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
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
  AlertView,
  ButtonView,
  CollapseView,
  CollectionView,
  ComboboxView,
  InputView,
  ToggleView,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/CrudEtfService");

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
  static postingAccountSplitEntryIdInput(rowId: number): InputView {
    return new InputView(`postingAccountSplitEntry#${rowId}-id`);
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
}

const defaultPostingAccounts: PostingAccount[] = [
  { id: 1, name: "Posting Account 1" } as PostingAccount,
  { id: 2, name: "Posting Account 2" } as PostingAccount,
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
  } as Contractpartner,
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
  } as Capitalsource,
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
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
});

test("split entries handling", async () => {
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  } as Capitalsource;
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([noCash]);
  await StoreService.getInstance().initAllStores();

  render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.CapitalsourceIdInput.assertValue("0");
});

test("invoiceDate set - contractpartner combobox uses invoiceDate for validity", async () => {
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase);
  await EditMoneyflowBaseView.PublicToggle.assertChecked(); // This assertion should now pass due to resetForm being called by default.
  // Adding fillContractpartnerDefaults: true here for consistency, though it might not be strictly necessary if resetForm is called by default.
  // render(EditMoneyflowBase, { props: { fillContractpartnerDefaults: true } });
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

  const { rerender } = render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.OnceToggle.assertChecked();

  await rerender({ selectedPreDefMoneyflow: preDef });
  await EditMoneyflowBaseView.KeepToggle.assertChecked();
  await EditMoneyflowBaseView.RenewToggle.assertUnchecked();
});

test("split entries - incomplete remainder makes remainder invalid", async () => {
  render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.AmountInput.setValue("-100.00");
  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-40.00");

  await EditMoneyflowBaseView.RemainderInput.assertValue("-60.00");
  await EditMoneyflowBaseView.RemainderInput.assertToBeVisible();
});

test("remainder button with no amount set - remainder stays zero", async () => {
  render(EditMoneyflowBase, {
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

  const { rerender } = render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });
  await rerender({ selectedPreDefMoneyflow: preDef });

  await EditMoneyflowBaseView.AmountInput.assertValue("20.4");
  await EditMoneyflowBaseView.CommentInput.assertValue("PreDef Comment");
});

test("resetForm resets the component state", async () => {
  const { rerender } = render(EditMoneyflowBase, {
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
  } as Capitalsource;
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
  } as Capitalsource;

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    bankSource,
    cashSource,
  ]);
  await StoreService.getInstance().initAllStores();

  render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });
  await EditMoneyflowBaseView.CapitalsourceIdInput.assertValue("1");
});

test("Toggle Labels change based on PreDefMoneyflow selection", async () => {
  const preDef = { id: 1 } as PreDefMoneyflow;
  const { rerender } = render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.OnceToggle.assertChecked();
  await rerender({ selectedPreDefMoneyflow: preDef });
  await EditMoneyflowBaseView.KeepToggle.assertChecked();
});

test("validation: amount is required", async () => {
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.CommentInput.setValue("a".repeat(101));
  await EditMoneyflowBaseView.CommentInput.pressEnter();

  await EditMoneyflowBaseView.CommentError.assertMessageContains(
    "Comment is too long!",
  );
});

test("validation: posting account is required", async () => {
  render(EditMoneyflowBase, {
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
  render(EditMoneyflowBase, {
    props: { fillContractpartnerDefaults: true },
  });

  await EditMoneyflowBaseView.SubbookingToggleButton.click();
  await EditMoneyflowBaseView.amountSplitEntryInput(-1).setValue("-10");

  await EditMoneyflowBaseView.CommentError.assertNotToBeInDocument();
  await EditMoneyflowBaseView.PostingAccountError.assertNotToBeInDocument();
});
