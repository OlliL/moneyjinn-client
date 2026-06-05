import ContractpartnerAccountServiceMocker from "@/service/mocker/ContractpartnerAccountServiceMocker";
import { ModalView, renderDeclarativeModal, RowView } from "@/tests/TestViews";
import { useListContractpartnerAccountsModalStore } from "@/views/contractpartner/elements/ListContractpartnerAccountsModal.store";
import ListContractpartnerAccountsModal from "@/views/contractpartner/elements/ListContractpartnerAccountsModal.vue";
import "@testing-library/jest-dom";
import { createPinia, setActivePinia } from "pinia";
import { test, vi } from "vitest";

class ListContractpartnerAccountsView {
  static readonly Modal = new ModalView(
    "app-modal-ListContractpartnerAccounts",
  );
  static readonly EmptyRow = new RowView("contractpartner-account-empty");
}

vi.mock("@/service/ContractpartnerAccountService");

test("shows empty state for empty list", async () => {
  setActivePinia(createPinia());
  ContractpartnerAccountServiceMocker.mockFetchAllContractpartnerAccount([]);
  const mcp = { id: 1, name: "Testpartner" };

  const listContractpartnerAccountsModalStore =
    useListContractpartnerAccountsModalStore();
  listContractpartnerAccountsModalStore.openListContractpartnerAccounts(
    mcp as never,
  );

  renderDeclarativeModal(ListContractpartnerAccountsModal, {});
  await ListContractpartnerAccountsView.Modal.assertOpen();

  await ListContractpartnerAccountsView.EmptyRow.assertToBeVisible();
});
