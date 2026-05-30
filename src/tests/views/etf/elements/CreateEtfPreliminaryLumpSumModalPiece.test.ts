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
import CreateEtfPreliminaryLumpSumModalPiece from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalPiece.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");

class PieceLumpSumView {
  static readonly PieceInput = new InputView("amountPerPiece");
  static readonly SaveButton = new ButtonView(
    "createEtfPreliminaryLumpSumPieceSaveButton",
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

test("creates piece lump sum", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockCreateEtfPreliminaryLumpSumResolved(
    { id: 1 } as any,
  );
  const modalRef = renderModalWithRef<any>(
    CreateEtfPreliminaryLumpSumModalPiece,
  );
  await modalRef.value._show(1);

  await PieceLumpSumView.PieceInput.setValue("0.12345678");
  await PieceLumpSumView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
    expect.objectContaining({
      amountPerPiece: 0.12345678,
    }),
  );
});
