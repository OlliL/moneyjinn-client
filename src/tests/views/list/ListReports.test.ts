import EtfServiceMocker from "@/service/mocker/EtfServiceMocker";
import ReportService from "@/service/ReportService";
import ReportServiceMocker from "@/service/mocker/ReportServiceMocker";
import router, { Routes } from "@/router";
import { assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, ModalView, RowView } from "@/tests/TestViews";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import ListReports from "@/views/reports/ListReports.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/ReportService");
vi.mock("@/service/EtfService");
vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return { ...actual, default: { push: vi.fn() } };
});
vi.mock("vue-router", async () => {
  const actual =
    await vi.importActual<typeof import("vue-router")>("vue-router");
  return { ...actual, onBeforeRouteUpdate: vi.fn() };
});

class ListReportsView {
  static readonly RowOwn = new RowView("report-moneyflow-row-1");
  static readonly RowForeign = new RowView("report-moneyflow-row-2");
  static readonly EditOwnButton = new ButtonView("report-moneyflow-edit-1");
  static readonly DeleteOwnButton = new ButtonView("report-moneyflow-delete-1");
  static readonly ListForeignButton = new ButtonView("report-moneyflow-list-2");
  static readonly PreviousMonthButton = new ButtonView("reports-previous-month");
  static readonly NextMonthButton = new ButtonView("reports-next-month");
  static readonly YearTrigger = new ButtonView("month-year-nav-year-trigger");
  static readonly Year2025Item = new ButtonView("month-year-nav-year-item-2025");
  static readonly Month1Button = new ButtonView("month-year-nav-month-1");
  static readonly Modal = new ModalView("app-modal");
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  ReportServiceMocker.mockGetAvailableMonth({
    allMonth: [1, 2, 3],
    allYears: [2025, 2026],
    previousMonth: 1,
    previousMonthHasMoneyflows: 1,
    previousYear: 2026,
    nextMonth: 3,
    nextMonthHasMoneyflows: 1,
    nextYear: 2026,
    month: 2,
    year: 2026,
  } as never);
  ReportServiceMocker.mockListReports({
    year: 2026,
    month: 2,
    moneyflows: [
      {
        id: 1,
        userId: 1,
        bookingDate: new Date("2026-02-05"),
        invoiceDate: new Date("2026-02-04"),
        amount: 120,
        capitalsourceId: 1,
        capitalsourceComment: "Main account",
        contractpartnerId: 1,
        contractpartnerName: "Landlord",
        comment: "Own flow",
        private: false,
        postingAccountId: 1,
        postingAccountName: "Rent",
        hasReceipt: false,
      },
      {
        id: 2,
        userId: 2,
        bookingDate: new Date("2026-02-10"),
        invoiceDate: new Date("2026-02-10"),
        amount: 50,
        capitalsourceId: 1,
        capitalsourceComment: "Main account",
        contractpartnerId: 2,
        contractpartnerName: "Friend",
        comment: "Shared flow",
        private: false,
        postingAccountId: 2,
        postingAccountName: "Shared",
        hasReceipt: false,
      },
    ],
    reportTurnoverCapitalsources: [],
  } as never);
  EtfServiceMocker.mockListEtfOverview([]);
});

test("ListReports calls getAvailableMonth on mount", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await assertHaveBeenCalledWith(ReportService.getAvailableMonth, 2026, 2);
});

test("ListReports opens edit modal from own moneyflow row", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwn.assertToBeVisible();
  await ListReportsView.EditOwnButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens delete modal from own moneyflow row", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwn.assertToBeVisible();
  await ListReportsView.DeleteOwnButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens list modal from foreign moneyflow row", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowForeign.assertToBeVisible();
  await ListReportsView.ListForeignButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports navigates to previous and next month", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwn.assertToBeVisible();
  await ListReportsView.PreviousMonthButton.click();
  await ListReportsView.NextMonthButton.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2026", month: "1" }),
    }),
  );
  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2026", month: "3" }),
    }),
  );
});

test("ListReports selects year via navigator", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.YearTrigger.click();
  await ListReportsView.Year2025Item.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2025" }),
    }),
  );
});

test("ListReports selects month via navigator", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.Month1Button.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2026", month: "1" }),
    }),
  );
});

