import GlobalModals from "@/components/common/GlobalModals.vue";
import router, { Routes } from "@/router";
import MonthlySettlementService from "@/service/MonthlySettlementService";
import MonthlySettlementServiceMocker from "@/service/mocker/MonthlySettlementServiceMocker";
import { assertHaveBeenCalledWith, setupUserStandard } from "@/tests/TestUtil";
import {
  ButtonView,
  DeclarativeModalStub,
  MobilePopupMenu,
  ModalView,
  RowView,
} from "@/tests/TestViews";
import ListMonthlySettlements from "@/views/monthlysettlement/ListMonthlySettlements.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { defineComponent } from "vue";

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
  static readonly MobileOpenPeriodSheetButton = new ButtonView(
    "monthly-settlement-mobile-open-period-sheet",
  );
  static readonly MobilePeriodSheet = new MobilePopupMenu(
    "monthly-settlement-mobile-period-sheet",
  );
  static readonly MobileNewButton = new ButtonView(
    "monthly-settlement-mobile-new",
  );
  static readonly MobileEditButton = new ButtonView(
    "monthly-settlement-mobile-edit",
  );
  static readonly MobileDeleteButton = new ButtonView(
    "monthly-settlement-mobile-delete",
  );
  static readonly MobileYearTrigger = new ButtonView(
    "month-year-nav-mobile-year-trigger",
  );
  static readonly MobileYear2027Item = new ButtonView(
    "month-year-nav-mobile-year-item-2027",
  );
  static readonly MobileMonth2Button = new ButtonView(
    "month-year-nav-mobile-month-2",
  );
  static readonly NewButton = new ButtonView("monthly-settlement-new");
  static readonly EditButton = new ButtonView("monthly-settlement-edit");
  static readonly DeleteButton = new ButtonView("monthly-settlement-delete");
  static readonly YearTrigger = new ButtonView("month-year-nav-year-trigger");
  static readonly Year2027Item = new ButtonView(
    "month-year-nav-year-item-2027",
  );
  static readonly Month2Button = new ButtonView("month-year-nav-month-2");
  static readonly EditModal = new ModalView("app-modal-EditMonthlySettlement");
  static readonly DeleteModal = new ModalView(
    "app-modal-DeleteMonthlySettlement",
  );
  static readonly EmptyRow = new RowView("monthly-settlement-empty");
  static readonly EmptyRowDesktop = new RowView(
    "monthly-settlement-empty-desktop",
  );
  static readonly EmptyRowMobile = new RowView(
    "monthly-settlement-empty-mobile",
  );
}

const renderListMonthlySettlementsView = (
  props: {
    year?: string;
    month?: string;
  } = {},
) =>
  render(
    defineComponent({
      setup() {
        return { props };
      },
      template:
        '<div><ListMonthlySettlements v-bind="props" /><GlobalModals /></div>',
      components: { ListMonthlySettlements, GlobalModals },
    }),
    {
      global: { stubs: { ModalVue: DeclarativeModalStub } },
    },
  );

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupUserStandard();
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
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await assertHaveBeenCalledWith(
    MonthlySettlementService.getAvailableMonth,
    2026,
    1,
  );
});

test("ListMonthlySettlements opens new modal", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.NewButton.click();
  await ListMonthlySettlementsView.EditModal.assertOpen();
});

test("ListMonthlySettlements opens edit modal", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.EditButton.click();
  await ListMonthlySettlementsView.EditModal.assertOpen();
});

test("ListMonthlySettlements opens delete modal", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.DeleteButton.click();
  await ListMonthlySettlementsView.DeleteModal.assertOpen();
});

test("ListMonthlySettlements selects another year via navigator", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

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
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.Month2Button.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListMonthlySettlements,
      params: expect.objectContaining({ year: "2026", month: 2 }),
    }),
  );
});

test("ListMonthlySettlements opens new modal via mobile action", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.MobileNewButton.click();
  await ListMonthlySettlementsView.EditModal.assertOpen();
});

test("ListMonthlySettlements opens edit modal via mobile action", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.MobileEditButton.click();
  await ListMonthlySettlementsView.EditModal.assertOpen();
});

test("ListMonthlySettlements opens delete modal via mobile action", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.MobileDeleteButton.click();
  await ListMonthlySettlementsView.DeleteModal.assertOpen();
});

test("ListMonthlySettlements selects another year via mobile period sheet", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.MobileOpenPeriodSheetButton.click();
  await ListMonthlySettlementsView.MobilePeriodSheet.assertToBeVisible();
  await ListMonthlySettlementsView.MobileYearTrigger.click();
  await ListMonthlySettlementsView.MobileYear2027Item.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListMonthlySettlements,
      params: expect.objectContaining({ year: "2027" }),
    }),
  );
});

test("ListMonthlySettlements selects another month via mobile period sheet", async () => {
  renderListMonthlySettlementsView({ year: "2026", month: "1" });

  await ListMonthlySettlementsView.MobileOpenPeriodSheetButton.click();
  await ListMonthlySettlementsView.MobilePeriodSheet.assertToBeVisible();
  await ListMonthlySettlementsView.MobileMonth2Button.click();

  await assertHaveBeenCalledWith(
    router.push,
    expect.objectContaining({
      name: Routes.ListMonthlySettlements,
      params: expect.objectContaining({ year: "2026", month: 2 }),
    }),
  );
});

test("ListMonthlySettlements shows empty state for empty list (Desktop and Mobile)", async () => {
  // Arrange: Mock for empty years and months
  MonthlySettlementServiceMocker.mockGetAvailableMonth({
    allMonth: [],
    allYears: [],
    month: 0,
    year: 0,
  } as never);
  MonthlySettlementServiceMocker.mockGetMonthlySettlementList([]);

  // Act
  renderListMonthlySettlementsView({
    year: undefined,
    month: undefined,
  });

  // Assert: Empty state visible
  await ListMonthlySettlementsView.EmptyRowDesktop.assertToBeVisible();
  await ListMonthlySettlementsView.EmptyRowMobile.assertToBeVisible();
});
