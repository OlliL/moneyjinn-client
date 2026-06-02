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
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalledOnce } from "@/tests/TestUtil";
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
}

const defaultPostingAccounts: PostingAccount[] = [
  {
    id: 1,
    name: "Posting Account 1",
  },
  {
    id: 2,
    name: "Posting Account 2",
  },
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
  },
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
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
});

test("render - form initialized", async () => {
  await StoreService.getInstance().initAllStores();

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

test("select a PreDefMoneyflow - fill input fields", async () => {
  await StoreService.getInstance().initAllStores();

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("New Booking");
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

// Test 1: Reset button clears the form
test("reset button clears all form fields", async () => {
  await StoreService.getInstance().initAllStores();

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

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("New Booking");
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

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("New Booking");
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
    isFavorite: false,
  };

  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([onceAMonthUsed]);

  await StoreService.getInstance().initAllStores();

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("");

  await CreateMoneyflowView.SelectMoneyflow.open();
  await CreateMoneyflowView.SelectMoneyflow.assertOptionMissingByValue("99");
});

// Test 9: Successful submit -> form resets
test("successful submit resets the form", async () => {
  await StoreService.getInstance().initAllStores();

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

test("successful submit of onceAMonth PreDefMoneyflow removes it from list", async () => {
  const mpm: PreDefMoneyflow = {
    id: 10,
    userId: 1,
    amount: 10,
    capitalsourceId: 2,
    contractpartnerId: 1,
    contractpartnerName: "Contractpartner 1",
    comment: "onceAMonth test",
    createDate: new Date("2010-01-01"),
    onceAMonth: true,
    postingAccountId: 1,
  } as PreDefMoneyflow;

  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([mpm]);

  await StoreService.getInstance().initAllStores();

  render(CreateMoneyflow);

  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("New Booking");
  await CreateMoneyflowView.SelectMoneyflow.selectOption(
    "10",
    "Contractpartner 1 | 10.00 € | onceAMonth test",
  );

  await CreateMoneyflowView.SaveButton.click();

  await assertHaveBeenCalledOnce(MoneyflowService.createMoneyflow);

  // Form should be reset (back to "New Booking")
  await CreateMoneyflowView.SelectMoneyflow.waitForSelectedText("New Booking");

  // The PreDefMoneyflow should be removed from the selection list
  await CreateMoneyflowView.SelectMoneyflow.open();
  await CreateMoneyflowView.SelectMoneyflow.assertOptionMissingByValue("10");
});
