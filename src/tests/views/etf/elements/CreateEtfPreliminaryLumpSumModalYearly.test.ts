import CrudEtfPreliminarySumService from "@/service/CrudEtfPreliminaryLumpSumService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfPreliminaryLumpSumServiceMocker from "@/service/mocker/CrudEtfPreliminaryLumpSumServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  ComboboxView,
  InputView,
  ModalView,
  renderDeclarativeModal,
} from "@/tests/TestViews";
import { useCreateEtfPreliminaryLumpSumModalYearlyStore } from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalYearly.store";
import CreateEtfPreliminaryLumpSumModalYearly from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalYearly.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");

class YearlyLumpSumView {
  static readonly Modal = new ModalView(
    "app-modal-CreateEtfPreliminaryLumpSumYearly",
  );
  static readonly EtfSelect = new ComboboxView("etf");
  static readonly YearInput = new InputView("bookingdate");
  static readonly AmountYearlyInput = new InputView("amountPerYear");
  static readonly SaveButton = new ButtonView(
    "createEtfPreliminaryLumpSumYearlySaveButton",
  );

  static readonly EtfError = new AlertView("etf-error");
  static readonly YearError = new AlertView("bookingdate-error");
  static readonly YearSumError = new AlertView("amountPerYear-error-item");
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as any);
  CrudEtfServiceMocker.mockFetchAllEtf([
    {
      id: 1,
      name: "ETF 1",
      isFavorite: true,
      partialTaxExemption: 30,
    } as never,
  ]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  PreDefMoneyflowServiceMocker.mockFetchAllPreDefMoneyflow([]);
  await StoreService.getInstance().initAllStores();
});

test("creates yearly lump sum", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockCreateEtfPreliminaryLumpSumResolved(
    { id: 1 } as any,
  );
  renderDeclarativeModal(CreateEtfPreliminaryLumpSumModalYearly);
  useCreateEtfPreliminaryLumpSumModalYearlyStore().openCreateEtfPreliminaryLumpSumYearly(
    1,
  );

  await YearlyLumpSumView.AmountYearlyInput.setValue("1200.50");
  await YearlyLumpSumView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
    expect.objectContaining({
      amountDecember: 1200.5,
    }),
  );
});

test("validation: mandatory fields are required", async () => {
  renderDeclarativeModal(CreateEtfPreliminaryLumpSumModalYearly);
  useCreateEtfPreliminaryLumpSumModalYearlyStore().openCreateEtfPreliminaryLumpSumYearly(
    1,
  );

  await YearlyLumpSumView.Modal.assertOpen();

  await YearlyLumpSumView.EtfSelect.clear();
  await YearlyLumpSumView.YearInput.setValue("");

  await YearlyLumpSumView.SaveButton.click();

  await YearlyLumpSumView.Modal.assertOpen();
  await YearlyLumpSumView.EtfError.assertMessageContains(
    "Please select an ETF!",
  );
  await YearlyLumpSumView.YearError.assertMessageContains(
    "Please specify a year!",
  );
  await YearlyLumpSumView.YearSumError.assertMessageContains(
    "Please specify an amount!",
  );
  await assertNotHaveBeenCalled(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
  );
});
