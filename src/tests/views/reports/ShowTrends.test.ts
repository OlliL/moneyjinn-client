import { BackendError, BackendErrorType } from "@/model/BackendError";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { Etf } from "@/model/etf/Etf";
import ReportService from "@/service/ReportService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import CrudEtfServiceMocker from "@/service/mocker/CrudEtfServiceMocker";
import ReportServiceMocker from "@/service/mocker/ReportServiceMocker";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useEtfStore } from "@/stores/EtfStore";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";
import {
  assertHaveBeenCalledOnce,
  assertHaveBeenCalledWith,
} from "@/tests/TestUtil";
import {
  ButtonView,
  CheckboxView,
  CommandView,
  InputView,
  RowView,
  TextView,
  ToastView,
} from "@/tests/TestViews";
import ShowTrends from "@/views/reports/ShowTrends.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { setupVitestCanvasMock } from "vitest-canvas-mock";

vi.mock("vue-sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));
vi.mock("@/service/ReportService");
vi.mock("@/service/CrudEtfService"); // Needed for EtfStore to function
vi.mock("@/service/CapitalsourceService"); // Needed for CapitalsourceStore to function

class ShowTrendsView {
  static readonly CapitalsourcesActiveCheckbox = new CheckboxView(
    "capitalsourcesActive",
  );
  static readonly EtfsActiveCheckbox = new CheckboxView("etfs");
  static readonly CapitalsourceSelectAllButton = new ButtonView(
    "capitalsource-select-all-button",
  );
  static readonly CapitalsourceSelectNoneButton = new ButtonView(
    "capitalsource-select-none-button",
  );
  static readonly EtfSelectAllButton = new ButtonView("etf-select-all-button");
  static readonly EtfSelectNoneButton = new ButtonView(
    "etf-select-none-button",
  );
  static readonly CapitalsourceSearchInput = new InputView(
    "capitalsource-search-input",
  );
  static readonly EtfSearchInput = new InputView("etf-search-input");
  static readonly ShowTrendsButton = new ButtonView("show-trends-button");
  static readonly Toast = new ToastView();

  static readonly GraphCanvas = new RowView("trends-canvas");
  static readonly EtfsCommand = new CommandView("etfs-command");
  static readonly CapitalsourcesCommand = new CommandView(
    "capitalsources-command",
  );

  static capitalsourceCheckbox(id: number): CheckboxView {
    return new CheckboxView(`capitalsource-${id}`);
  }

  static etfCheckbox(id: number): CheckboxView {
    return new CheckboxView(`etf-${id}`);
  }

  static capitalsourceSelectedCount(selected: number, total: number): TextView {
    return new TextView(`${selected} of ${total} Selected`);
  }

  static etfSelectedCount(selected: number, total: number): TextView {
    return new TextView(`${selected} of ${total} Selected`);
  }
}

const defaultCapitalsources: Capitalsource[] = [
  { id: 1, comment: "Cash Account" } as Capitalsource,
  { id: 2, comment: "Savings Account" } as Capitalsource,
  { id: 3, comment: "Credit Card" } as Capitalsource,
];

const defaultEtfs: Etf[] = [
  { id: 101, name: "Global ETF" } as Etf,
  { id: 102, name: "Tech ETF" } as Etf,
];

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupVitestCanvasMock();
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);
  ReportServiceMocker.mockShowTrendsFormResolved({
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    capitalsourcesActive: true,
    etfsActive: true,
    selectedCapitalsourceIds: [1],
    selectedEtfIds: [],
  });
  ReportServiceMocker.mockShowTrendsGraphResolved({
    trendsSettled: [],
    trendsCalculated: [],
    trendsEtfs: [],
  });

  CapitalsourceServiceMocker.mockFetchAllCapitalsource(defaultCapitalsources);
  await useCapitalsourceStore().initCapitalsourceStore();

  CrudEtfServiceMocker.mockFetchAllEtf(defaultEtfs);
  await useEtfStore().initEtfStore();
});

test("render - form initialized with default values", async () => {
  render(ShowTrends);

  await ShowTrendsView.GraphCanvas.assertNotToBeVisible();
  await ShowTrendsView.CapitalsourcesActiveCheckbox.assertChecked();
  await ShowTrendsView.EtfsActiveCheckbox.assertChecked();

  await ShowTrendsView.capitalsourceCheckbox(1).assertChecked();
  await ShowTrendsView.capitalsourceCheckbox(2).assertUnchecked();
  await ShowTrendsView.etfCheckbox(101).assertUnchecked();

  await ShowTrendsView.capitalsourceSelectedCount(1, 3).assertInDocument();
  await ShowTrendsView.etfSelectedCount(0, 2).assertInDocument();
});

test("capitalsource selection - toggle active checkbox", async () => {
  render(ShowTrends);

  await ShowTrendsView.CapitalsourcesCommand.assertIsEnabled();

  await ShowTrendsView.CapitalsourcesActiveCheckbox.click();
  await ShowTrendsView.CapitalsourcesActiveCheckbox.assertUnchecked();
  await ShowTrendsView.CapitalsourcesCommand.assertIsDisabled();

  await ShowTrendsView.CapitalsourcesActiveCheckbox.click();
  await ShowTrendsView.CapitalsourcesActiveCheckbox.assertChecked();
  await ShowTrendsView.CapitalsourcesCommand.assertIsEnabled();
});

test("etf selection - toggle active checkbox", async () => {
  render(ShowTrends);

  await ShowTrendsView.EtfsCommand.assertIsEnabled();

  await ShowTrendsView.EtfsActiveCheckbox.click();
  await ShowTrendsView.EtfsActiveCheckbox.assertUnchecked();
  await ShowTrendsView.EtfsCommand.assertIsDisabled();

  await ShowTrendsView.EtfsActiveCheckbox.click();
  await ShowTrendsView.EtfsActiveCheckbox.assertChecked();
  await ShowTrendsView.EtfsCommand.assertIsEnabled();
});

test("capitalsource selection - select all / none buttons", async () => {
  render(ShowTrends);

  // Ensure initial state is correct (1 selected from mock)
  await ShowTrendsView.capitalsourceSelectedCount(1, 3).assertInDocument();

  await ShowTrendsView.CapitalsourceSelectAllButton.click();
  await ShowTrendsView.capitalsourceCheckbox(1).assertChecked();
  await ShowTrendsView.capitalsourceCheckbox(2).assertChecked();
  await ShowTrendsView.capitalsourceCheckbox(3).assertChecked();
  await ShowTrendsView.capitalsourceSelectedCount(3, 3).assertInDocument();

  await ShowTrendsView.CapitalsourceSelectNoneButton.click();
  await ShowTrendsView.capitalsourceCheckbox(1).assertUnchecked();
  await ShowTrendsView.capitalsourceCheckbox(2).assertUnchecked();
  await ShowTrendsView.capitalsourceCheckbox(3).assertUnchecked();
  await ShowTrendsView.capitalsourceSelectedCount(0, 3).assertInDocument();
});

test("capitalsource selection - individual checkbox selection", async () => {
  render(ShowTrends);

  await ShowTrendsView.capitalsourceCheckbox(1).assertChecked(); // Initially checked from mock
  await ShowTrendsView.capitalsourceSelectedCount(1, 3).assertInDocument();

  await ShowTrendsView.capitalsourceCheckbox(2).click();
  await ShowTrendsView.capitalsourceCheckbox(2).assertChecked();
  await ShowTrendsView.capitalsourceSelectedCount(2, 3).assertInDocument();

  await ShowTrendsView.capitalsourceCheckbox(1).click();
  await ShowTrendsView.capitalsourceCheckbox(1).assertUnchecked();
  await ShowTrendsView.capitalsourceSelectedCount(1, 3).assertInDocument();
});

test("capitalsource selection - search input filters list", async () => {
  render(ShowTrends);

  await ShowTrendsView.CapitalsourceSearchInput.setValue("Cash");
  await ShowTrendsView.capitalsourceCheckbox(1).assertToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(2).assertNotToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(3).assertNotToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(1).assertToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(2).assertNotToBeInDocument(); // Element should be removed from DOM
  await ShowTrendsView.capitalsourceCheckbox(3).assertNotToBeInDocument(); // Element should be removed from DOM

  await ShowTrendsView.CapitalsourceSearchInput.setValue("");
  await ShowTrendsView.capitalsourceCheckbox(1).assertToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(2).assertToBeVisible();
  await ShowTrendsView.capitalsourceCheckbox(3).assertToBeVisible();
});

test("show trends - calls ReportService with correct parameters", async () => {
  render(ShowTrends);

  await ShowTrendsView.capitalsourceCheckbox(1).click(); // Uncheck default
  await ShowTrendsView.capitalsourceCheckbox(2).click(); // Check
  await ShowTrendsView.EtfSelectAllButton.click(); // Select all ETFs

  await ShowTrendsView.ShowTrendsButton.click();

  await assertHaveBeenCalledOnce(ReportService.showTrendsGraph);
  await assertHaveBeenCalledWith(
    ReportService.showTrendsGraph,
    expect.objectContaining({
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      selectedCapitalsourceIds: [2],
      selectedEtfIds: [101, 102],
      capitalsourcesActive: true,
      etfsActive: true,
    }),
  );
});

test("show trends - displays chart data correctly", async () => {
  ReportServiceMocker.mockShowTrendsGraphResolved({
    trendsSettled: [{ month: 1, year: 2024, amount: 100 }],
    trendsCalculated: [{ month: 2, year: 2024, amount: 200 }],
    trendsEtfs: [{ month: 1, year: 2024, amount: 50 }],
  });
  render(ShowTrends);

  await ShowTrendsView.ShowTrendsButton.click();
  await ShowTrendsView.GraphCanvas.assertToBeVisible();
});

test("show trends - handles server error", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Failed to fetch trends",
  );
  ReportServiceMocker.mockShowTrendsGraphRejected(backendError);
  render(ShowTrends);

  await ShowTrendsView.ShowTrendsButton.click();
  await ShowTrendsView.Toast.assertError("Failed to fetch trends");
  await ShowTrendsView.GraphCanvas.assertNotToBeVisible();
});

test("initial load - handles ReportService.showTrendsForm error", async () => {
  const backendError = new BackendError(
    BackendErrorType.ERROR,
    undefined,
    "Failed to load form data",
  );
  ReportServiceMocker.mockShowTrendsFormRejected(backendError);
  render(ShowTrends);

  await ShowTrendsView.Toast.assertError("Failed to load form data");
});
