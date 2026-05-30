import CrudEtfPreliminarySumService from "@/service/CrudEtfPreliminaryLumpSumService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfPreliminaryLumpSumServiceMocker from "@/service/mocker/CrudEtfPreliminaryLumpSumServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, InputView, renderModalWithRef } from "@/tests/TestViews";
import CreateEtfPreliminaryLumpSumModalYearly from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalYearly.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");

class YearlyLumpSumView {
  static readonly YearInput = new InputView("amountPerYear");
  static readonly SaveButton = new ButtonView(
    "createEtfPreliminaryLumpSumYearlySaveButton",
  );
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
  const modalRef = renderModalWithRef<any>(
    CreateEtfPreliminaryLumpSumModalYearly,
  );
  await modalRef.value._show(1);

  await YearlyLumpSumView.YearInput.setValue("1200.50");
  await YearlyLumpSumView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
    expect.objectContaining({
      amountDecember: 1200.5,
    }),
  );
});
