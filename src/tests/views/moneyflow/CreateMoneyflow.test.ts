import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import MoneyflowService from "@/service/MoneyflowService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import { assertHaveBeenCalledOnce } from "@/tests/TestUtil";
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
  SelectView,
  ToggleView,
} from "@/tests/TestViews";
import CreateMoneyflow from "@/views/moneyflow/CreateMoneyflow.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/CrudEtfService");
vi.mock("@/service/MoneyflowService");
vi.mock("@/service/ImportedMoneyflowService");

class CreateMoneyflowView {
  static readonly BookingDateInput = new InputView("bookingDate");
  static readonly InvoiceDateInput = new InputView("invoiceDate");
  static readonly AmountInput = new InputView("amount");
  static readonly CommentInput = new InputView("comment");
  static readonly ContractpartnerInput = new InputView(
    "contractpartnerCreateMoneyflow",
  );
  static readonly ContractpartnerIdInput = new InputView(
    "contractpartnerCreateMoneyflow-id",
  );
  static readonly CapitalsourceIdInput = new InputView(
    "capitalsourceCreateMoneyflow-id",
  );
  static readonly PostingAccountInput = new InputView(
    "postingAccountCreateMoneyflow",
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
  static readonly ResetButton = new ButtonView("createMoneyflowResetButton");
  static readonly SaveButton = new ButtonView("createMoneyflowSaveButton");
  static readonly ServerErrorItem = new AlertView("serverError-item");
  static readonly SelectMoneyflow = new SelectView("selectmoneyflow");

  static readonly PostingAccountCombobox = new ComboboxView(
    "postingAccountCreateMoneyflow",
  );
  static readonly ContractpartnerCombobox = new ComboboxView(
    "contractpartnerCreateMoneyflow",
  );

  static readonly PublicToggle = new ToggleView("public");
  static readonly PrivateToggle = new ToggleView("private");
  static readonly OnceToggle = new ToggleView("once");
  static readonly FavoriteToggle = new ToggleView("favorite");
  static readonly KeepToggle = new ToggleView("keep");
  static readonly RenewToggle = new ToggleView("renew");

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
}

const defaultPostingAccounts: PostingAccount[] = [
  {
    id: 1,
    name: "Posting Account 1",
  } as PostingAccount,
  {
    id: 2,
    name: "Posting Account 2",
  } as PostingAccount,
];

const defaultContractpartners: Contractpartner[] = [
  {
    id: 1,
    userId: 1,
    name: "Contractpartner 1",
    street: "Street 1",
    postcode: 11111,
    town: "Town 1",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    country: "Germany",
    moneyflowComment: "Contractpartner Comment 1",
    postingAccountId: 1,
    postingAccountName: "Posting Account 1",
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
  {
    id: 2,
    userId: 1,
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.NON_CASH,
    comment: "non-cash",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  } as Capitalsource,
];

const defaultPreDefMoneyflows: PreDefMoneyflow[] = [
  {
    id: 1,
    userId: 1,
    amount: 20.4,
    capitalsourceId: 2,
    contractpartnerId: 1,
    contractpartnerName: "Contractpartner 1",
    comment: "PreDefMoneyflow Comment 1",
    createDate: new Date("2010-01-01"),
    onceAMonth: false,
    postingAccountId: 1,
  } as PreDefMoneyflow,
];

const applyDefaultMocks = () => {
  PostingAccountServiceMocker.mockFetchAllPostingAccount([
    ...defaultPostingAccounts,
  ]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([
    ...defaultContractpartners,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    ...defaultCapitalsources,
  ]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([
    ...defaultPreDefMoneyflows,
  ]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  MoneyflowServiceMocker.mockCreateMoneyflowResolved();
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  applyDefaultMocks();
});

test("render - form initialized", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mmNum = today.getMonth() + 1; // month is zero-based
  let mmStr = mmNum + "";

  const ddNum = today.getDate();
  let ddStr = ddNum + "";

  if (ddNum < 10) ddStr = "0" + ddStr;
  if (mmNum < 10) mmStr = "0" + mmStr;

  const formatted = ddStr + "." + mmStr + "." + yyyy;

  // 1st row
  await CreateMoneyflowView.BookingDateInput.assertValue(formatted);
  await CreateMoneyflowView.InvoiceDateInput.assertValue("");
  await CreateMoneyflowView.ContractpartnerInput.assertValue("");
  await CreateMoneyflowView.CapitalsourceIdInput.assertValue("1");
  // 2nd row
  await CreateMoneyflowView.AmountInput.assertValue("");
  await CreateMoneyflowView.CommentInput.assertValue("");
  await CreateMoneyflowView.PostingAccountInput.assertValue("");
  await CreateMoneyflowView.PublicToggle.assertChecked();
  await CreateMoneyflowView.PrivateToggle.assertUnchecked();
  await CreateMoneyflowView.OnceToggle.assertChecked();
  await CreateMoneyflowView.FavoriteToggle.assertUnchecked();
});

test("split entries handling", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  //
  // 01. input moneyflow data
  //

  await CreateMoneyflowView.AmountInput.setValue("-100.15");
  await CreateMoneyflowView.CommentInput.setValue("Testcomment");
  await CreateMoneyflowView.PostingAccountCombobox.selectItem(
    "Posting Account 2",
    "2",
  );

  //
  // 02. check that subbookings div is collapsed
  //

  await CreateMoneyflowView.SplitEntriesCollapse.assertCollapsed();

  //
  // 03. show subbookings div and make sure it has 2 rows
  //

  await CreateMoneyflowView.SubbookingToggleButton.click();
  await CreateMoneyflowView.SplitEntriesCollapse.assertExpanded();
  await CreateMoneyflowView.SplitEntryRows.assertCount(2);

  //
  // 04. add one more subbookings row
  //

  await CreateMoneyflowView.AddSplitEntryRowButton.click();
  await CreateMoneyflowView.SplitEntryRows.assertCount(3);

  //
  // 05. check remainder is filled correctly
  //

  await CreateMoneyflowView.RemainderInput.assertValue("-100.15");

  //
  // 06. check that moneyflow comment/postingAccount inputs are removed on 1st entering of a subbooking
  //

  await CreateMoneyflowView.amountSplitEntryInput(-1).setValue("-50");

  await CreateMoneyflowView.CommentInput.assertNotToBeVisible();
  await CreateMoneyflowView.PostingAccountInput.assertNotToBeVisible();
  await CreateMoneyflowView.AmountInput.assertToBeVisible();

  //
  // 07. check that remainder is now reduced
  //

  await CreateMoneyflowView.RemainderInput.assertValue("-50.15");

  //
  // 08. move remainder and original moneyflow comment+PostingAccount to last subbokings row
  //     a new row must be created as well
  //
  await CreateMoneyflowView.RemainderButton.click();
  await CreateMoneyflowView.amountSplitEntryInput(-3).assertValue("-50.15");
  await CreateMoneyflowView.commentSplitEntryInput(-3).assertValue(
    "Testcomment",
  );
  await CreateMoneyflowView.postingAccountSplitEntryIdInput(-3).assertValue(
    "2",
  );
  await CreateMoneyflowView.SplitEntryRows.assertCount(4);

  //
  // 09. remainder removed because no amount remains to be distributed
  //

  await CreateMoneyflowView.RemainderInput.assertNotToBeInDocument();

  //
  // 10. on deletion of the 1st subbooking row, the remainder must reappear
  //

  await CreateMoneyflowView.splitEntryDeleteButton(-1).click();
  await CreateMoneyflowView.RemainderInput.assertValue("-50.00");

  //
  // 11. on deleting the last row with content, the remainder must be updated
  //     and the main comment + PostingAccount fields have to appear back
  //

  await CreateMoneyflowView.splitEntryDeleteButton(-3).click();
  await CreateMoneyflowView.RemainderInput.assertValue("-100.15");

  await CreateMoneyflowView.CommentInput.assertValue("Testcomment");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("2");

  //
  // 12. collapse subbokings div
  //

  await CreateMoneyflowView.SubbookingToggleButton.click();
  await CreateMoneyflowView.SplitEntriesCollapse.assertCollapsed();
}, 10000);

test("select a PreDefMoneyflow - fill input fields", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("new booking");
  await CreateMoneyflowView.SelectMoneyflow.selectOption(
    "1",
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );

  await CreateMoneyflowView.KeepToggle.assertChecked();
  await CreateMoneyflowView.RenewToggle.assertUnchecked();
  await CreateMoneyflowView.AmountInput.assertValue("20.4");
  await CreateMoneyflowView.CommentInput.assertValue(
    "PreDefMoneyflow Comment 1",
  );
  await CreateMoneyflowView.ContractpartnerIdInput.assertValue("1");
  await CreateMoneyflowView.CapitalsourceIdInput.assertValue("2");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("1");
});

test("select a Contractpartner - set and reset input fields", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );

  await CreateMoneyflowView.CommentInput.assertValue(
    "Contractpartner Comment 1",
  );
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("1");

  await CreateMoneyflowView.ContractpartnerCombobox.clear();

  await CreateMoneyflowView.CommentInput.assertValue("");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("0");
  await CreateMoneyflowView.ContractpartnerIdInput.assertValue("0");
});

test("select a Contractpartner - previously set input fields not overwritten", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.CommentInput.setValue("Testcomment");
  await CreateMoneyflowView.PostingAccountCombobox.selectItem(
    "Posting Account 2",
    "2",
  );

  await CreateMoneyflowView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );

  await CreateMoneyflowView.CommentInput.assertValue("Testcomment");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("2");
});

// Test 1: Reset button clears the form
test("reset button clears all form fields", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.AmountInput.setValue("-42");
  await CreateMoneyflowView.CommentInput.setValue("Before-Reset-Comment");

  await CreateMoneyflowView.ResetButton.click();

  await CreateMoneyflowView.AmountInput.assertValue("");
  await CreateMoneyflowView.CommentInput.assertValue("");
  await CreateMoneyflowView.ContractpartnerIdInput.assertValue("0");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("0");

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("");
});

// Test 2: Select PreDefMoneyflow -> reset -> back to empty state
test("reset after PreDefMoneyflow selection restores once/favorite toggles", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("new booking");
  await CreateMoneyflowView.SelectMoneyflow.selectOption(
    "1",
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );

  // after selection: keep/renew labels must be present
  await CreateMoneyflowView.KeepToggle.assertChecked();

  await CreateMoneyflowView.ResetButton.click();

  // after reset: once/favorite labels must be back
  await CreateMoneyflowView.OnceToggle.assertChecked();
  await CreateMoneyflowView.FavoriteToggle.assertUnchecked();

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("new booking");
});

// Test 3: once-a-month PreDefMoneyflow already used this month is hidden
test("PreDefMoneyflow with onceAMonth used this month is not shown in select", async () => {
  const now = new Date();
  const onceAMonthUsed: PreDefMoneyflow = {
    id: 99,
    userId: 1,
    amount: 10,
    capitalsourceId: 1,
    contractpartnerId: 1,
    contractpartnerName: "OnceAMonth Partner",
    comment: "Already used",
    onceAMonth: true,
    lastUsed: new Date(now.getFullYear(), now.getMonth(), 1),
    postingAccountId: 1,
  };

  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([onceAMonthUsed]);

  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("");

  await CreateMoneyflowView.SelectMoneyflow.open();
  await CreateMoneyflowView.SelectMoneyflow.assertOptionMissingByValue("99");
});

// Test 4: No CASH capital source available -> capitalsourceId stays 0
test("no cash capitalsource available - no default capitalsource selected", async () => {
  const noCashCapitalsource: Capitalsource = {
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

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([noCashCapitalsource]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);

  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.CapitalsourceIdInput.assertValue("0");
});

// Test 5: InvoiceDate set -> validityDate uses invoiceDate
test("invoiceDate set - contractpartner combobox uses invoiceDate for validity", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  // The invoiceDateField starts empty - the contractpartner combobox should still work
  // because validityDate falls back to bookingDate (today) when invoiceDate is undefined.
  // Set an invoiceDate and verify contractpartner is still selectable (validity check passes).
  await CreateMoneyflowView.InvoiceDateInput.setValue("01.01.2025");

  // Contractpartner 1 is valid from 2000-01-01 to 2999-12-01, so it must still appear
  await CreateMoneyflowView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );

  await CreateMoneyflowView.ContractpartnerIdInput.assertValue("1");
});

// Test 6: Toggle "private/public" switches correctly
test("toggle private/public - switching works", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  // initial: public active, private inactive
  await CreateMoneyflowView.PublicToggle.assertChecked();
  await CreateMoneyflowView.PrivateToggle.assertUnchecked();

  // click private
  await CreateMoneyflowView.PrivateToggle.click();

  await CreateMoneyflowView.PrivateToggle.assertChecked();
  await CreateMoneyflowView.PublicToggle.assertUnchecked();
});

// Test 7: Selecting PreDefMoneyflow changes toggle labels to keep/renew
test("selecting PreDefMoneyflow changes toggle labels to keep/renew", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  // before: once/favorite labels
  await CreateMoneyflowView.OnceToggle.assertChecked();

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("new booking");
  await CreateMoneyflowView.SelectMoneyflow.selectOption(
    "1",
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );

  // after: keep/renew labels
  await CreateMoneyflowView.KeepToggle.assertChecked();
  await CreateMoneyflowView.RenewToggle.assertUnchecked();
});

// Test 8: Incomplete split entry -> mseRemainderIsValid = false
test("split entries - incomplete remainder makes remainder invalid", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.AmountInput.setValue("-100.00");

  // open split entries
  await CreateMoneyflowView.SubbookingToggleButton.click();

  await CreateMoneyflowView.amountSplitEntryInput(-1).setValue("-40.00");

  // remainder must exist and show -60.00 (not 0, so invalid)
  await CreateMoneyflowView.RemainderInput.assertValue("-60.00");

  // the remainder input must be visible (showing invalid state)
  await CreateMoneyflowView.RemainderInput.assertToBeVisible();
});

// Test 9: Successful submit -> form resets
test("successful submit resets the form", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  MoneyflowServiceMocker.mockCreateMoneyflowResolved();

  render(CreateMoneyflow);

  await CreateMoneyflowView.AmountInput.setValue("-50");
  await CreateMoneyflowView.CommentInput.setValue("Submit-Test");
  await CreateMoneyflowView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );
  await CreateMoneyflowView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    "1",
  );

  await CreateMoneyflowView.SaveButton.click();

  await assertHaveBeenCalledOnce(MoneyflowService.createMoneyflow);

  await CreateMoneyflowView.AmountInput.assertValue("");
  await CreateMoneyflowView.CommentInput.assertValue("");
});

// Test 10: Failed submit -> server error is shown
test("failed submit shows server error message", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Server not reachable",
  );
  MoneyflowServiceMocker.mockCreateMoneyflowRejected(backendError);

  render(CreateMoneyflow);

  await CreateMoneyflowView.AmountInput.setValue("-50");
  await CreateMoneyflowView.CommentInput.setValue("Error-Test");
  await CreateMoneyflowView.ContractpartnerCombobox.selectItem(
    "Contractpartner 1",
    "1",
  );
  await CreateMoneyflowView.PostingAccountCombobox.selectItem(
    "Posting Account 1",
    "1",
  );

  await CreateMoneyflowView.SaveButton.click();

  await CreateMoneyflowView.ServerErrorItem.assertMessageContains(
    "Server not reachable",
  );
});

// Test 11: Remainder button with empty amount -> no effect
test("remainder button with no amount set - remainder stays zero", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.SubbookingToggleButton.click();
  await CreateMoneyflowView.RemainderInput.assertNotToBeInDocument(2000);
});

// Test 12: PreDefMoneyflow comment is copied into the comment field
test("choose a PreDefMoneyflow - comment field is filled from PreDefMoneyflow", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("new booking");
  await CreateMoneyflowView.SelectMoneyflow.selectOption(
    "1",
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );

  // preDefMoneyflow: { amount: 20.4, capitalsourceId: 2, contractpartnerId: 1,
  //   comment: "PreDefMoneyflow Comment 1", postingAccountId: 1 }
  // All fields must be filled correctly after PreDefMoneyflow selection.
  await CreateMoneyflowView.AmountInput.assertValue("20.4");
  await CreateMoneyflowView.CommentInput.assertValue(
    "PreDefMoneyflow Comment 1",
  );
  await CreateMoneyflowView.ContractpartnerIdInput.assertValue("1");
  await CreateMoneyflowView.CapitalsourceIdInput.assertValue("2");
  await CreateMoneyflowView.PostingAccountIdInput.assertValue("1");
});
