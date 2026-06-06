import { useEditMonthlySettlementModalStore } from "@/components/monthlysettlement/EditMonthlySettlementModal.store";
import EditMonthlySettlementModal from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import MonthlySettlementServiceMocker from "@/service/mocker/MonthlySettlementServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import {
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  InputView,
  ModalView,
  renderDeclarativeModal,
  ToastView,
} from "@/tests/TestViews";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock("@/service/MonthlySettlementService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/service/PreDefMoneyflowService");
vi.mock("@/service/CrudEtfService");

class EditMonthlySettlementModalView {
  static readonly Modal = new ModalView("app-modal-EditMonthlySettlement");
  static readonly MonthInput = new InputView("selectedMonth");
  static readonly SaveButton = new ButtonView(
    "editMonthlySettlementSaveButton",
  );

  static readonly MonthError = new AlertView("selectedMonth-error");
  static amountNoCreditInput(index: number): InputView {
    return new InputView(`amountNoCredit${index}`);
  }
  static amountNoCreditError(index: number): AlertView {
    return new AlertView(`amountNoCredit${index}-error-item`);
  }
  static readonly Toast = new ToastView();
}

const defaultTransporter: MonthlySettlementEditTransporter = {
  year: 2024,
  month: 5,
  editMode: false,
  monthlySettlements: [
    {
      id: 1,
      capitalsourceId: 10,
      capitalsourceComment: "Bank",
      amount: 1000,
      capitalsourceType: CapitalsourceType.CURRENT_ASSET,
      userId: 1,
      year: 2024,
      month: 5,
    },
  ],
  importedMonthlySettlements: [],
};

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  CrudEtfServiceMocker.mockFetchAllEtf([]);

  MonthlySettlementServiceMocker.mockGetMonthlySettlementForEditResolved(
    defaultTransporter,
  );
  MonthlySettlementServiceMocker.mockUpsertMonthlySettlementResolved();

  await StoreService.getInstance().initAllStores();
});

test("initializes and loads data correctly", async () => {
  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  await EditMonthlySettlementModalView.Modal.assertOpen();
  await EditMonthlySettlementModalView.MonthInput.assertValue("05.2024");
  await EditMonthlySettlementModalView.amountNoCreditInput(0).assertValue(
    "1000",
  );
});

test("successful save calls service and closes modal", async () => {
  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  await EditMonthlySettlementModalView.amountNoCreditInput(0).setValue("1100");
  await EditMonthlySettlementModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    MonthlySettlementService.upsertMonthlySettlement,
    [
      expect.objectContaining({
        capitalsourceId: 10,
        amount: 1100,
      }),
    ],
  );
  await EditMonthlySettlementModalView.Modal.assertClosed();
});

test("validation: month is required", async () => {
  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  await EditMonthlySettlementModalView.MonthInput.setValue("");
  await EditMonthlySettlementModalView.SaveButton.click();

  await EditMonthlySettlementModalView.MonthError.assertMessageContains(
    "Please specify a month!",
  );
  await EditMonthlySettlementModalView.Modal.assertOpen();
  await assertNotHaveBeenCalled(
    MonthlySettlementService.upsertMonthlySettlement,
  );
});

test("validation: amount is required", async () => {
  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  await EditMonthlySettlementModalView.amountNoCreditInput(0).setValue("");
  await EditMonthlySettlementModalView.SaveButton.click();

  await EditMonthlySettlementModalView.amountNoCreditError(
    0,
  ).assertMessageContains("Please specify an amount!");
  await EditMonthlySettlementModalView.Modal.assertOpen();
  await assertNotHaveBeenCalled(
    MonthlySettlementService.upsertMonthlySettlement,
  );
});

test("shows server errors on failure", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Backend Error Message",
  );
  MonthlySettlementServiceMocker.mockUpsertMonthlySettlementRejected(
    backendError,
  );

  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  await EditMonthlySettlementModalView.SaveButton.click();

  await EditMonthlySettlementModalView.Toast.assertError(
    "Backend Error Message",
  );
  await EditMonthlySettlementModalView.Modal.assertOpen();
});

test("changing month reloads data", async () => {
  renderDeclarativeModal(EditMonthlySettlementModal);
  useEditMonthlySettlementModalStore().openEditMonthlySettlement(2024, 5);

  // Verify initial load
  await EditMonthlySettlementModalView.MonthInput.assertValue("05.2024");

  const newTransporter: MonthlySettlementEditTransporter = {
    ...defaultTransporter,
    year: 2024,
    month: 6,
    monthlySettlements: [
      {
        ...defaultTransporter.monthlySettlements[0],
        amount: 2000,
      },
    ],
  };
  MonthlySettlementServiceMocker.mockGetMonthlySettlementForEditResolved(
    newTransporter,
  );

  await EditMonthlySettlementModalView.MonthInput.setValue("06.2024");
  await EditMonthlySettlementModalView.MonthInput.pressEnter();

  await EditMonthlySettlementModalView.amountNoCreditInput(0).assertValue(
    "2000",
  );
});
