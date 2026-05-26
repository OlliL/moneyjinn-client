<template>
  <div v-if="dataLoaded">
    <DivError :server-errors="serverErrors" />

    <ListMoneyflowModalMobile
      ref="listModal"
      @show-receipt="showReceipt"
      v-if="!desktop"
    />
    <ListMoneyflowModalDesktop ref="listModal" v-if="desktop" />
    <DeleteMoneyflowModalVue
      ref="deleteModal"
      @moneyflow-deleted="moneyflowDeleted"
    />
    <EditMoneyflowModalVue
      ref="editModal"
      @moneyflow-updated="moneyflowUpdated"
      @moneyflow-receipt-deleted="moneyflowReceiptDeleted"
      @show-receipt="showReceipt"
    />

    <ReceiptModalVue ref="receiptModal" />

    <div>
      <ReportTableMobile
        v-model:filter-capitalsource="filterCapitalsource"
        v-model:filter-comment="filterComment"
        v-model:filter-contractpartner="filterContractpartner"
        v-model:filter-posting-account="filterPostingAccount"
        :moneyflows-count="report.moneyflows?.length || 0"
        :sort-by="sortBy"
        :moneyflows="sortedMoneyflows"
        :amount-sum="amountSum"
        @sort-by-column="sortByColumn"
        @delete-moneyflow="deleteMoneyflow"
        @edit-moneyflow="editMoneyflow"
        @list-moneyflow="listMoneyflow"
        @show-receipt="showReceipt"
      />

      <ReportTableDesktop
        v-model:filter-capitalsource="filterCapitalsource"
        v-model:filter-comment="filterComment"
        v-model:filter-contractpartner="filterContractpartner"
        v-model:filter-posting-account="filterPostingAccount"
        :sort-by="sortBy"
        :moneyflows="sortedMoneyflows"
        :amount-sum="amountSum"
        @sort-by-column="sortByColumn"
        @delete-moneyflow="deleteMoneyflow"
        @edit-moneyflow="editMoneyflow"
        @list-moneyflow="listMoneyflow"
        @show-receipt="showReceipt"
      />
    </div>
  </div>

  <div v-if="report.reportTurnoverCapitalsources">
    <div class="mt-10 hidden md:block">
      <div class="text-center">
        <h1 class="text-3xl">{{ $t("Reports.overview") }}</h1>
      </div>
    </div>

    <!-- Desktop View for Capitalsource Overview -->
    <template v-if="desktop">
      <div
        class="flex justify-center py-4"
        v-if="
          assetsTurnoverCapitalsources &&
          assetsTurnoverCapitalsources.length > 0
        "
      >
        <div class="w-full max-w-7xl">
          <div class="rounded-sm border">
            <div class="border-b text-center p-3">
              <h4 class="text-2xl font-bold">{{ $t("Reports.ownCapital") }}</h4>
            </div>
            <div class="p-4">
              <CapitalsourceTableDesktop
                :capitalsource-data="assetsTurnoverCapitalsources"
                :current-month-is-settled="currentMonthIsSettled"
              />
            </div>
            <CapitalsourceSummary :report="report" />
          </div>
        </div>
      </div>

      <div
        class="flex justify-center py-4"
        v-if="
          liabilitiesTurnoverCapitalsources &&
          liabilitiesTurnoverCapitalsources.length > 0
        "
      >
        <div class="w-full max-w-7xl">
          <div class="rounded-sm border">
            <div class="border-b text-center p-3">
              <h4 class="text-2xl font-bold">
                {{ $t("Reports.debtCapital") }}
              </h4>
            </div>
            <div class="p-4">
              <CapitalsourceTableDesktop
                :capitalsource-data="liabilitiesTurnoverCapitalsources"
                :current-month-is-settled="currentMonthIsSettled"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex justify-center py-4"
        v-if="
          creditTurnoverCapitalsources &&
          creditTurnoverCapitalsources.length > 0
        "
      >
        <div class="w-full max-w-7xl">
          <div class="rounded-sm border">
            <div class="border-b text-center p-3">
              <h4 class="text-2xl font-bold">{{ $t("Reports.loans") }}</h4>
            </div>
            <div class="p-4">
              <CapitalsourceTableDesktop
                :capitalsource-data="creditTurnoverCapitalsources"
                :current-month-is-settled="currentMonthIsSettled"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Mobile View for Capitalsource Overview -->
    <template v-else>
      <div class="w-full max-w-md mx-auto px-2 space-y-3">
        <Accordion type="single" collapsible class="w-full space-y-3">
          <CapitalsourceTableMobile
            v-if="
              assetsTurnoverCapitalsources &&
              assetsTurnoverCapitalsources.length > 0
            "
            title-key="Reports.ownCapital"
            :capitalsource-data="assetsTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
          />
          <CapitalsourceTableMobile
            v-if="
              liabilitiesTurnoverCapitalsources &&
              liabilitiesTurnoverCapitalsources.length > 0
            "
            title-key="Reports.debtCapital"
            :capitalsource-data="liabilitiesTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
          />
          <CapitalsourceTableMobile
            v-if="
              creditTurnoverCapitalsources &&
              creditTurnoverCapitalsources.length > 0
            "
            title-key="Reports.loans"
            :capitalsource-data="creditTurnoverCapitalsources"
            :current-month-is-settled="currentMonthIsSettled"
          />
        </Accordion>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import ListMoneyflowModalDesktop from "@/components/moneyflow/ListMoneyflowModalDesktop.vue"; // Keep for desktop
import ListMoneyflowModalMobile from "@/components/moneyflow/ListMoneyflowModalMobile.vue"; // Keep for mobile
import ReceiptModalVue from "@/components/reports/ReceiptModal.vue";
import { Accordion } from "@/components/ui/accordion"; // Import Accordion
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { Report } from "@/model/report/Report";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
} from "vue";
import CapitalsourceSummary from "./CapitalsourceSummary.vue";
import CapitalsourceTableDesktop from "./CapitalsourceTableDesktop.vue";
import CapitalsourceTableMobile from "./CapitalsourceTableMobile.vue";
import ReportTableDesktop from "./ReportTableDesktop.vue";
import ReportTableMobile from "./ReportTableMobile.vue";

const serverErrors = ref(new Array<string>());
const desktop = isDesktop();

const report = ref({} as Report);
const dataLoaded = defineModel("dataLoaded", {
  type: Boolean,
  required: true,
});

const sortBy = defineModel<Map<keyof Moneyflow, boolean>>("sortBy", {
  type: Object as PropType<Map<keyof Moneyflow, boolean>>,
  required: true,
});
const receiptModal = useTemplateRef<typeof ReceiptModalVue>("receiptModal");
const deleteModal =
  useTemplateRef<typeof DeleteMoneyflowModalVue>("deleteModal");
const editModal = useTemplateRef<typeof EditMoneyflowModalVue>("editModal");
const listModal = useTemplateRef<typeof ListMoneyflowModalDesktop>("listModal");

const filteredMoneyflows = ref([] as Moneyflow[]);
watch(
  () => report.value.moneyflows,
  () => {
    filter();
  },
  { deep: true },
);

const sortedMoneyflows = computed(() => {
  const result = [...filteredMoneyflows.value];
  if (sortBy.value.size > 0) {
    const entry = sortBy.value.entries().next().value;
    if (entry) {
      const field = entry[0] as keyof Moneyflow;
      const ascending = entry[1] === true;
      result.sort((a, b) => {
        return (ascending ? 1 : -1) * compareColumns(a, b, field);
      });
    }
  }
  return result;
});

const compareColumns = (
  a: Moneyflow,
  b: Moneyflow,
  field: keyof Moneyflow,
): number => {
  const aVal = a[field];
  const bVal = b[field];

  let result = 0;
  if (aVal === undefined || aVal === null) {
    result = 1;
  } else if (bVal === undefined || bVal === null) {
    result = -1;
  } else if (typeof aVal === "string" && typeof bVal === "string") {
    result = aVal.localeCompare(bVal, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  } else if (aVal > bVal) {
    result = 1;
  } else if (aVal < bVal) {
    result = -1;
  }

  if (result === 0 && field !== "id") {
    return a.id > b.id ? 1 : -1;
  }
  return result;
};

const sortByColumn = (field: keyof Moneyflow) => {
  let sortByField = sortBy.value.get(field);
  if (sortByField === undefined || !sortByField) {
    sortByField = true;
  } else {
    sortByField = false;
  }
  sortBy.value.clear();
  sortBy.value.set(field, sortByField);
};

const filterContractpartner = ref("");
const filterComment = ref("");
const filterPostingAccount = ref("");
const filterCapitalsource = ref("");
const filter = () => {
  filteredMoneyflows.value = report.value.moneyflows.filter((mmf) => {
    return (
      mmf.contractpartnerName
        ?.toLowerCase()
        .includes(filterContractpartner.value.toLowerCase()) &&
      mmf.comment?.toLowerCase().includes(filterComment.value.toLowerCase()) &&
      mmf.postingAccountName
        ?.toLowerCase()
        .includes(filterPostingAccount.value.toLowerCase()) &&
      mmf.capitalsourceComment
        ?.toLowerCase()
        .includes(filterCapitalsource.value.toLowerCase())
    );
  });
};

let debounceTimeout: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => {
  globalThis.clearTimeout(debounceTimeout);
});
watch(
  [
    filterContractpartner,
    filterComment,
    filterPostingAccount,
    filterCapitalsource,
  ],
  () => {
    globalThis.clearTimeout(debounceTimeout);
    debounceTimeout = globalThis.setTimeout(() => {
      filter();
    }, 300);
  },
);

const props = defineProps({
  year: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

const capitalsourceHasMovement = (
  data: ReportTurnoverCapitalsource,
): boolean => {
  return (
    data.amountBeginOfMonthFixed != 0 ||
    data.amountEndOfMonthCalculated != 0 ||
    !!data.amountCurrent ||
    !!data.amountEndOfMonthFixed
  );
};

const filterCapitalsourcesByTypes = (types: CapitalsourceType[]) => {
  if (!dataLoaded.value) return [];
  return (
    report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        types.includes(data.capitalsourceType) &&
        capitalsourceHasMovement(data),
    ) ?? []
  );
};

const assetsTurnoverCapitalsources = computed(() =>
  filterCapitalsourcesByTypes([
    CapitalsourceType.CURRENT_ASSET,
    CapitalsourceType.LONG_TERM_ASSET,
  ]),
);
const liabilitiesTurnoverCapitalsources = computed(() =>
  filterCapitalsourcesByTypes([
    CapitalsourceType.RESERVE_ASSET,
    CapitalsourceType.PROVISION_ASSET,
  ]),
);
const creditTurnoverCapitalsources = computed(() =>
  filterCapitalsourcesByTypes([CapitalsourceType.CREDIT]),
);

const currentMonthIsSettled = computed(() => {
  return !!(
    dataLoaded.value &&
    report.value.reportTurnoverCapitalsources?.some(
      (data) => !!data.amountEndOfMonthFixed,
    )
  );
});

const amountSum = computed(() => {
  if (!dataLoaded.value || !filteredMoneyflows.value) return 0;
  return filteredMoneyflows.value.reduce((sum, mmf) => sum + mmf.amount, 0);
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  ReportService.listReports(year, month)
    .then((_report) => {
      report.value = _report;
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const showReceipt = (moneyflowId: number) => {
  receiptModal.value?._show(moneyflowId);
};
const deleteMoneyflow = (mmf: Moneyflow) => {
  deleteModal.value?._show(mmf);
};
const editMoneyflow = (mmf: Moneyflow) => {
  editModal.value?._show(mmf);
};
const listMoneyflow = (mmf: Moneyflow) => {
  listModal.value?._show(mmf);
};
/**
 * Recalculate end-of-month amounts (matching capitalsource and overall)
 * and end-of-year amount when a moneyflow is added/removed.
 * @param mmf moneyflow entry to book in/out
 * @param bookOut true to subtract values, false to add values
 */
const bookCapitalsourceAmounts = (mmf: Moneyflow, bookOut: boolean) => {
  const bookingDate = new Date(mmf.bookingDate);
  bookingDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const capitalsourceComment = mmf.capitalsourceComment;
  let direction = bookOut ? -1 : 1;
  const amount = mmf.amount * direction;

  report.value.reportTurnoverCapitalsources
    ?.filter((mcs) => mcs.capitalsourceComment === capitalsourceComment)
    .forEach((mcs) => {
      mcs.amountEndOfMonthCalculated += amount;
      if (
        !mcs.amountCurrentState &&
        mcs.amountCurrent &&
        bookingDate <= today
      ) {
        mcs.amountCurrent += amount;
      }
    });

  if (report.value.turnoverEndOfYearCalculated)
    report.value.turnoverEndOfYearCalculated += amount;
};
const moneyflowDeleted = (mmf: Moneyflow) => {
  bookCapitalsourceAmounts(mmf, true);
  report.value.moneyflows = report.value.moneyflows.filter((originalMmf) => {
    return mmf.id !== originalMmf.id;
  });
};
const moneyflowReceiptDeleted = (mmfId: number) => {
  const oldMmf = report.value.moneyflows.find(
    (originalMmf) => mmfId === originalMmf.id,
  );
  if (oldMmf) oldMmf.hasReceipt = false;
};
const moneyflowUpdated = (mmf: Moneyflow) => {
  const oldMmf = report.value.moneyflows.find(
    (originalMmf) => mmf.id === originalMmf.id,
  );
  if (oldMmf) {
    bookCapitalsourceAmounts(oldMmf, true);
  }

  for (const reportMmf of report.value.moneyflows) {
    if (mmf.id === reportMmf.id) {
      Object.assign(reportMmf, mmf);
      break;
    }
  }
  bookCapitalsourceAmounts(mmf, false);
};

watch(
  () => ({
    year: props.year,
    month: props.month,
  }),
  (data) => {
    if (data.year && data.month) loadData(+data.year, +data.month);
  },
);

onMounted(() => {
  loadData(+props.year, +props.month);
  if (sortBy.value.size > 0) {
    const entry = sortBy.value.entries().next().value;
    if (entry) {
      sortByColumn(entry[0]);
    }
  }
});
</script>
