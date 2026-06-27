import { BackendError, BackendErrorType } from "@/model/BackendError";
import ImportedMoneyflowReceiptService from "@/service/ImportedMoneyflowReceiptService";
import ImportedMoneyflowReceiptServiceMocker from "@/service/mocker/ImportedMoneyflowReceiptServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import MoneyflowService from "@/service/MoneyflowService";
import {
  assertHaveBeenCalled,
  assertHaveBeenCalledWith,
  setupUserStandard,
} from "@/tests/TestUtil";
import {
  ButtonView,
  FileUploadView,
  InputView,
  RadioView,
  RowView,
  TextView,
  ToastView,
} from "@/tests/TestViews";
import ImportReceipts from "@/views/receipt/ImportReceipts.vue";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

class ImportReceiptsView {
  static readonly UploadForm = new RowView("importReceipts-upload-form");
  static readonly FileInput = new FileUploadView("importReceipts-file-input");
  static readonly UploadButton = new ButtonView("importReceipts-upload-button");
  static readonly Toast = new ToastView();

  static readonly Row1 = new RowView("importReceipts-row-1");
  static readonly Row2 = new RowView("importReceipts-row-2");
  static readonly Row3 = new RowView("importReceipts-row-3");
  static readonly Row4 = new RowView("importReceipts-row-4");

  static readonly Row1SearchButton = new ButtonView("searchReceipt1-submit");
  static readonly Row1AmountInput = new InputView(
    "importReceipts-row-amount-1",
  );
  static readonly Row1ApplyButton = new ButtonView(
    "importReceipts-row-apply-1",
  );
  static readonly Row1DeleteButton = new ButtonView(
    "importReceipts-row-delete-1",
  );

  static readonly MoneyflowRadio1 = new RadioView("moneyflow-radio-1");
  static readonly MoneyflowRadio2 = new RadioView("moneyflow-radio-2");
  static readonly MoneyflowRadio42 = new RadioView("moneyflow-radio-42");

  static readonly SearchResultEdit42 = new ButtonView(
    "import-receipt-search-result-edit-42",
  );
  static readonly SearchResultDelete42 = new ButtonView(
    "import-receipt-search-result-delete-42",
  );
  static readonly SearchResultList99 = new ButtonView(
    "import-receipt-search-result-list-99",
  );
  static readonly SearchResultEdit99 = new ButtonView(
    "import-receipt-search-result-edit-99",
  );
  static readonly SearchResultDelete99 = new ButtonView(
    "import-receipt-search-result-delete-99",
  );

  static readonly NoResultsMessage = new TextView(
    /No Matching Transactions Found!/,
  );
}

vi.mock("@/service/MoneyflowService");
vi.mock("@/service/ImportedMoneyflowReceiptService");

const mockReceipts = [
  {
    id: 1,
    filename: "test1.pdf",
    mediaType: "application/pdf",
    receipt: "base64data1",
  },
  {
    id: 2,
    filename: "test2.jpg",
    mediaType: "image/jpeg",
    receipt: "base64data2",
  },
];

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();

  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [...mockReceipts],
  );
  setupUserStandard();
});

test("renders imported receipts list", async () => {
  render(ImportReceipts);
  await ImportReceiptsView.Row1.assertToBeVisible();
  await ImportReceiptsView.Row2.assertToBeVisible();
});

test("renders empty state if no receipts", async () => {
  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [],
  );
  render(ImportReceipts);
  await ImportReceiptsView.Row1.assertNotToBeInDocument();
  await ImportReceiptsView.Row2.assertNotToBeInDocument();
});

test("calls uploadReceipts on form submit and uploads file", async () => {
  ImportedMoneyflowReceiptServiceMocker.mockCreateImportedMoneyflowReceiptsResolved();
  render(ImportReceipts);
  const file = new File(["test"], "test.pdf", { type: "application/pdf" });
  await ImportReceiptsView.FileInput.selectFile(file);

  await ImportReceiptsView.UploadButton.click();

  await assertHaveBeenCalled(
    ImportedMoneyflowReceiptService.createImportedMoneyflowReceipts,
  );
  await assertHaveBeenCalledWith(
    ImportedMoneyflowReceiptService.createImportedMoneyflowReceipts,
    [
      expect.objectContaining({
        filename: "test.pdf",
        id: 0,
        mediaType: "application/pdf",
      }),
    ],
  );
});

test("shows error message on backend error", async () => {
  const error = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend error",
  );
  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceiptsReject(
    error,
  );
  render(ImportReceipts);
  await ImportReceiptsView.Toast.assertError("Backend error");
});

test("shows search and auto-selects single matching moneyflow", async () => {
  // Arrange: Only one matching moneyflow is found
  const receipt = {
    id: 3,
    filename: "1234.pdf",
    mediaType: "application/pdf",
    receipt: "base64data3",
  };
  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [receipt],
  );
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    {
      id: 42,
      amount: 12.34,
      contractpartnerName: "Test Partner",
      comment: "Test Comment",
      userId: 1,
    },
  ]);

  render(ImportReceipts);

  await ImportReceiptsView.Row3.assertToBeVisible();

  // Verify that the search was auto-triggered by filename "1234.pdf" (12.34)
  await assertHaveBeenCalledWith(
    MoneyflowService.searchMoneyflowsByAmount,
    12.34,
    expect.any(Date),
    expect.any(Date),
  );

  await ImportReceiptsView.MoneyflowRadio42.assertChecked();
});

test("shows search and does not auto-select if multiple moneyflows", async () => {
  // Arrange: Multiple matching moneyflows are found
  const receipt = {
    id: 4,
    filename: "5678.pdf",
    mediaType: "application/pdf",
    receipt: "base64data4",
  };
  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [receipt],
  );
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 1, amount: 56.78, contractpartnerName: "A" },
    { id: 2, amount: 56.78, contractpartnerName: "B" },
  ]);

  render(ImportReceipts);

  await ImportReceiptsView.Row4.assertToBeVisible();

  await assertHaveBeenCalled(MoneyflowService.searchMoneyflowsByAmount);

  await ImportReceiptsView.MoneyflowRadio1.assertUnchecked();
  await ImportReceiptsView.MoneyflowRadio2.assertUnchecked();
});

test("manual search triggers moneyflow search", async () => {
  // Mock search result for a specific manual search
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 42, amount: 99.99, contractpartnerName: "Manual Search" },
  ]);

  render(ImportReceipts);

  await ImportReceiptsView.Row1.assertToBeVisible();
  await ImportReceiptsView.Row1AmountInput.setValue("99.99");
  await ImportReceiptsView.Row1SearchButton.click();

  await assertHaveBeenCalledWith(
    MoneyflowService.searchMoneyflowsByAmount,
    99.99,
    expect.any(Date),
    expect.any(Date),
  );
  await ImportReceiptsView.MoneyflowRadio42.assertToBeVisible();
});

test("shows message when search returns no results", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([]);

  render(ImportReceipts);

  await ImportReceiptsView.Row1.assertToBeVisible();
  await ImportReceiptsView.Row1AmountInput.setValue("0.00");
  await ImportReceiptsView.Row1SearchButton.click();

  await ImportReceiptsView.NoResultsMessage.assertInDocument();
});

test("assigns receipt to selected moneyflow (apply)", async () => {
  ImportedMoneyflowReceiptServiceMocker.mockImportImportedMoneyflowReceiptResolved();
  // receipt.id=1 matches Row1
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 42, amount: 10, contractpartnerName: "Partner" },
  ]);

  render(ImportReceipts);

  // Row 1 automatically searches if filename was numeric, but here we trigger manually to be sure
  await ImportReceiptsView.Row1AmountInput.setValue("10.00");
  await ImportReceiptsView.Row1SearchButton.click();

  await ImportReceiptsView.MoneyflowRadio42.assertToBeVisible();
  // Radio 42 is likely auto-selected since it's the only one
  await ImportReceiptsView.Row1ApplyButton.click();

  await assertHaveBeenCalledWith(
    ImportedMoneyflowReceiptService.importImportedMoneyflowReceipt,
    1, // receipt.id
    42, // moneyflow.id
  );
  // After success, the row should be removed from view
  await ImportReceiptsView.Row1.assertNotToBeInDocument();
});

test("deletes an imported receipt", async () => {
  ImportedMoneyflowReceiptServiceMocker.mockDeleteImportedMoneyflowReceiptByIdResolved();
  render(ImportReceipts);

  await ImportReceiptsView.Row1.assertToBeVisible();

  // ButtonDeleteTwoTap needs two clicks
  await ImportReceiptsView.Row1DeleteButton.click();
  await ImportReceiptsView.Row1DeleteButton.click();

  await assertHaveBeenCalledWith(
    ImportedMoneyflowReceiptService.deleteImportedMoneyflowReceiptById,
    1,
  );
  await ImportReceiptsView.Row1.assertNotToBeInDocument();
});

test("shows action buttons based on moneyflow ownership", async () => {
  // 1. Mock search results: one owned by current user (id=1), one foreign
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 42, amount: 10, userId: 1, contractpartnerName: "My MMF" }, // Own
    { id: 99, amount: 10, userId: 2, contractpartnerName: "Foreign MMF" }, // Foreign
  ]);

  render(ImportReceipts);

  await ImportReceiptsView.Row1AmountInput.setValue("10.00");
  await ImportReceiptsView.Row1SearchButton.click();

  // Own MMF: Edit and Delete should be visible
  await ImportReceiptsView.SearchResultEdit42.assertToBeVisible();
  await ImportReceiptsView.SearchResultDelete42.assertToBeVisible();

  // Foreign MMF: Only List/Eye should be visible (ID 99)
  await ImportReceiptsView.SearchResultList99.assertToBeVisible();

  // Verify that Edit/Delete are NOT there for foreign MMF
  await ImportReceiptsView.SearchResultEdit99.assertNotToBeInDocument();
  await ImportReceiptsView.SearchResultDelete99.assertNotToBeInDocument();
});

test("triggers edit moneyflow action", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 42, amount: 10, userId: 1, contractpartnerName: "My MMF" },
  ]);
  MoneyflowServiceMocker.mockFetchMoneyflowById((id) => ({ id }));

  render(ImportReceipts);

  await ImportReceiptsView.Row1AmountInput.setValue("10.00");
  await ImportReceiptsView.Row1SearchButton.click();

  await ImportReceiptsView.SearchResultEdit42.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 42);
});

test("triggers delete moneyflow action", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 42, amount: 10, userId: 1, contractpartnerName: "My MMF" },
  ]);
  MoneyflowServiceMocker.mockFetchMoneyflowById((id) => ({ id }));

  render(ImportReceipts);

  await ImportReceiptsView.Row1AmountInput.setValue("10.00");
  await ImportReceiptsView.Row1SearchButton.click();

  await ImportReceiptsView.SearchResultDelete42.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 42);
});

test("triggers list moneyflow action", async () => {
  MoneyflowServiceMocker.mockSearchMoneyflowsByAmountResolved([
    { id: 99, amount: 10, userId: 2, contractpartnerName: "Foreign MMF" },
  ]);
  MoneyflowServiceMocker.mockFetchMoneyflowById((id) => ({ id }));

  render(ImportReceipts);

  await ImportReceiptsView.Row1AmountInput.setValue("10.00");
  await ImportReceiptsView.Row1SearchButton.click();

  await ImportReceiptsView.SearchResultList99.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 99);
});
