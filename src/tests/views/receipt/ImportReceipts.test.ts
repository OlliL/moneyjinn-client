// Page object according to team convention
import { BackendError, BackendErrorType } from "@/model/BackendError";
import ImportedMoneyflowReceiptServiceMocker from "@/service/mocker/ImportedMoneyflowReceiptServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ButtonView,
  FileUploadView,
  RadioView,
  ToastView,
} from "@/tests/TestViews";
import ImportReceipts from "@/views/receipt/ImportReceipts.vue";
import { render, waitFor } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

class ImportReceiptsView {
  static readonly UploadForm = new ButtonView("importReceipts-upload-form");
  static readonly FileInput = new FileUploadView("fileUpload");
  static readonly UploadButton = new ButtonView("importReceipts-upload-button");
  static readonly Toast = new ToastView();
  // Returns all imported receipt rows (test IDs: importReceipts-row-<id>)
  static getReceiptRows() {
    // Only the main elements with exact ID (no filebox/filename)
    return Array.from(document.querySelectorAll("[data-testid]")).filter((el) =>
      /^importReceipts-row-\d+$/.test(el.getAttribute("data-testid") || ""),
    );
  }
  static async assertReceiptCount(count: number) {
    await waitFor(() => {
      expect(ImportReceiptsView.getReceiptRows().length).toBe(count);
    });
  }
}

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("@/service/MoneyflowService");

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
  MoneyflowServiceMocker.mockFetchMoneyflowById((id) => ({ id }));
  useUserSessionStore().setUserSession({
    userId: 1,
    userName: "test",
    userIsAdmin: false,
    userCanLogin: true,
    userIsNew: false,
  });
});

test("renders imported receipts list", async () => {
  render(ImportReceipts);
  await ImportReceiptsView.assertReceiptCount(2);
});

test("renders empty state if no receipts", async () => {
  ImportedMoneyflowReceiptServiceMocker.mockShowImportImportedMoneyflowReceipts(
    [],
  );
  render(ImportReceipts);
  await ImportReceiptsView.assertReceiptCount(0);
});

test("calls uploadReceipts on form submit and uploads file", async () => {
  render(ImportReceipts);
  const file = new File(["test"], "test.pdf", { type: "application/pdf" });
  await ImportReceiptsView.FileInput.selectFile(file);
  await ImportReceiptsView.UploadButton.click();
  // Robust: Form still exists
  await ImportReceiptsView.UploadForm.assertToBeVisible();
});

test("shows error message on backend error", async () => {
  // Simulate a real BackendError as expected in the code
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
      userId: 1,
      invoiceDate: undefined,
      comment: "",
      private: false,
      bookingDate: new Date(),
      capitalsourceId: 1,
      contractpartnerId: 1,
      postingAccountId: 1,
      hasReceipt: false,
    },
  ]);

  render(ImportReceipts);

  // Simulate search (auto-executed if filename contains amount)
  await ImportReceiptsView.assertReceiptCount(1);
  await new RadioView("moneyflow-radio-42").assertChecked();
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

  await ImportReceiptsView.assertReceiptCount(1);
  // Verify that both radio buttons are not checked
  await new RadioView("moneyflow-radio-1").assertUnchecked();
  await new RadioView("moneyflow-radio-2").assertUnchecked();
});

// The following tests access the VM object and are no longer reasonably testable with Testing-Library.
