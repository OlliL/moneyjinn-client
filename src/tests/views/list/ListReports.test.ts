import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import router, { Routes } from "@/router";
import EtfServiceMocker from "@/service/mocker/EtfServiceMocker";
import MoneyflowReceiptServiceMocker from "@/service/mocker/MoneyflowReceiptServiceMocker";
import ReportServiceMocker from "@/service/mocker/ReportServiceMocker";
import ReportService from "@/service/ReportService";
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
import ListReports from "@/views/reports/ListReports.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/ReportService");
vi.mock("@/service/MoneyflowReceiptService");
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
  static readonly RowOwnMobile = new RowView("report-mobile-moneyflow-row-1");
  static readonly RowForeignMobile = new RowView(
    "report-mobile-moneyflow-row-2",
  );
  static readonly EditOwnButton = new ButtonView("report-moneyflow-edit-1");
  static readonly DeleteOwnButton = new ButtonView("report-moneyflow-delete-1");
  static readonly ListForeignButton = new ButtonView("report-moneyflow-list-2");
  static readonly EditOwnMobileButton = new ButtonView(
    "report-mobile-moneyflow-edit-1",
  );
  static readonly DeleteOwnMobileButton = new ButtonView(
    "report-mobile-moneyflow-delete-1",
  );
  static readonly ReceiptOwnMobileButton = new ButtonView(
    "report-mobile-moneyflow-receipt-1",
  );
  static readonly ListForeignMobileButton = new ButtonView(
    "report-mobile-moneyflow-list-2",
  );
  static readonly MobileFilterTrigger = new ButtonView(
    "report-table-mobile-filter-trigger",
  );
  static readonly MobileFilterSheet = new MobilePopupMenu(
    "report-table-mobile-filter-sheet",
  );
  static readonly MobileContractpartnerFilter = new InputView(
    "report-table-mobile-filter-contractpartner",
  );
  static readonly MobileContractpartnerFilterReset = new ButtonView(
    "report-table-mobile-filter-contractpartner-reset",
  );
  static readonly EtfDesktopTable = new RowView("etf-desktop-table");
  static readonly EtfMobileAccordion = new RowView("etf-mobile-accordion");
  static readonly EtfDesktopRowOne = new RowView("report-etf-desktop-row-100");
  static readonly EtfMobileItemOne = new RowView("report-etf-mobile-item-100");
  static readonly EtfMobileTriggerOne = new ButtonView(
    "report-etf-mobile-trigger-100",
  );
  static readonly EtfMobileContentOne = new RowView(
    "report-etf-mobile-content-100",
  );
  static readonly EtfMobileChartLinkOne = new RowView(
    "report-etf-mobile-chart-link-100",
  );
  static readonly PreviousMonthButton = new ButtonView(
    "reports-month-previous",
  );
  static readonly NextMonthButton = new ButtonView("reports-month-next");
  static readonly YearTrigger = new ButtonView("month-year-nav-year-trigger");
  static readonly Year2025Item = new ButtonView(
    "month-year-nav-year-item-2025",
  );
  static readonly Month1Button = new ButtonView("month-year-nav-month-1");
  static readonly MobileOpenPeriodSheetButton = new ButtonView(
    "reports-mobile-open-period-sheet",
  );
  static readonly MobilePeriodSheet = new MobilePopupMenu(
    "reports-mobile-period-sheet",
  );
  static readonly MobileYearTrigger = new ButtonView(
    "month-year-nav-mobile-year-trigger",
  );
  static readonly MobileYear2025Item = new ButtonView(
    "month-year-nav-mobile-year-item-2025",
  );
  static readonly MobileMonth1Button = new ButtonView(
    "month-year-nav-mobile-month-1",
  );
  static readonly MobileCreateButton = new ButtonView("reports-mobile-create");
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
        hasReceipt: true,
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

test("ListReports shows ETF data in desktop and mobile sections", async () => {
  EtfServiceMocker.mockListEtfOverview([
    {
      etfId: 100,
      name: "ACWI ETF",
      chartUrl: "https://example.invalid/acwi",
      amount: 10,
      spentValue: 1000,
      buyPrice: 102,
      sellPrice: 110,
      pricesTimestamp: new Date("2026-02-10T12:30:00"),
    },
  ]);

  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.EtfDesktopTable.assertToBeVisible();
  await ListReportsView.EtfMobileAccordion.assertToBeVisible();
  await ListReportsView.EtfDesktopRowOne.assertToBeVisible();
  await ListReportsView.EtfMobileItemOne.assertToBeVisible();
});

test("ListReports expands mobile ETF accordion and shows chart link", async () => {
  EtfServiceMocker.mockListEtfOverview([
    {
      etfId: 100,
      name: "ACWI ETF",
      chartUrl: "https://example.invalid/acwi",
      amount: 10,
      spentValue: 1000,
      buyPrice: 102,
      sellPrice: 110,
      pricesTimestamp: new Date("2026-02-10T12:30:00"),
    },
  ]);

  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.EtfMobileTriggerOne.click();
  await ListReportsView.EtfMobileContentOne.assertToBeVisible();
  await ListReportsView.EtfMobileChartLinkOne.assertToBeVisible();
});

test("ListReports opens edit modal from own moneyflow row", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 1,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwn.assertToBeVisible();
  await ListReportsView.EditOwnButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens delete modal from own moneyflow row", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 1,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
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

test("ListReports opens edit modal from own mobile moneyflow row", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 1,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.EditOwnMobileButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens delete modal from own mobile moneyflow row", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 1,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.DeleteOwnMobileButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens list modal from foreign mobile moneyflow row", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowForeignMobile.assertToBeVisible();
  await ListReportsView.ListForeignMobileButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports opens receipt modal from own mobile moneyflow row", async () => {
  MoneyflowReceiptServiceMocker.mockFetchReceiptResolved({
    moneyflowId: 1,
    receiptType: MoneyflowReceiptType.JPEG,
    receipt: "AA==",
  });
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.ReceiptOwnMobileButton.click();
  await ListReportsView.Modal.assertOpen();
});

test("ListReports filters mobile list by contractpartner", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.RowForeignMobile.assertToBeVisible();

  await ListReportsView.MobileFilterTrigger.click();
  await ListReportsView.MobileContractpartnerFilter.setValue("Landlord");

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.RowForeignMobile.assertNotToBeInDocument();
});

test("ListReports resets mobile contractpartner filter", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.RowOwnMobile.assertToBeVisible();
  await ListReportsView.RowForeignMobile.assertToBeVisible();

  await ListReportsView.MobileFilterTrigger.click();
  await ListReportsView.MobileContractpartnerFilter.setValue("Landlord");
  await ListReportsView.RowForeignMobile.assertNotToBeInDocument();

  await ListReportsView.MobileContractpartnerFilterReset.click();
  await ListReportsView.RowForeignMobile.assertToBeVisible();
});

test("ListReports closes mobile filter sheet on Enter", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.MobileFilterTrigger.click();
  await ListReportsView.MobileFilterSheet.assertToBeVisible();
  await ListReportsView.MobileContractpartnerFilter.setValue("Landlord");
  await ListReportsView.MobileContractpartnerFilter.pressEnter();

  await ListReportsView.MobileFilterSheet.assertNotToBeInDocument();
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

test("ListReports selects year via mobile period sheet", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.MobileOpenPeriodSheetButton.click();
  await ListReportsView.MobilePeriodSheet.assertToBeVisible();
  await ListReportsView.MobileYearTrigger.click();
  await ListReportsView.MobileYear2025Item.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2025" }),
    }),
  );
});

test("ListReports selects month via mobile period sheet", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.MobileOpenPeriodSheetButton.click();
  await ListReportsView.MobilePeriodSheet.assertToBeVisible();
  await ListReportsView.MobileMonth1Button.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListReports,
      params: expect.objectContaining({ year: "2026", month: "1" }),
    }),
  );
});

test("ListReports navigates to create moneyflow via mobile action", async () => {
  render(ListReports, { props: { year: "2026", month: "2" } });

  await ListReportsView.MobileCreateButton.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.CreateMoneyflow,
    }),
  );
});

test("ListReports shows empty state for empty list (Desktop)", async () => {
  ReportServiceMocker.mockListReports({
    year: 2026,
    month: 2,
    moneyflows: [],
    reportTurnoverCapitalsources: [],
  } as never);
  EtfServiceMocker.mockListEtfOverview([]);

  render(ListReports, { props: { year: "2026", month: "2" } });
  await new RowView("report-table-empty-desktop").assertToBeVisible();
});

test("ListReports shows empty state for empty list (Mobile)", async () => {
  ReportServiceMocker.mockListReports({
    year: 2026,
    month: 2,
    moneyflows: [],
    reportTurnoverCapitalsources: [],
  } as never);
  EtfServiceMocker.mockListEtfOverview([]);

  render(ListReports, { props: { year: "2026", month: "2" } });
  await new RowView("report-table-empty-mobile").assertToBeVisible();
});

test("ListReports shows sum/turnover", async () => {
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
        hasReceipt: true,
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

  render(ListReports, { props: { year: "2026", month: "2" } });

  await new RowView("report-table-empty").assertNotToBeInDocument();
});
