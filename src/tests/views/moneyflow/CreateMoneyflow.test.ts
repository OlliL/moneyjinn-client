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
import { nextTick } from "vue";

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

  const capitalsource: Capitalsource = {
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

  const initPostingAccountStoreSpy = vi
    .spyOn(PostingAccountService, "fetchAllPostingAccount")
    .mockReturnValue(Promise.resolve([postingAccount]));
  const initContractpartnerStoreSpy = vi
    .spyOn(ContractpartnerService, "fetchAllContractpartner")
    .mockReturnValue(Promise.resolve([contractpartner]));
  const initCapitalsourceStoreSpy = vi
    .spyOn(CapitalsourceService, "fetchAllCapitalsource")
    .mockReturnValue(Promise.resolve([capitalsource]));

  await StoreService.getInstance().initAllStores();

  expect(initPostingAccountStoreSpy).toHaveBeenCalledOnce();
  expect(initContractpartnerStoreSpy).toHaveBeenCalledOnce();
  expect(initCapitalsourceStoreSpy).toHaveBeenCalledOnce();

  const preDefMoneyflow: PreDefMoneyflow = {
    id: 1,
    userId: 1,
    amount: 20.4,
    capitalsourceId: 1,
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

  const optionPreDef1: HTMLOptionElement = await screen.findByText(
    "Contractpartner 1 | 20.40 € | PreDefMoneyflow Comment 1",
  );
  optionPreDef1.click();

  fireEvent.change(optionPreDef1.parentElement as HTMLSelectElement, {
    target: { value: 1 },
  });

  await waitFor(() => {
    expect(optionPreDef1.selected).toBeTruthy();
  });

  const amountInput: HTMLInputElement = screen.getByTestId("amount");
  expect(amountInput.value === "20.4").toBeTruthy();
});
