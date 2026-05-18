import MonthlySettlementService from "@/service/MonthlySettlementService";
import MonthlySettlementServiceMocker from "@/service/mocker/MonthlySettlementServiceMocker";
import router, { Routes } from "@/router";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, ModalView } from "@/tests/TestViews";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import ListMonthlySettlements from "@/views/monthlysettlement/ListMonthlySettlements.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/MonthlySettlementService");
vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return { ...actual, default: { push: vi.fn() } };
});
vi.mock("vue-router", async () => {
  const actual =
    await vi.importActual<typeof import("vue-router")>("vue-router");
  return { ...actual, onBeforeRouteUpdate: vi.fn() };
});

class ListMonthlySettlementsView {
  static readonly NewButton = new ButtonView("monthly-settlement-new");
  static readonly EditButton = new ButtonView("monthly-settlement-edit");
  static readonly DeleteButton = new ButtonView("monthly-settlement-delete");
  static readonly YearTrigger = new ButtonView("month-year-nav-year-trigger");
  static readonly Year2027Item = new ButtonView("month-year-nav-year-item-2027");
  static readonly Month2Button = new ButtonView("month-year-nav-month-2");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  MonthlySettlementServiceMocker.mockGetAvailableMonth({
    allMonth: [1, 2],
    allYears: [2026, 2027],
    month: 1,
    year: 2026,
  } as never);
  MonthlySettlementServiceMocker.mockGetMonthlySettlementList([]);
  MonthlySettlementServiceMocker.mockGetMonthlySettlementForEdit({
    year: 2026,
    month: 1,
    editMode: false,
    monthlySettlements: [],
    importedMonthlySettlements: [],
  });
});

test("ListMonthlySettlements calls getAvailableMonth on mount", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await assertHaveBeenCalledWith(
    MonthlySettlementService.getAvailableMonth,
    2026,
    1,
  );
});

test("ListMonthlySettlements opens new modal", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await ListMonthlySettlementsView.NewButton.click();
  await ListMonthlySettlementsView.Modal.assertOpen();
});

test("ListMonthlySettlements opens edit modal", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await ListMonthlySettlementsView.EditButton.click();
  await ListMonthlySettlementsView.Modal.assertOpen();
});

test("ListMonthlySettlements opens delete modal", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await ListMonthlySettlementsView.DeleteButton.click();
  await ListMonthlySettlementsView.Modal.assertOpen();
});

test("ListMonthlySettlements selects another year via navigator", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await ListMonthlySettlementsView.YearTrigger.click();
  await ListMonthlySettlementsView.Year2027Item.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListMonthlySettlements,
      params: expect.objectContaining({ year: "2027" }),
    }),
  );
});

test("ListMonthlySettlements selects another month via navigator", async () => {
  render(ListMonthlySettlements, { props: { year: "2026", month: "1" } });

  await ListMonthlySettlementsView.Month2Button.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListMonthlySettlements,
      params: expect.objectContaining({ year: "2026", month: 2 }),
    }),
  );
});

