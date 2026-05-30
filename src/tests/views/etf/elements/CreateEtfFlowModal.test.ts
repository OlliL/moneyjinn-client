import CrudEtfFlowService from "@/service/CrudEtfFlowService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfFlowServiceMocker from "@/service/mocker/CrudEtfFlowServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import PreDefMoneyflowServiceMocker from "@/service/mocker/PreDefMoneyflowServiceMocker";
import { StoreService } from "@/stores/StoreService";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import {
  ButtonView,
  InputView,
  ModalView,
  renderModalWithRef,
} from "@/tests/TestViews";
import CreateEtfFlowModal from "@/views/etf/elements/CreateEtfFlowModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfFlowService");

class CreateEtfFlowModalView {
  static readonly Modal = new ModalView("app-modal");
  static readonly TimeInput = new InputView("bookingtime");
  static readonly AmountInput = new InputView("amount");
  static readonly PriceInput = new InputView("price");
  static readonly SaveButton = new ButtonView("createEtfFlowSaveButton");
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

test("creates a new etf flow with time formatting", async () => {
  CrudEtfFlowServiceMocker.mockCreateEtfFlowResolved({ etfflowid: 1 } as any);
  const modalRef = renderModalWithRef<any>(CreateEtfFlowModal);
  await modalRef.value._show(undefined, 1);

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
