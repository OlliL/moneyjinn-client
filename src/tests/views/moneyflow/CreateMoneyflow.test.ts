import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { beforeAll, expect, test, vi } from "vitest";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import CreateMoneyflow from "@/views/moneyflow/CreateMoneyflow.vue";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import PostingAccountService from "@/service/PostingAccountService";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";
import ContractpartnerService from "@/service/ContractpartnerService";
import CapitalsourceService from "@/service/CapitalsourceService";
import { StoreService } from "@/stores/StoreService";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";
import { createPinia, setActivePinia } from "pinia";
import "@testing-library/jest-dom/vitest";

vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/StoreService");

beforeAll(async () => {
  setActivePinia(createPinia());
  const postingAccount1: PostingAccount = {
    id: 1,
    name: "Posting Account 1",
  } as PostingAccount;
  const postingAccount2: PostingAccount = {
    id: 2,
    name: "Posting Account 2",
  } as PostingAccount;

  const contractpartner: Contractpartner = {
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
  } as Contractpartner;

  const capitalsource1: Capitalsource = {
    id: 1,
    userId: 1,
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.CACHE,
    comment: "cash",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  } as Capitalsource;
  const capitalsource2: Capitalsource = {
    id: 2,
    userId: 1,
    type: CapitalsourceType.CURRENT_ASSET,
    state: CapitalsourceState.NON_CACHE,
    comment: "non-cash",
    validTil: new Date("2999-12-01"),
    validFrom: new Date("2000-01-01"),
    groupUse: false,
    importAllowed: CapitalsourceImport.NOT_ALLOWED,
  } as Capitalsource;
  const preDefMoneyflow: PreDefMoneyflow = {
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
  } as PreDefMoneyflow;

  PostingAccountService.fetchAllPostingAccount = vi
    .fn()
    .mockResolvedValue(Promise.resolve([postingAccount1, postingAccount2]));
  ContractpartnerService.fetchAllContractpartner = vi
    .fn()
    .mockResolvedValue(Promise.resolve([contractpartner]));
  CapitalsourceService.fetchAllCapitalsource = vi
    .fn()
    .mockResolvedValue(Promise.resolve([capitalsource1, capitalsource2]));
  PreDefMoneyflowService.fetchAllPreDefMoneyflow = vi
    .fn()
    .mockResolvedValue(Promise.resolve([preDefMoneyflow]));
});

test("split entries handling", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  const selectPostingAccount: HTMLSelectElement = screen.getByTestId(
    "postingAccountCreateMoneyflow",
  );
  const inputComment: HTMLInputElement = screen.getByTestId("comment");
  const inputAmount: HTMLInputElement = screen.getByTestId("amount");

  await waitForOptionSelected(selectPostingAccount, "0");

  await Promise.all([
    setInputValueAndWait(inputAmount, "-100.15", "Amount expected to be set"),
    setInputValueAndWait(
      inputComment,
      "Testcomment",
      "Comment expected to be set",
    ),
    selectOptionAndWait(selectPostingAccount, "2"),
  ]);

  const subbookingDiv: HTMLDivElement = screen.getByTestId(
    "collapseSplitEntries",
  );
  const subbookingLink = screen.getByText("subbooking");
  waitFor(() => expect(subbookingDiv).toHaveClass("collapse"));
  subbookingLink.click();
  waitFor(() => expect(subbookingDiv).toHaveClass("show"));

  const splitEntryRows: HTMLDivElement[] =
    await screen.findAllByTestId("splitEntryRow");

  expect(splitEntryRows).toHaveLength(2);

  const splitEntryRowAddButton = screen.getByTestId(
    "splitEntryRowAddButton#-2",
  );
  splitEntryRowAddButton.click();

  await waitFor(() =>
    expect(screen.getAllByTestId("splitEntryRow")).toHaveLength(3),
  );

  const inputRemainder: HTMLInputElement = screen.getByLabelText("remainder");
  const buttonRemainder: HTMLSpanElement =
    screen.getByTestId("remainderButton");

  await waitForInputHasValue(inputRemainder, "-100.15");

  const inputAmountMse1: HTMLInputElement = screen.getByTestId(
    "amountSplitEntry#-1",
  );
  await setInputValueAndWait(
    inputAmountMse1,
    "-50",
    "Amount expected to be set",
  );

  expect(inputComment).not.toBeVisible();
  expect(selectPostingAccount).not.toBeVisible();
  expect(inputAmount).toBeVisible();

  await waitForInputHasValue(inputRemainder, "-50.15");
  buttonRemainder.click();
  await assertInputValueToBe("amountSplitEntry#-3", "-50.15");
  expect(inputRemainder).not.toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getAllByTestId("splitEntryRow")).toHaveLength(4),
  );
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

  const selectMoneyflow: HTMLSelectElement =
    screen.getByTestId("selectmoneyflow");

  await waitForOptionSelected(selectMoneyflow, "0");

  await Promise.all([
    // 1st row
    assertInputValueToBe("bookingDate", formatted),
    assertInputValueToBe("invoiceDate", ""),
    assertInputValueToBe("contractpartnerCreateMoneyflow", "0"),
    assertInputValueToBe(
      "capitalsourceCreateMoneyflow",
      "1",
      "First capitalsource has to be selected by default!",
    ),
    // 2nd row
    assertInputValueToBe("amount", ""),
    assertInputValueToBe("comment", ""),
    assertInputValueToBe("postingAccountCreateMoneyflow", "0"),
    assertCheckboxChecked("public"),
    assertCheckboxUnchecked("private"),
    assertCheckboxChecked("once"),
    assertCheckboxUnchecked("favorite"),
  ]);
});

test("select a PreDefMoneyflow - fill input fields", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);
  const selectMoneyflow: HTMLSelectElement =
    screen.getByTestId("selectmoneyflow");

  await waitForOptionSelected(selectMoneyflow, "0");

  await selectOptionAndWait(selectMoneyflow, "1");

  await Promise.all([
    assertCheckboxChecked("keep"),
    assertCheckboxUnchecked("renew"),
    assertInputValueToBe("amount", "20.4"),
    assertInputValueToBe("comment", "PreDefMoneyflow Comment 1"),
    assertInputValueToBe("contractpartnerCreateMoneyflow", "1"),
    assertInputValueToBe("capitalsourceCreateMoneyflow", "2"),
    assertInputValueToBe("postingAccountCreateMoneyflow", "1"),
  ]);
}, 10000);

test("select a Contractpartner - set and reset input fields", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  const selectContractpartner: HTMLSelectElement = screen.getByTestId(
    "contractpartnerCreateMoneyflow",
  );

  await waitForOptionSelected(selectContractpartner, "0");
  await selectOptionAndWait(selectContractpartner, "1");

  await Promise.all([
    assertInputValueToBe(
      "comment",
      "Contractpartner Comment 1",
      "Choosing Contractpartner must set its preset comment",
    ),
    assertInputValueToBe(
      "postingAccountCreateMoneyflow",
      "1",
      "Choosing Contractpartner must set its preset PostingAccount",
    ),
  ]);

  await selectOptionAndWait(selectContractpartner, "0");

  await Promise.all([
    assertInputValueToBe(
      "comment",
      "",
      "Resetting Contractpartner must reset comment too if it wasn't modified in the meantime",
    ),
    assertInputValueToBe(
      "postingAccountCreateMoneyflow",
      "0",
      "Resetting Contractpartner must reset PostingAccount too if it wasn't modified in the meantime",
    ),
    assertInputValueToBe("contractpartnerCreateMoneyflow", "0"),
  ]);
});

test("select a Contractpartner - previously set input fields not overwritten", async () => {
  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  render(CreateMoneyflow);

  const selectContractpartner: HTMLSelectElement = screen.getByTestId(
    "contractpartnerCreateMoneyflow",
  );
  const selectPostingAccount: HTMLSelectElement = screen.getByTestId(
    "postingAccountCreateMoneyflow",
  );

  const inputComment: HTMLInputElement = screen.getByTestId("comment");

  await waitForOptionSelected(selectContractpartner, "0");

  await Promise.all([
    setInputValueAndWait(
      inputComment,
      "Testcomment",
      "Comment expected to be set",
    ),
    selectOptionAndWait(selectPostingAccount, "2"),
  ]);

  await selectOptionAndWait(selectContractpartner, "1");

  await Promise.all([
    assertInputValueToBe(
      "comment",
      "Testcomment",
      "Previously set comment gets not overwritten by Contractpartner preset",
    ),
    assertInputValueToBe(
      "postingAccountCreateMoneyflow",
      "2",
      "Previously set PostingAccount gets not overwritten by Contractpartner preset",
    ),
  ]);
});

const assertInputValueToBe = async (
  testId: string,
  value: string,
  message?: string,
): Promise<void> => {
  const field: HTMLInputElement = screen.getByTestId(testId);
  const errorMessage = message ?? "Checking field " + testId;
  waitForInputHasValue(field, value, errorMessage);
};

const assertCheckboxChecked = async (
  label: string,
  message?: string,
): Promise<void> => {
  const errorMessage =
    message ?? "Checking checkbox for being checked: " + label;
  return screen.findByLabelText<HTMLInputElement>(label).then((field) => {
    expect(field.checked, errorMessage).toBeTruthy();
  });
};

const assertCheckboxUnchecked = async (label: string, message?: string) => {
  const errorMessage =
    message ?? "Checking checkbox for being unchecked: " + label;
  return screen.findByLabelText<HTMLInputElement>(label).then((field) => {
    expect(field.checked, errorMessage).toBeFalsy();
  });
};

const waitForOptionSelected = async (
  item: HTMLSelectElement,
  value: string,
  message?: string,
) => {
  await waitFor(() => {
    expect(item.selectedOptions.item(0)?.value, message).toBe(value);
  });
};

const waitForInputHasValue = async (
  item: HTMLInputElement,
  value: string,
  message?: string,
) => {
  await waitFor(() => {
    expect(item.value, message).toBe(value);
  });
};

const selectOptionAndWait = async (
  item: HTMLSelectElement,
  value: string,
  message?: string,
) => {
  fireEvent.update(item, value);
  await waitForOptionSelected(item, value, message);
};

const setInputValueAndWait = async (
  item: HTMLInputElement,
  value: string,
  message?: string,
) => {
  fireEvent.update(item, value);
  await waitForInputHasValue(item, value, message);
};
