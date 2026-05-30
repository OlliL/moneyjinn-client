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
  renderModalWithRef,
} from "@/tests/TestViews";
import CreateEtfPreliminaryLumpSumModalMonthly from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalMonthly.vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");

class MonthlyLumpSumView {
  static readonly Modal = new ModalView("app-modal");
  static readonly JanInput = new InputView("amountJanuary");
  static readonly FebInput = new InputView("amountFebruary");
  static readonly MarInput = new InputView("amountMarch");
  static readonly AprInput = new InputView("amountApril");
  static readonly MayInput = new InputView("amountMay");
  static readonly JunInput = new InputView("amountJune");
  static readonly JulInput = new InputView("amountJuly");
  static readonly AugInput = new InputView("amountAugust");
  static readonly SepInput = new InputView("amountSeptember");
  static readonly OctInput = new InputView("amountOctober");
  static readonly NovInput = new InputView("amountNovember");
  static readonly DecInput = new InputView("amountDecember");
  static readonly EtfSelect = new ComboboxView("etf");
  static readonly YearInput = new InputView("bookingdate");
  static readonly SaveButton = new ButtonView(
    "createEtfPreliminaryLumpSumMonthlySaveButton",
  );

  static readonly EtfError = new AlertView("etf-error");
  static readonly YearError = new AlertView("bookingdate-error");
  static readonly JanError = new AlertView("amountJanuary-error-item");
  static readonly FebError = new AlertView("amountFebruary-error-item");
  static readonly MarError = new AlertView("amountMarch-error-item");
  static readonly AprError = new AlertView("amountApril-error-item");
  static readonly MayError = new AlertView("amountMay-error-item");
  static readonly JunError = new AlertView("amountJune-error-item");
  static readonly JulError = new AlertView("amountJuly-error-item");
  static readonly AugError = new AlertView("amountAugust-error-item");
  static readonly SepError = new AlertView("amountSeptember-error-item");
  static readonly OctError = new AlertView("amountOctober-error-item");
  static readonly NovError = new AlertView("amountNovember-error-item");
  static readonly DecError = new AlertView("amountDecember-error-item");
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

test("creates monthly lump sum", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockCreateEtfPreliminaryLumpSumResolved(
    { id: 1 } as any,
  );
  const modalRef = renderModalWithRef<any>(
    CreateEtfPreliminaryLumpSumModalMonthly,
  );
  await modalRef.value._show(1);

  await MonthlyLumpSumView.JanInput.setValue("50.25");
  await MonthlyLumpSumView.FebInput.setValue("0");
  await MonthlyLumpSumView.MarInput.setValue("0");
  await MonthlyLumpSumView.AprInput.setValue("0");
  await MonthlyLumpSumView.MayInput.setValue("0");
  await MonthlyLumpSumView.JunInput.setValue("0");
  await MonthlyLumpSumView.JulInput.setValue("0");
  await MonthlyLumpSumView.AugInput.setValue("0");
  await MonthlyLumpSumView.SepInput.setValue("0");
  await MonthlyLumpSumView.OctInput.setValue("0");
  await MonthlyLumpSumView.NovInput.setValue("0");
  await MonthlyLumpSumView.DecInput.setValue("0");

  await MonthlyLumpSumView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
    expect.objectContaining({
      etfId: 1,
      amountJanuary: 50.25,
      amountFebruary: 0,
      amountMarch: 0,
      amountApril: 0,
      amountMay: 0,
      amountJune: 0,
      amountJuly: 0,
      amountAugust: 0,
      amountSeptember: 0,
      amountOctober: 0,
      amountNovember: 0,
      amountDecember: 0,
    }),
  );
});

test("validation: all mandatory fields are required", async () => {
  const modalRef = renderModalWithRef<any>(
    CreateEtfPreliminaryLumpSumModalMonthly,
  );
  await modalRef.value._show(1);

  await MonthlyLumpSumView.EtfSelect.clear();
  await MonthlyLumpSumView.YearInput.setValue("");

  await MonthlyLumpSumView.SaveButton.click();

  await MonthlyLumpSumView.Modal.assertOpen();

  await MonthlyLumpSumView.EtfError.assertMessageContains(
    "Please select an ETF!",
  );
  await MonthlyLumpSumView.YearError.assertMessageContains(
    "Please specify a year!",
  );
  await MonthlyLumpSumView.JanError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.FebError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.MarError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.AprError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.MayError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.JunError.assertMessageContains(
    "Please specify an amount!",
  );
  // ... and so on for all other months
  await MonthlyLumpSumView.JulError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.AugError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.SepError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.OctError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.NovError.assertMessageContains(
    "Please specify an amount!",
  );
  await MonthlyLumpSumView.DecError.assertMessageContains(
    "Please specify an amount!",
  );

  assertNotHaveBeenCalled(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
  );
});
