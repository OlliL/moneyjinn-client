import type { Events } from "@/model/event/Events";
import router, { Routes } from "@/router";
import EventService from "@/service/EventService";
import {
  assertHaveBeenCalled,
  assertHaveBeenCalledWith,
} from "@/tests/TestUtil";
import { ButtonView } from "@/tests/TestViews";
import AppHome from "@/views/AppHome.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, test, vi } from "vitest";
import { defineComponent } from "vue";

const { mockRouterPush } = vi.hoisted(() => ({
  mockRouterPush: vi.fn(),
}));

vi.mock("@/router", async () => {
  const actual = await vi.importActual<typeof import("@/router")>("@/router");
  return {
    ...actual,
    default: { push: mockRouterPush },
  };
});

vi.mock("@/service/EventService");

class AppHomeView {
  static readonly ImportMoneyflowsButton = new ButtonView(
    "app-home-import-moneyflows",
  );
  static readonly EditMonthlySettlementButton = new ButtonView(
    "app-home-edit-monthly-settlement",
  );
}

const renderView = (props: Record<string, unknown> = {}) => {
  render(
    defineComponent({
      setup() {
        return { props };
      },
      template: '<AppHome v-bind="props" />',
      components: { AppHome },
    }),
  );
};

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
});

test("AppHome loads event list and navigates to import moneyflows", async () => {
  vi.mocked(EventService.showEventList).mockResolvedValue({
    numberOfImportedMoneyflows: 2,
    monthlySettlementMissing: false,
  } as Events);

  renderView();

  await assertHaveBeenCalled(EventService.showEventList);
  await AppHomeView.ImportMoneyflowsButton.assertToBeVisible();
  await AppHomeView.ImportMoneyflowsButton.click();

  await assertHaveBeenCalledWith(router.push, {
    name: Routes.ImportMoneyflows,
  });
});

test("AppHome shows monthly-settlement action when settlement is missing", async () => {
  vi.mocked(EventService.showEventList).mockResolvedValue({
    numberOfImportedMoneyflows: 0,
    monthlySettlementMissing: true,
    monthlySettlementYear: 2026,
    monthlySettlementMonth: 4,
  } as Events);

  renderView();

  await assertHaveBeenCalled(EventService.showEventList);
  await AppHomeView.EditMonthlySettlementButton.assertToBeVisible();
  await AppHomeView.ImportMoneyflowsButton.assertNotToBeInDocument();
});
