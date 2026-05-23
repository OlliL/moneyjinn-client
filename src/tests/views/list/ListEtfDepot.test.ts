import EtfService from "@/service/EtfService";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import EtfServiceMocker from "@/service/mocker/EtfServiceMocker";
import { useEtfStore } from "@/stores/EtfStore";
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
  SwitchView,
  TextView,
} from "@/tests/TestViews";
import ListEtfDepot from "@/views/etf/ListEtfDepot.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";

vi.mock("@/service/EtfService");
vi.mock("@/service/CrudEtfService");
vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return { ...actual, default: { push: vi.fn() } };
});

class ListEtfDepotView {
  static readonly EtfInput = new InputView("etf");
  static readonly EtfIdInput = new InputView("etf-id");
  static readonly CreateButton = new ButtonView("etf-depot-create");
  static readonly MobileFilterTrigger = new ButtonView(
    "etf-depot-mobile-filter-trigger",
  );
  static readonly MobileFilterSheet = new MobilePopupMenu(
    "etf-depot-mobile-filter-sheet",
  );
  static readonly MobileEffectiveSwitch = new SwitchView(
    "etf-depot-mobile-effective-switch",
  );
  static readonly MobileRow101 = new RowView("etf-depot-mobile-row-101");
  static readonly MobileRow102 = new RowView("etf-depot-mobile-row-102");
  static readonly MobileEditButton = new ButtonView(
    "etf-depot-mobile-edit-101",
  );
  static readonly MobileDeleteButton = new ButtonView(
    "etf-depot-mobile-delete-101",
  );
  static readonly EditButton = new ButtonView("etf-depot-edit-101");
  static readonly DeleteButton = new ButtonView("etf-depot-delete-101");
  static readonly CalculateSaleHeadline = new TextView("calculate sale");
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
  EtfServiceMocker.mockListEtfFlowsById({
    calcEtfSalePieces: 0,
    etfFlows: [
      {
        etfflowid: 101,
        etfId: 1,
        timestamp: new Date("2026-01-02T08:30:00Z"),
        nanoseconds: 0,
        amount: 1.5,
        price: 100,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
    ],
    etfEffectiveFlows: [],
    etfSummary: {
      etfId: 1,
      amount: 0,
      spentValue: 0,
    },
  } as never);
});

test("ListEtfDepot calls listEtfFlowsById on mount", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await assertHaveBeenCalledWith(EtfService.listEtfFlowsById, 1);
});

test("ListEtfDepot opens create booking modal", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.CreateButton.click();
  await ListEtfDepotView.Modal.assertOpen();
});

test("ListEtfDepot auto-selects favorite ETF when mounted without props", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot);

  await ListEtfDepotView.EtfInput.assertValue("ETF 1");
  await ListEtfDepotView.EtfIdInput.assertValue("1");
  await assertHaveBeenCalledWith(EtfService.listEtfFlowsById, 1);
});

test("ListEtfDepot shows effective flows when available", async () => {
  EtfServiceMocker.mockListEtfFlowsById({
    calcEtfSalePieces: 0,
    etfFlows: [
      {
        etfflowid: 0,
        etfId: 1,
        timestamp: new Date("2026-01-01T00:00:00Z"),
        nanoseconds: 0,
        amount: 0,
        price: 0,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
    ],
    etfEffectiveFlows: [
      {
        etfflowid: 201,
        etfId: 1,
        timestamp: new Date("2026-02-03T09:30:00Z"),
        nanoseconds: 0,
        amount: 0.8,
        price: 120,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
    ],
    etfSummary: {
      etfId: 1,
      amount: 0.8,
      spentValue: 96,
    },
  } as never);

  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.CalculateSaleHeadline.assertInDocument();
});

test("ListEtfDepot opens edit modal from row action", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.EditButton.click();
  await ListEtfDepotView.Modal.assertOpen();
});

test("ListEtfDepot opens delete modal from row action", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.DeleteButton.click();
  await ListEtfDepotView.Modal.assertOpen();
});

test("ListEtfDepot toggles mobile view mode via filter switch", async () => {
  EtfServiceMocker.mockListEtfFlowsById({
    calcEtfSalePieces: 0,
    etfFlows: [
      {
        etfflowid: 101,
        etfId: 1,
        timestamp: new Date("2026-01-02T08:30:00Z"),
        nanoseconds: 0,
        amount: 1.5,
        price: 100,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
      {
        etfflowid: 102,
        etfId: 1,
        timestamp: new Date("2026-02-02T08:30:00Z"),
        nanoseconds: 0,
        amount: 0.5,
        price: 105,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
    ],
    etfEffectiveFlows: [
      {
        etfflowid: 102,
        etfId: 1,
        timestamp: new Date("2026-02-02T08:30:00Z"),
        nanoseconds: 0,
        amount: 0.5,
        price: 105,
        accumulatedPreliminaryLumpSum: 0,
        preliminaryLumpSumPerYear: new Map<string, number>(),
      },
    ],
    etfSummary: {
      etfId: 1,
      amount: 0.5,
      spentValue: 52.5,
    },
  } as never);

  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.MobileRow102.assertToBeVisible();
  await ListEtfDepotView.MobileRow101.assertNotToBeInDocument();

  await ListEtfDepotView.MobileFilterTrigger.click();
  await ListEtfDepotView.MobileFilterSheet.assertToBeVisible();
  await ListEtfDepotView.MobileEffectiveSwitch.assertChecked();

  await ListEtfDepotView.MobileEffectiveSwitch.click();
  await ListEtfDepotView.MobileEffectiveSwitch.assertUnchecked();

  await ListEtfDepotView.MobileRow101.assertToBeVisible();
  await ListEtfDepotView.MobileRow102.assertToBeVisible();
});

test("ListEtfDepot opens edit modal from mobile row action", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.MobileRow101.assertToBeVisible();
  await ListEtfDepotView.MobileEditButton.click();
  await ListEtfDepotView.Modal.assertOpen();
});

test("ListEtfDepot opens delete modal from mobile row action", async () => {
  await useEtfStore().initEtfStore();
  render(ListEtfDepot, { props: { etfId: "1" } });

  await ListEtfDepotView.MobileRow101.assertToBeVisible();
  await ListEtfDepotView.MobileDeleteButton.click();
  await ListEtfDepotView.Modal.assertOpen();
});
