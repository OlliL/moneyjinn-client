import GlobalModals from "@/components/common/GlobalModals.vue";
import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import CompareDataService from "@/service/CompareDataService";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import CompareDataServiceMocker from "@/service/mocker/CompareDataServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import MoneyflowService from "@/service/MoneyflowService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import {
  assertHaveBeenCalled,
  assertHaveBeenCalledWith,
  setupUserStandard,
} from "@/tests/TestUtil";
import {
  ButtonView,
  DeclarativeModalStub,
  InputView,
  ModalView,
} from "@/tests/TestViews";
import CompareData from "@/views/comparedata/CompareData.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";
import { defineComponent } from "vue";

vi.mock("@/service/CompareDataService");
vi.mock("@/service/MoneyflowService");
vi.mock("@/service/CapitalsourceService");

class CompareDataView {
  static readonly CapitalsourceIdInput = new InputView(
    "capitalsourceCompareData-id",
  );
  static readonly SubmitButton = new ButtonView("compare-data-submit");
  static readonly GroupMatchingToggle = new ButtonView(
    "compare-data-group-matching-toggle",
  );
  static readonly GroupWrongCapitalsourceToggle = new ButtonView(
    "compare-data-group-wrong-capitalsource-toggle",
  );
  static readonly GroupNotInFileToggle = new ButtonView(
    "compare-data-group-not-in-file-toggle",
  );
  static readonly GroupNotInDatabaseToggle = new ButtonView(
    "compare-data-group-not-in-database-toggle",
  );
  static readonly EditButton = new ButtonView("compare-data-edit-21");
  static readonly DeleteButton = new ButtonView("compare-data-delete-21");
  static readonly CreateButton = new ButtonView("compare-data-create-0");
  static readonly EditModal = new ModalView("app-modal-EditMoneyflow");
  static readonly DeleteModal = new ModalView("app-modal-DeleteMoneyflow");
}

const renderCompareDataView = (props: Record<string, unknown> = {}) =>
  render(
    defineComponent({
      setup() {
        return { props };
      },
      template: '<div><CompareData v-bind="props" /><GlobalModals /></div>',
      components: { CompareData, GlobalModals },
    }),
    {
      global: { stubs: { ModalVue: DeclarativeModalStub } },
    },
  );

const compareDataDataset: CompareDataDataset = {
  bookingDate: new Date("2026-02-05"),
  invoiceDate: new Date("2026-02-05"),
  amount: -42,
  partner: "Landlord",
  contractpartnerId: 3,
  contractpartnerName: "Landlord",
  comment: "Rent import",
  moneyflowComment: "Rent import",
  postingAccountName: "Rent",
  postingAccountId: 5,
};

const ownMoneyflow = (id: number): Moneyflow =>
  ({
    id,
    userId: 1,
    bookingDate: new Date("2026-02-05"),
    invoiceDate: new Date("2026-02-05"),
    amount: -42,
    contractpartnerId: 3,
    contractpartnerName: "Landlord",
    capitalsourceId: 1,
    capitalsourceComment: "Main account",
    postingAccountId: 5,
    postingAccountName: "Rent",
    comment: "Rent payment",
    private: false,
    hasReceipt: false,
  }) as Moneyflow;

const compareDataResult: CompareDataResult = {
  compareDatasMatching: [],
  compareDatasWrongCapitalsource: [],
  compareDatasNotInFile: [{ moneyflow: ownMoneyflow(21) }],
  compareDatasNotInDatabase: [{ compareDataDataset }],
};

const compareDataResultOnly = (
  key: keyof CompareDataResult,
): CompareDataResult => {
  const result: CompareDataResult = {
    compareDatasMatching: [],
    compareDatasWrongCapitalsource: [],
    compareDatasNotInFile: [],
    compareDatasNotInDatabase: [],
  };

  switch (key) {
    case "compareDatasMatching":
      result.compareDatasMatching = [
        { moneyflow: ownMoneyflow(31), compareDataDataset },
      ];
      break;
    case "compareDatasWrongCapitalsource":
      result.compareDatasWrongCapitalsource = [
        { moneyflow: ownMoneyflow(32), compareDataDataset },
      ];
      break;
    case "compareDatasNotInFile":
      result.compareDatasNotInFile = [{ moneyflow: ownMoneyflow(33) }];
      break;
    case "compareDatasNotInDatabase":
      result.compareDatasNotInDatabase = [{ compareDataDataset }];
      break;
  }

  return result;
};

const assertGroupToggleVisibility = async (
  group: ButtonView,
  shouldBeVisible: boolean,
) => {
  if (shouldBeVisible) {
    await group.assertToBeVisible();
    return;
  }

  await group.assertNotToBeInDocument();
};

const waitForFormReady = async () => {
  await assertHaveBeenCalled(CompareDataService.showCompareDataForm);
  await CompareDataView.CapitalsourceIdInput.assertValue("1");
};

const runCompare = async () => {
  await waitForFormReady();
  await CompareDataView.SubmitButton.click();
};

beforeEach(async () => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  setupUserStandard();

  CapitalsourceServiceMocker.mockFetchAllCapitalsource([
    {
      id: 1,
      userId: 1,
      comment: "Main account",
      validFrom: new Date("2010-01-01"),
      validTil: new Date("2099-12-31"),
      groupUse: false,
    } as never,
  ]);
  await useCapitalsourceStore().initCapitalsourceStore();

  CompareDataServiceMocker.mockShowCompareDataFormResolved({
    selectedSourceIsImport: true,
    selectedCompareDataFormat: 1,
    selectedCapitalSourceId: 1,
    compareDataFormats: [{ formatId: 1, name: "CSV" }],
  } as CompareDataParameter);
  CompareDataServiceMocker.mockCompareDataResolved(compareDataResult);
  MoneyflowServiceMocker.mockFetchMoneyflowById(ownMoneyflow);
});

test("CompareData calls showCompareDataForm on mount", async () => {
  renderCompareDataView();

  await assertHaveBeenCalled(CompareDataService.showCompareDataForm);
});

test("CompareData submits compare request", async () => {
  renderCompareDataView();

  await runCompare();

  await assertHaveBeenCalledWith(
    CompareDataService.compareData,
    expect.objectContaining({
      selectedSourceIsImport: true,
      selectedCapitalSourceId: 1,
      startDate: expect.any(Date),
      endDate: expect.any(Date),
    }),
  );
});

test("CompareData opens edit modal from not-in-file row", async () => {
  renderCompareDataView();

  await runCompare();
  await CompareDataView.GroupNotInFileToggle.click();
  await CompareDataView.EditButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 21);
  await CompareDataView.EditModal.assertOpen();
});

test("CompareData opens delete modal from not-in-file row", async () => {
  renderCompareDataView();

  await runCompare();
  await CompareDataView.GroupNotInFileToggle.click();
  await CompareDataView.DeleteButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 21);
  await CompareDataView.DeleteModal.assertOpen();
});

test("CompareData opens create modal from source-only row", async () => {
  renderCompareDataView();

  await runCompare();
  await CompareDataView.GroupNotInDatabaseToggle.click();
  await CompareDataView.CreateButton.click();

  await CompareDataView.EditModal.assertOpen();
});

test.each([
  [
    "compareDatasMatching",
    {
      matching: true,
      wrongCapitalsource: false,
      notInFile: false,
      notInDatabase: false,
    },
  ],
  [
    "compareDatasWrongCapitalsource",
    {
      matching: false,
      wrongCapitalsource: true,
      notInFile: false,
      notInDatabase: false,
    },
  ],
  [
    "compareDatasNotInFile",
    {
      matching: false,
      wrongCapitalsource: false,
      notInFile: true,
      notInDatabase: false,
    },
  ],
  [
    "compareDatasNotInDatabase",
    {
      matching: false,
      wrongCapitalsource: false,
      notInFile: false,
      notInDatabase: true,
    },
  ],
] as const)(
  "CompareData only shows the expected result group for %s",
  async (groupKey, expectedVisible) => {
    CompareDataServiceMocker.mockCompareDataResolved(
      compareDataResultOnly(groupKey),
    );
    renderCompareDataView();

    await runCompare();

    await assertGroupToggleVisibility(
      CompareDataView.GroupMatchingToggle,
      expectedVisible.matching,
    );
    await assertGroupToggleVisibility(
      CompareDataView.GroupWrongCapitalsourceToggle,
      expectedVisible.wrongCapitalsource,
    );
    await assertGroupToggleVisibility(
      CompareDataView.GroupNotInFileToggle,
      expectedVisible.notInFile,
    );
    await assertGroupToggleVisibility(
      CompareDataView.GroupNotInDatabaseToggle,
      expectedVisible.notInDatabase,
    );
  },
);

test("CompareData shows all group toggles when every group has entries", async () => {
  CompareDataServiceMocker.mockCompareDataResolved({
    compareDatasMatching: [{ moneyflow: ownMoneyflow(41), compareDataDataset }],
    compareDatasWrongCapitalsource: [
      { moneyflow: ownMoneyflow(42), compareDataDataset },
    ],
    compareDatasNotInFile: [{ moneyflow: ownMoneyflow(43) }],
    compareDatasNotInDatabase: [{ compareDataDataset }],
  });
  renderCompareDataView();

  await runCompare();

  await CompareDataView.GroupMatchingToggle.assertToBeVisible();
  await CompareDataView.GroupWrongCapitalsourceToggle.assertToBeVisible();
  await CompareDataView.GroupNotInFileToggle.assertToBeVisible();
  await CompareDataView.GroupNotInDatabaseToggle.assertToBeVisible();
});

test("CompareData shows no group toggles when no data was found", async () => {
  CompareDataServiceMocker.mockCompareDataResolved({
    compareDatasMatching: [],
    compareDatasWrongCapitalsource: [],
    compareDatasNotInFile: [],
    compareDatasNotInDatabase: [],
  });
  renderCompareDataView();

  await runCompare();

  await CompareDataView.GroupMatchingToggle.assertNotToBeInDocument();
  await CompareDataView.GroupWrongCapitalsourceToggle.assertNotToBeInDocument();
  await CompareDataView.GroupNotInFileToggle.assertNotToBeInDocument();
  await CompareDataView.GroupNotInDatabaseToggle.assertNotToBeInDocument();
});
