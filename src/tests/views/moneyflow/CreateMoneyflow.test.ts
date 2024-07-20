import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { expect, test, vi } from "vitest";
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

test("component renders", async () => {
  const preDefMoneyflows: PreDefMoneyflow[] = [];

  const fetchAllPreDefMoneyflowSpy = vi
    .spyOn(PreDefMoneyflowService, "fetchAllPreDefMoneyflow")
    .mockReturnValue(Promise.resolve(preDefMoneyflows));

  render(CreateMoneyflow);

  expect(fetchAllPreDefMoneyflowSpy).toHaveBeenCalledOnce();

  expect(screen.queryByText("create moneyflow")).toBeTruthy();

  const subbookingLink = screen.getByText("subbooking");

  expect(screen.queryAllByTestId("splitEntryRowDeleteButton")).toHaveLength(0);
  subbookingLink.click();
  expect(
    await screen.findAllByTestId("splitEntryRowDeleteButton"),
  ).toHaveLength(2);

  const splitEntryRowAddButton = screen.getByTestId("splitEntryRowAddButton");
  splitEntryRowAddButton.click();

  await waitFor(() =>
    expect(screen.getAllByTestId("splitEntryRowDeleteButton")).toHaveLength(3),
  );
});

test("PreDefMoneyflow Handling", async () => {
  const postingAccount: PostingAccount = {
    id: 1,
    name: "Posting Account 1",
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

  const initPostingAccountStoreSpy = vi
    .spyOn(PostingAccountService, "fetchAllPostingAccount")
    .mockReturnValue(Promise.resolve([postingAccount]));
  const initContractpartnerStoreSpy = vi
    .spyOn(ContractpartnerService, "fetchAllContractpartner")
    .mockReturnValue(Promise.resolve([contractpartner]));
  const initCapitalsourceStoreSpy = vi
    .spyOn(CapitalsourceService, "fetchAllCapitalsource")
    .mockReturnValue(Promise.resolve([capitalsource1, capitalsource2]));

  await StoreService.getInstance().initAllStores();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  expect(initPostingAccountStoreSpy).toHaveBeenCalledOnce();
  expect(initContractpartnerStoreSpy).toHaveBeenCalledOnce();
  expect(initCapitalsourceStoreSpy).toHaveBeenCalledOnce();

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

  const fetchAllPreDefMoneyflowSpy = vi
    .spyOn(PreDefMoneyflowService, "fetchAllPreDefMoneyflow")
    .mockReturnValue(Promise.resolve([preDefMoneyflow]));

  render(CreateMoneyflow);

  expect(fetchAllPreDefMoneyflowSpy).toHaveBeenCalledOnce();

  assertCheckboxChecked("once");
  assertCheckboxUnchecked("favorite");

  await assertInputValueToBe("amount", "");
  await assertInputValueToBe("comment", "");
  await assertInputValueToBe("contractpartnerCreateMoneyflow", "0");
  await assertInputValueToBe(
    "capitalsourceCreateMoneyflow",
    "1",
    "First capitalsource has to be selected by default!",
  );
  await assertInputValueToBe("postingAccountCreateMoneyflow", "0");

  const optionPreDef1: HTMLOptionElement = await screen.findByText(
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );
  optionPreDef1.click();

  fireEvent.update(optionPreDef1.parentElement as HTMLSelectElement, "1");

  await waitFor(() => {
    expect(optionPreDef1.selected).toBeTruthy();
  });

  assertCheckboxChecked("keep");
  assertCheckboxUnchecked("renew");

  await assertInputValueToBe("amount", "20.4");
  await assertInputValueToBe("comment", "PreDefMoneyflow Comment 1");
  await assertInputValueToBe("contractpartnerCreateMoneyflow", "1");
  await assertInputValueToBe("capitalsourceCreateMoneyflow", "2");
  await assertInputValueToBe("postingAccountCreateMoneyflow", "1");
}, 10000);

const assertInputValueToBe = async (
  testId: string,
  value: string,
  message?: string,
) => {
  const field: HTMLInputElement = screen.getByTestId(testId);
  const errorMessage = message ?? "Checking field " + testId;
  await waitFor(() => expect(field.value, errorMessage).toBe(value));
};

const assertCheckboxChecked = async (label: string) => {
  const field: HTMLInputElement = await screen.findByLabelText(label);
  expect(field.checked).toBeTruthy();
};

const assertCheckboxUnchecked = async (label: string) => {
  const field: HTMLInputElement = await screen.findByLabelText(label);
  expect(field.checked).toBeFalsy();
};
