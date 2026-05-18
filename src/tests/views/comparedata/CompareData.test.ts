import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import CapitalsourceServiceMocker from "@/service/mocker/CapitalsourceServiceMocker";
import CompareDataServiceMocker from "@/service/mocker/CompareDataServiceMocker";
import MoneyflowServiceMocker from "@/service/mocker/MoneyflowServiceMocker";
import CompareDataService from "@/service/CompareDataService";
import MoneyflowService from "@/service/MoneyflowService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import {
  type UserSession,
  useUserSessionStore,
} from "@/stores/UserSessionStore";
import { assertHaveBeenCalled, assertHaveBeenCalledWith } from "@/tests/TestUtil";
import { ButtonView, InputView, ModalView } from "@/tests/TestViews";
import CompareData from "@/views/comparedata/CompareData.vue";
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@/service/CompareDataService");
vi.mock("@/service/MoneyflowService");
vi.mock("@/service/CapitalsourceService");

class CompareDataView {
  static readonly CapitalsourceIdInput = new InputView("capitalsourceCompareData-id");
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
  static readonly Modal = new ModalView("app-modal");
}

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

const ownMoneyflow = (id: number): Moneyflow => {
  return {
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
  } as Moneyflow;
};

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
  useUserSessionStore().setUserSession({ userId: 1 } as UserSession);

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
  render(CompareData);

  await assertHaveBeenCalled(CompareDataService.showCompareDataForm);
});

test("CompareData submits compare request", async () => {
  render(CompareData);

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
  render(CompareData);

  await runCompare();
  await CompareDataView.GroupNotInFileToggle.click();
  await CompareDataView.EditButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 21);
  await CompareDataView.Modal.assertOpen();
});

test("CompareData opens delete modal from not-in-file row", async () => {
  render(CompareData);

  await runCompare();
  await CompareDataView.GroupNotInFileToggle.click();
  await CompareDataView.DeleteButton.click();

  await assertHaveBeenCalledWith(MoneyflowService.fetchMoneyflow, 21);
  await CompareDataView.Modal.assertOpen();
});

test("CompareData opens create modal from source-only row", async () => {
  render(CompareData);

  await runCompare();
  await CompareDataView.GroupNotInDatabaseToggle.click();
  await CompareDataView.CreateButton.click();

  await CompareDataView.Modal.assertOpen();
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
  "CompareData zeigt nur die erwartete Ergebnisgruppe fuer %s",
  async (groupKey, expectedVisible) => {
    CompareDataServiceMocker.mockCompareDataResolved(compareDataResultOnly(groupKey));
    render(CompareData);

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

test("CompareData zeigt alle Gruppen-Toggles wenn alle Gruppen Eintraege haben", async () => {
  CompareDataServiceMocker.mockCompareDataResolved({
    compareDatasMatching: [{ moneyflow: ownMoneyflow(41), compareDataDataset }],
    compareDatasWrongCapitalsource: [
      { moneyflow: ownMoneyflow(42), compareDataDataset },
    ],
    compareDatasNotInFile: [{ moneyflow: ownMoneyflow(43) }],
    compareDatasNotInDatabase: [{ compareDataDataset }],
  });
  render(CompareData);

  await runCompare();

  await CompareDataView.GroupMatchingToggle.assertToBeVisible();
  await CompareDataView.GroupWrongCapitalsourceToggle.assertToBeVisible();
  await CompareDataView.GroupNotInFileToggle.assertToBeVisible();
  await CompareDataView.GroupNotInDatabaseToggle.assertToBeVisible();
});

test("CompareData zeigt keine Gruppen-Toggles wenn keine Daten gefunden wurden", async () => {
  CompareDataServiceMocker.mockCompareDataResolved({
    compareDatasMatching: [],
    compareDatasWrongCapitalsource: [],
    compareDatasNotInFile: [],
    compareDatasNotInDatabase: [],
  });
  render(CompareData);

  await runCompare();

  await CompareDataView.GroupMatchingToggle.assertNotToBeInDocument();
  await CompareDataView.GroupWrongCapitalsourceToggle.assertNotToBeInDocument();
  await CompareDataView.GroupNotInFileToggle.assertNotToBeInDocument();
  await CompareDataView.GroupNotInDatabaseToggle.assertNotToBeInDocument();
});





