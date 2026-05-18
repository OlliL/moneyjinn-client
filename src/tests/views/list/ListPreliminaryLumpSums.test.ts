import CrudEtfPreliminaryLumpSumServiceMocker from "@/service/mocker/CrudEtfPreliminaryLumpSumServiceMocker";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import router, { Routes } from "@/router";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { StoreService } from "@/stores/StoreService";
import { ButtonView, InputView, ModalView } from "@/tests/TestViews";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import ListPreliminaryLumpSums from "@/views/etf/ListPreliminaryLumpSums.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CrudEtfPreliminaryLumpSumService");
vi.mock("@/service/CrudEtfService");
vi.mock("@/service/CapitalsourceService");
vi.mock("@/service/ContractpartnerService");
vi.mock("@/service/PostingAccountService");
vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return { ...actual, default: { push: vi.fn() } };
});

class ListPreliminaryLumpSumsView {
  static readonly EtfInput = new InputView("etf");
  static readonly EtfIdInput = new InputView("etf-id");
  static readonly CreateMonthlyButton = new ButtonView(
    "preliminary-lump-sum-create-monthly",
  );
  static readonly CreatePieceButton = new ButtonView(
    "preliminary-lump-sum-create-piece",
  );
  static readonly CreateYearlyButton = new ButtonView(
    "preliminary-lump-sum-create-yearly",
  );
  static readonly YearPreviousButton = new ButtonView(
    "preliminary-lump-sum-year-previous",
  );
  static readonly YearNextButton = new ButtonView("preliminary-lump-sum-year-next");
  static readonly EditButton = new ButtonView("preliminary-lump-sum-edit");
  static readonly DeleteButton = new ButtonView("preliminary-lump-sum-delete");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  CrudEtfServiceMocker.mockFetchAllEtf([
    {
      id: 1,
      name: "ETF 1",
      isFavorite: true,
      partialTaxExemption: 30,
    } as never,
  ]);
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([]);
  CapitalsourceServiceMocker.mockFetchAllCapitalsource([]);
  ContractpartnerServiceMocker.mockFetchAllContractpartner([]);
  PostingAccountServiceMocker.mockFetchAllPostingAccount([]);
});

test("ListPreliminaryLumpSums renders ETF select on mount", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
});

test("ListPreliminaryLumpSums opens monthly create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
  await ListPreliminaryLumpSumsView.CreateMonthlyButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens piece create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
  await ListPreliminaryLumpSumsView.CreatePieceButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens yearly create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
  await ListPreliminaryLumpSumsView.CreateYearlyButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums auto-selects favorite ETF when mounted without props", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.EtfInput.assertValue("ETF 1");
  await ListPreliminaryLumpSumsView.EtfIdInput.assertValue("1");
});

test("ListPreliminaryLumpSums navigates to previous and next year", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2024,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
    },
    {
      id: 2,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.YearPreviousButton.click();
  await ListPreliminaryLumpSumsView.YearNextButton.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListEtfPreliminaryLumpSums,
      params: expect.objectContaining({ etfId: 1, year: "2024" }),
    }),
  );
  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListEtfPreliminaryLumpSums,
      params: expect.objectContaining({ etfId: 1, year: "2025" }),
    }),
  );
});

test("ListPreliminaryLumpSums opens edit action for monthly entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.EditButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens delete action for monthly entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.DeleteButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens edit action for piece entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.EditButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens delete action for piece entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.DeleteButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens edit action for yearly entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.EditButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens delete action for yearly entry", async () => {
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum([
    {
      id: 1,
      etfId: 1,
      year: 2025,
      type: EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR,
    },
  ] as never);

  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums);

  await ListPreliminaryLumpSumsView.DeleteButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

