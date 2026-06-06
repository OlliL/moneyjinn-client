import CrudEtfPreliminarySumService from "@/service/CrudEtfPreliminaryLumpSumService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfPreliminaryLumpSumServiceMocker from "@/service/mocker/CrudEtfPreliminaryLumpSumServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
  setupUserStandard,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  ComboboxView,
  InputView,
  ModalView,
  renderDeclarativeModal,
} from "@/tests/TestViews";
import { useCreateEtfPreliminaryLumpSumModalPieceStore } from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalPiece.store";
import CreateEtfPreliminaryLumpSumModalPiece from "@/views/etf/elements/CreateEtfPreliminaryLumpSumModalPiece.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");

class PieceLumpSumView {
  static readonly Modal = new ModalView(
    "app-modal-CreateEtfPreliminaryLumpSumPiece",
  );
  static readonly EtfSelect = new ComboboxView("etf");
  static readonly YearInput = new InputView("bookingdate");
  static readonly PieceInput = new InputView("amountPerPiece");
  static readonly SaveButton = new ButtonView(
    "createEtfPreliminaryLumpSumPieceSaveButton",
  );

  static readonly EtfError = new AlertView("etf-error");
  static readonly YearError = new AlertView("bookingdate-error");
  static readonly PieceError = new AlertView("amountPerPiece-error-item");
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupUserStandard();
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
  renderDeclarativeModal(CreateEtfPreliminaryLumpSumModalPiece);
  useCreateEtfPreliminaryLumpSumModalPieceStore().openCreateEtfPreliminaryLumpSumPiece(
    1,
  );

  await PieceLumpSumView.PieceInput.setValue("0.12345678");
  await PieceLumpSumView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
    expect.objectContaining({
      amountPerPiece: 0.12345678,
    }),
  );
});

test("validation: mandatory fields are required", async () => {
  renderDeclarativeModal(CreateEtfPreliminaryLumpSumModalPiece);
  useCreateEtfPreliminaryLumpSumModalPieceStore().openCreateEtfPreliminaryLumpSumPiece(
    1,
  );

  await PieceLumpSumView.Modal.assertOpen();

  await PieceLumpSumView.EtfSelect.clear();
  await PieceLumpSumView.YearInput.setValue("");

  await PieceLumpSumView.SaveButton.click();

  await PieceLumpSumView.Modal.assertOpen();
  await PieceLumpSumView.EtfError.assertMessageContains(
    "Please select an ETF!",
  );
  await PieceLumpSumView.YearError.assertMessageContains(
    "Please specify a year!",
  );
  await PieceLumpSumView.PieceError.assertMessageContains(
    "Please specify an amount!",
  );
  await assertNotHaveBeenCalled(
    CrudEtfPreliminarySumService.createEtfPreliminaryLumpSum,
  );
});
