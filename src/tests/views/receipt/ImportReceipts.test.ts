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
  RadioView,
  RowView,
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

  static readonly MoneyflowRadio1 = new RadioView("moneyflow-radio-1");
  static readonly MoneyflowRadio2 = new RadioView("moneyflow-radio-2");
  static readonly MoneyflowRadio42 = new RadioView("moneyflow-radio-42");
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

  // Polyfill for JSDOM missing File.prototype.arrayBuffer
  if (!File.prototype.arrayBuffer) {
    File.prototype.arrayBuffer = function (this: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(this);
      });
    };
  }

  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [...mockReceipts],
  );
  ImportedMoneyflowReceiptServiceMocker.mockCreateImportedMoneyflowReceiptsResolved();
  MoneyflowServiceMocker.mockFetchMoneyflowById((id) => ({ id }));
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
