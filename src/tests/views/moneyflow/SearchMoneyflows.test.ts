import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import MoneyflowReceiptServiceMocker from "@/service/mocker/MoneyflowReceiptServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import MoneyflowService from "@/service/MoneyflowService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import {
  ButtonView,
  InputView,
  ModalView,
  RadioView,
  RowView,
} from "@/tests/TestViews";
import SearchMoneyflows from "@/views/moneyflow/SearchMoneyflows.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/MoneyflowService");
vi.mock("@/service/MoneyflowReceiptService");

class SearchMoneyflowsView {
  static readonly CommentInput = new InputView("comment");
  static readonly SubmitButton = new ButtonView("search-moneyflows-submit");
  static readonly GroupExpandButton = new ButtonView(
    "search-moneyflow-group-expand",
  );
  static readonly DeleteButton = new ButtonView("search-moneyflow-delete-12");
  static readonly EditButton = new ButtonView("search-moneyflow-edit-12");
  static readonly ListButton = new ButtonView("search-moneyflow-list-13");
  static readonly ReceiptButton = new ButtonView("search-moneyflow-receipt-14");
  static readonly Modal = new ModalView("app-modal");
  static readonly EmptyRow = new RowView("search-moneyflows-empty");
  // Example for radio buttons for moneyflow selection
  static readonly MoneyflowRadio12 = new RadioView("moneyflow-radio-12");
  static readonly MoneyflowRadio13 = new RadioView("moneyflow-radio-13");
  static readonly MoneyflowRadio14 = new RadioView("moneyflow-radio-14");
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

const renderView = () => {
  return render(SearchMoneyflows, {
    global: {
      stubs: {
        "router-link": {
          template: "<a><slot /></a>",
        },
      },
    },
  });
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
  await SearchMoneyflowsView.Modal.assertOpen();
});

test("SearchMoneyflows opens edit modal from own row action", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.EditButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 12);
  await SearchMoneyflowsView.Modal.assertOpen();
});

test("SearchMoneyflows opens list modal from foreign row action", async () => {
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.ListButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 13);
  await SearchMoneyflowsView.Modal.assertOpen();
});

test("SearchMoneyflows opens receipt modal from receipt icon", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 14,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
  renderView();

  await runSearch();
  await expandFirstGroup();
  await SearchMoneyflowsView.ReceiptButton.click();

  await assertHaveBeenCalledWith(MoneyflowReceiptService.fetchReceipt, 14);
  await SearchMoneyflowsView.Modal.assertOpen();
});

test("SearchMoneyflows shows empty state for empty search", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsResolved([]);
  renderView();
  await runSearch();
  await SearchMoneyflowsView.EmptyRow.assertToBeVisible();
});

test("Moneyflow selection: radio buttons correctly selected", async () => {
  renderView();
  await runSearch();
  await expandFirstGroup();

  // Assume Moneyflow 12 is selected, the others are not
  await SearchMoneyflowsView.MoneyflowRadio12.assertChecked();
  await SearchMoneyflowsView.MoneyflowRadio13.assertUnchecked();
  await SearchMoneyflowsView.MoneyflowRadio14.assertUnchecked();
});
