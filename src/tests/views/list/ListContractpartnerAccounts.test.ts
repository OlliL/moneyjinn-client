import ContractpartnerAccountServiceMocker from "@/service/mocker/ContractpartnerAccountServiceMocker";
import { RowView } from "@/tests/TestViews";
import ListContractpartnerAccountsModal from "@/views/contractpartner/elements/ListContractpartnerAccountsModal.vue";
import "@testing-library/jest-dom";
import { render } from "@testing-library/vue";
import { test, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

class ListContractpartnerAccountsView {
  static readonly EmptyRow = new RowView("contractpartner-account-empty");
}

vi.mock("@/service/ContractpartnerAccountService");

test("shows empty state for empty list", async () => {
  // Arrange: Service mock for empty list
  ContractpartnerAccountServiceMocker.mockFetchAllContractpartnerAccount([]);
  const mcp = { id: 1, name: "Testpartner" };
  // Dummy component with modal ref
  let modalRef: any;
  const wrapper = defineComponent({
    setup() {
      modalRef = ref();
      return { modalRef };
    },
    render() {
      return h(ListContractpartnerAccountsModal, { ref: "modalRef" });
    },
  });
  render(wrapper);
  await nextTick();
  await modalRef.value._show(mcp);
  await nextTick();
  // Assert: Empty state visible
  await ListContractpartnerAccountsView.EmptyRow.assertToBeVisible();
});
