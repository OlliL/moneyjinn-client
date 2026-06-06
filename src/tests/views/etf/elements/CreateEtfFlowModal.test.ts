import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfFlowServiceMocker from "@/service/mocker/CrudEtfFlowServiceMocker";
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
import { useCreateEtfFlowModalStore } from "@/views/etf/elements/CreateEtfFlowModal.store";
import CreateEtfFlowModal from "@/views/etf/elements/CreateEtfFlowModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfFlowService");

class CreateEtfFlowModalView {
  static readonly Modal = new ModalView("app-modal-CreateEtfFlow");
  static readonly TimeInput = new InputView("bookingtime");
  static readonly AmountInput = new InputView("amount");
  static readonly PriceInput = new InputView("price");
  static readonly SaveButton = new ButtonView("createEtfFlowSaveButton");
  static readonly EtfSelect = new ComboboxView("etf");
  static readonly BookingDateInput = new InputView("bookingdate");

  static readonly EtfError = new AlertView("etf-error");
  static readonly BookingDateError = new AlertView("bookingdate-error");
  static readonly TimeError = new AlertView("bookingtime-error-item");
  static readonly AmountError = new AlertView("amount-error-item");
  static readonly PriceError = new AlertView("price-error-item");
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

test("creates a new etf flow with time formatting", async () => {
  CrudEtfFlowServiceMocker.mockCreateEtfFlowResolved({ etfflowid: 1 } as any);
  renderDeclarativeModal(CreateEtfFlowModal);
  const modalStore = useCreateEtfFlowModalStore();
  modalStore.openCreateEtfFlow(1);

  await CreateEtfFlowModalView.Modal.assertOpen();

  await CreateEtfFlowModalView.TimeInput.setValueWithoutChecking("120000123");
  await CreateEtfFlowModalView.TimeInput.assertValue("12:00:00:123");
  await CreateEtfFlowModalView.AmountInput.setValue("10.5");
  await CreateEtfFlowModalView.PriceInput.setValue("100.25");

  await CreateEtfFlowModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfFlowService.createEtfFlow,
    expect.objectContaining({
      etfId: 1,
      amount: 10.5,
      price: 100.25,
      nanoseconds: 123000000,
    }),
  );
});

test("validation: mandatory fields are required", async () => {
  renderDeclarativeModal(CreateEtfFlowModal);
  const modalStore = useCreateEtfFlowModalStore();
  modalStore.openCreateEtfFlow(1);

  await CreateEtfFlowModalView.Modal.assertOpen();

  // Clear pre-filled ETF and Date
  await CreateEtfFlowModalView.EtfSelect.clear();
  await CreateEtfFlowModalView.BookingDateInput.setValue("");

  await CreateEtfFlowModalView.SaveButton.click();

  await CreateEtfFlowModalView.Modal.assertOpen();
  await CreateEtfFlowModalView.EtfError.assertMessageContains(
    "Please select an ETF!",
  );
  await CreateEtfFlowModalView.BookingDateError.assertMessageContains(
    "Please specify a booking time!",
  );
  await CreateEtfFlowModalView.TimeError.assertMessageContains(
    "Booking time must be in the format HH:MM:SS:mmm!",
  );
  await CreateEtfFlowModalView.AmountError.assertMessageContains(
    "Please specify a quantity!",
  );
  await CreateEtfFlowModalView.PriceError.assertMessageContains(
    "Please specify a price per share!",
  );
  await assertNotHaveBeenCalled(CrudEtfFlowService.createEtfFlow);
});
