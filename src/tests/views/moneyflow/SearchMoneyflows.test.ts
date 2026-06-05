import useDeleteMoneyflowModalStore from "@/components/moneyflow/DeleteMoneyflowModal.store";
import useEditMoneyflowModalStore from "@/components/moneyflow/EditMoneyflowModal.store";
import useListMoneyflowModalStore from "@/components/moneyflow/ListMoneyflowModal.store";
import useReceiptModalStore from "@/components/reports/ReceiptModal.store";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import MoneyflowService from "@/service/MoneyflowService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, InputView, RowView } from "@/tests/TestViews";
import SearchMoneyflows from "@/views/moneyflow/SearchMoneyflows.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { defineComponent } from "vue";

vi.mock("@/service/MoneyflowService");

class SearchMoneyflowsView {
  static readonly CommentInput = new InputView("comment");
  static readonly SubmitButton = new ButtonView("search-moneyflows-submit");
  static readonly GroupExpandButton = new ButtonView(
    "search-moneyflow-group-expand",
  );
  static readonly DeleteButton = new ButtonView("display-moneyflow-delete-12");
  static readonly EditButton = new ButtonView("display-moneyflow-edit-12");
  static readonly ListButton = new ButtonView("display-moneyflow-list-13");
  static readonly ReceiptButton = new ButtonView(
    "display-moneyflow-receipt-14",
  );
  static readonly EmptyRow = new RowView("search-moneyflows-empty");
}

const createMoneyflow = (
  id: number,
  userId = 1,
  hasReceipt = false,
): Moneyflow => {
  return {
    id,
    userId,
    bookingDate: new Date("2026-02-05"),
    invoiceDate: new Date("2026-02-05"),
    amount: -42,
    contractpartnerId: 3,
    contractpartnerName: "Landlord",
    capitalsourceId: 4,
    capitalsourceComment: "Main account",
    postingAccountId: 5,
    postingAccountName: "Rent",
    comment: "Rent payment",
    private: false,
    hasReceipt,
  } as Moneyflow;
};

const runSearch = async () => {
  await SearchMoneyflowsView.CommentInput.setValue("rent");
  await SearchMoneyflowsView.SubmitButton.click();
};

const renderView = (props: Record<string, unknown> = {}) => {
  return render(
    defineComponent({
      setup() {
        return { props };
      },
      template: '<SearchMoneyflows v-bind="props" />',
      components: { SearchMoneyflows },
    }),
    {
      global: {
        stubs: {
          "router-link": {
            template: "<a><slot /></a>",
          },
        },
      },
    },
  );
};

const expandFirstGroup = async () => {
  await SearchMoneyflowsView.GroupExpandButton.click();
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.restoreAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  MoneyflowServiceMocker.mockSearchMoneyflowsResolved([
    createMoneyflow(12, 1, false),
    createMoneyflow(13, 2, false),
    createMoneyflow(14, 2, true),
  ] as Array<Moneyflow>);
  MoneyflowServiceMocker.mockFetchMoneyflowById(createMoneyflow);
});

test("SearchMoneyflows calls searchMoneyflows with form criteria", async () => {
  renderView();

  await runSearch();

  await assertHaveBeenCalledWith(
    MoneyflowService.searchMoneyflows,
    expect.objectContaining({
      searchString: "rent",
      contractpartnerId: undefined,
      postingAccountId: undefined,
      featureEqual: false,
      featureRegexp: false,
      featureCaseSensitive: false,
      featureOnlyMinusAmounts: false,
      startDate: expect.any(Date),
      endDate: expect.any(Date),
    }),
  );
});

test("SearchMoneyflows opens delete modal from own row action", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.DeleteButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 12);
  expect(useDeleteMoneyflowModalStore().open).toBe(true);
  expect(useDeleteMoneyflowModalStore().moneyflow?.id).toBe(12);
});

test("SearchMoneyflows opens edit modal from own row action", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.EditButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 12);
  expect(useEditMoneyflowModalStore().open).toBe(true);
  expect(useEditMoneyflowModalStore().moneyflow?.id).toBe(12);
});

test("SearchMoneyflows opens list modal from foreign row action", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.ListButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 13);
  expect(useListMoneyflowModalStore().open).toBe(true);
  expect(useListMoneyflowModalStore().moneyflow?.id).toBe(13);
});

test("SearchMoneyflows opens receipt modal from receipt icon", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.ReceiptButton.click();

  expect(useReceiptModalStore().open).toBe(true);
  expect(useReceiptModalStore().moneyflowId).toBe(14);
});

test("SearchMoneyflows shows empty state for empty search", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsResolved([]);
  renderView();
  await runSearch();
  await SearchMoneyflowsView.EmptyRow.assertToBeVisible();
});
