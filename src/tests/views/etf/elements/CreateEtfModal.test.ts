import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  assertHaveBeenCalledWith,
  assertNotHaveBeenCalled,
  setupUserStandard,
} from "@/tests/TestUtil";
import {
  AlertView,
  ButtonView,
  InputView,
  ModalView,
  renderDeclarativeModal,
  ToastView,
} from "@/tests/TestViews";
import { useCreateEtfModalStore } from "@/views/etf/elements/CreateEtfModal.store";
import CreateEtfModal from "@/views/etf/elements/CreateEtfModal.vue";
import "@testing-library/jest-dom/vitest";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfService");

class CreateEtfModalView {
  static readonly Modal = new ModalView("app-modal-CreateEtf");
  static readonly NameInput = new InputView("name-CreateEtf");
  static readonly IsinInput = new InputView("isin-CreateEtf");
  static readonly WknInput = new InputView("wkn-CreateEtf");
  static readonly TickerInput = new InputView("ticker-CreateEtf");
  static readonly FavoriteButton = new ButtonView("createEtfFavoriteButton");
  static readonly SaveButton = new ButtonView("createEtfSaveButton");
  static readonly ResetButton = new ButtonView("createEtfResetButton");
  static readonly NameError = new AlertView("name-CreateEtf-error-item");
  static readonly IsinError = new AlertView("isin-CreateEtf-error-item");
  static readonly WknError = new AlertView("wkn-CreateEtf-error-item");
  static readonly TickerError = new AlertView("ticker-CreateEtf-error-item");
  static readonly Toast = new ToastView();
}

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupUserStandard();
  CrudEtfServiceMocker.mockFetchAllEtf([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
  await StoreService.getInstance().initAllStores();
});

test("creates a new etf", async () => {
  CrudEtfServiceMocker.mockCreateEtfResolved({ id: 1, name: "New ETF" } as Etf);
  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openCreateEtf();

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.NameInput.setValue("New ETF");
  await CreateEtfModalView.IsinInput.setValue("IE00B4L5Y983");
  await CreateEtfModalView.WknInput.setValue("A1JX52");
  await CreateEtfModalView.TickerInput.setValue("VGWL");
  await CreateEtfModalView.FavoriteButton.click();

  await CreateEtfModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfService.createEtf,
    expect.objectContaining({
      name: "New ETF",
      isin: "IE00B4L5Y983",
      isFavorite: true,
    }),
  );
  await CreateEtfModalView.Modal.assertClosed();
});

test("updates an existing etf", async () => {
  const existing = {
    id: 1,
    name: "Old",
    isin: "IE123",
    wkn: "WKN1",
    ticker: "TICK",
  } as Etf;
  CrudEtfService.updateEtf = vi.fn().mockResolvedValue(undefined);

  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openEditEtf(existing);

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.NameInput.setValue("Updated");
  await CreateEtfModalView.SaveButton.click();

  await assertHaveBeenCalledWith(
    CrudEtfService.updateEtf,
    expect.objectContaining({
      id: 1,
      name: "Updated",
    }),
  );
  await CreateEtfModalView.Modal.assertClosed();
});

test("reset button works", async () => {
  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openCreateEtf();

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.NameInput.setValue("To be reset");
  await CreateEtfModalView.ResetButton.click();
  await CreateEtfModalView.NameInput.assertValue("");
});

test("shows server error on failure", async () => {
  const error = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Server Error",
  );
  CrudEtfService.createEtf = vi.fn().mockRejectedValue(error);

  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openCreateEtf();

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.NameInput.setValue("Valid");
  await CreateEtfModalView.IsinInput.setValue("IE123");
  await CreateEtfModalView.WknInput.setValue("WKN1");
  await CreateEtfModalView.TickerInput.setValue("TICK");

  await CreateEtfModalView.SaveButton.click();
  await CreateEtfModalView.Toast.assertError("Server Error");
});

test("validation: mandatory fields", async () => {
  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openCreateEtf();

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.SaveButton.click();

  await CreateEtfModalView.Modal.assertOpen();
  await CreateEtfModalView.NameError.assertMessageContains(
    "Please specify a name!",
  );
  await CreateEtfModalView.IsinError.assertMessageContains(
    "Please specify an ISIN!",
  );
  await CreateEtfModalView.WknError.assertMessageContains(
    "Please specify a WKN!",
  );
  await CreateEtfModalView.TickerError.assertMessageContains(
    "Please specify a Ticker!",
  );
  await assertNotHaveBeenCalled(CrudEtfService.createEtf);
});

test("validation: field lengths", async () => {
  renderDeclarativeModal(CreateEtfModal);
  useCreateEtfModalStore().openCreateEtf();

  await CreateEtfModalView.Modal.assertOpen();

  await CreateEtfModalView.NameInput.setValue("a".repeat(61));
  await CreateEtfModalView.IsinInput.setValue("a".repeat(31));
  await CreateEtfModalView.WknInput.setValue("a".repeat(11));
  await CreateEtfModalView.TickerInput.setValue("a".repeat(11));

  await CreateEtfModalView.SaveButton.click();

  await CreateEtfModalView.NameError.assertMessageContains("Name is too long!");
  await CreateEtfModalView.IsinError.assertMessageContains("ISIN is too long!");
  await CreateEtfModalView.WknError.assertMessageContains("WKN is too long!");
  await CreateEtfModalView.TickerError.assertMessageContains(
    "Ticker is too long!",
  );
});
