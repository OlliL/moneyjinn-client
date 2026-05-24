import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";
import router, { Routes } from "@/router";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import ContractpartnerServiceMocker from "@/service/mocker/ContractpartnerServiceMocker";
import CrudEtfPreliminaryLumpSumServiceMocker from "@/service/mocker/CrudEtfPreliminaryLumpSumServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import PostingAccountServiceMocker from "@/service/mocker/PostingAccountServiceMocker";
import { StoreService } from "@/stores/StoreService";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import {
  ButtonView,
  InputView,
  MobilePopupMenu,
  ModalView,
  RowView,
} from "@/tests/TestViews";
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
  static readonly EtfInput = new InputView("etf-desktop");
  static readonly EtfIdInput = new InputView("etf-desktop-id");
  static readonly CreateButton = new ButtonView("preliminary-lump-sum-create");
  static readonly YearPreviousButton = new ButtonView(
    "preliminary-lump-sum-year-previous",
  );
  static readonly YearNextButton = new ButtonView(
    "preliminary-lump-sum-year-next",
  );
  static readonly EditButton = new ButtonView("preliminary-lump-sum-edit");
  static readonly DeleteButton = new ButtonView("preliminary-lump-sum-delete");
  static readonly Modal = new ModalView("app-modal");
  static readonly MobileCreateButton = new ButtonView(
    "preliminary-lump-sum-mobile-create",
  );
  static readonly MobileDeleteButton = new ButtonView(
    "preliminary-lump-sum-mobile-delete",
  );
  static readonly MobileEditButton = new ButtonView(
    "preliminary-lump-sum-mobile-edit",
  );
  static readonly PopupMenu = new MobilePopupMenu(
    "etf-preliminary-sump-sum-create-menu",
  );
  static readonly MobileCreateTypePieceButton = new ButtonView(
    "preliminary-lump-sum-mobile-create-type-piece",
  );
  static readonly MobileCreateTypeMonthButton = new ButtonView(
    "preliminary-lump-sum-mobile-create-type-month",
  );
  static readonly MobileCreateTypeYearlyButton = new ButtonView(
    "preliminary-lump-sum-mobile-create-type-yearly",
  );
  static readonly DesktopCreateTypePieceButton = new ButtonView(
    "preliminary-lump-sum-desktop-create-type-piece",
  );
  static readonly DesktopCreateTypeMonthButton = new ButtonView(
    "preliminary-lump-sum-desktop-create-type-month",
  );
  static readonly DesktopCreateTypeYearlyButton = new ButtonView(
    "preliminary-lump-sum-desktop-create-type-yearly",
  );
  static readonly EmptyState = new RowView("preliminary-lump-sum-empty");
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
  await ListPreliminaryLumpSumsView.CreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.DesktopCreateTypeMonthButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens piece create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
  await ListPreliminaryLumpSumsView.CreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.DesktopCreateTypePieceButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums opens yearly create modal", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.EtfInput.assertToBeVisible();
  await ListPreliminaryLumpSumsView.CreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.DesktopCreateTypeYearlyButton.click();
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

test("ListPreliminaryLumpSums mobile: create menu opens and triggers modal (piece)", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.MobileCreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.MobileCreateTypePieceButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums mobile: create menu opens and triggers modal (monthly)", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.MobileCreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.MobileCreateTypeMonthButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums mobile: create menu opens and triggers modal (yearly)", async () => {
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1" } });

  await ListPreliminaryLumpSumsView.MobileCreateButton.click();
  await ListPreliminaryLumpSumsView.PopupMenu.assertToBeVisible();
  await ListPreliminaryLumpSumsView.MobileCreateTypeYearlyButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums mobile: edit button opens modal", async () => {
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

  await ListPreliminaryLumpSumsView.MobileEditButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums mobile: delete button opens modal", async () => {
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

  await ListPreliminaryLumpSumsView.MobileDeleteButton.click();
  await ListPreliminaryLumpSumsView.Modal.assertOpen();
});

test("ListPreliminaryLumpSums shows empty state when no data is present", async () => {
  // There exists an entry for 2024, but we select 2025
  CrudEtfPreliminaryLumpSumServiceMocker.mockFetchAllEtfPreliminaryLumpSum(
    [] as never,
  );
  await StoreService.getInstance().initAllStores();
  render(ListPreliminaryLumpSums, { props: { etfId: "1", year: "2025" } });

  await ListPreliminaryLumpSumsView.EmptyState.assertToBeVisible();
});
