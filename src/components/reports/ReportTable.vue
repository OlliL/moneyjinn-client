<template>
  <div class="mt-6" v-if="dataLoaded">
    <DivError :server-errors="serverErrors" />

    <ReceiptModalVue ref="receiptModal" />
    <DeleteMoneyflowModalVue
      ref="deleteModal"
      @moneyflow-deleted="moneyflowDeleted"
    />
    <EditMoneyflowModalVue
      ref="editModal"
      @moneyflow-updated="moneyflowUpdated"
      @moneyflow-receipt-deleted="moneyflowReceiptDeleted"
    />
    <ListMoneyflowModal ref="listModal" />

    <div class="pt-4">
      <ReportTableMobile
        v-model:filter-capitalsource="filterCapitalsource"
        v-model:filter-comment="filterComment"
        v-model:filter-contractpartner="filterContractpartner"
        v-model:filter-posting-account="filterPostingAccount"
        :moneyflows-count="report.moneyflows?.length || 0"
        :filtered-moneyflows="filteredMoneyflows"
        :amount-sum="amountSum"
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
        v-model:sort-by="sortBy"
        :filtered-moneyflows="filteredMoneyflows"
        :amount-sum="amountSum"
        @delete-moneyflow="deleteMoneyflow"
        @edit-moneyflow="editMoneyflow"
        @list-moneyflow="listMoneyflow"
        @show-receipt="showReceipt"
      />
    </div>
  </div>

  <div v-if="report.reportTurnoverCapitalsources">
    <div class="mt-10">
      <div class="text-center">
        <h1 class="text-3xl">{{ $t("Reports.overview") }}</h1>
      </div>
    </div>

    <div
      class="flex justify-center py-4"
      v-if="
        assetsTurnoverCapitalsources && assetsTurnoverCapitalsources.length > 0
      "
    >
      <div class="w-full max-w-7xl">
        <div class="rounded-sm border">
          <div class="border-b text-center p-3">
            <h4 class="text-2xl font-bold">{{ $t("Reports.ownCapital") }}</h4>
          </div>
          <div class="p-4">
            <CapitalsourceTableVue
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
            <h4 class="text-2xl font-bold">{{ $t("Reports.debtCapital") }}</h4>
          </div>
          <div class="p-4">
            <CapitalsourceTableVue
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
        creditTurnoverCapitalsources && creditTurnoverCapitalsources.length > 0
      "
    >
      <div class="w-full max-w-7xl">
        <div class="rounded-sm border">
          <div class="border-b text-center p-3">
            <h4 class="text-2xl font-bold">{{ $t("Reports.loans") }}</h4>
          </div>
          <div class="p-4">
            <CapitalsourceTableVue
              :capitalsource-data="creditTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { Report } from "@/model/report/Report";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
} from "vue";
import { useI18n } from "vue-i18n";
import DivError from "../DivError.vue";
import DeleteMoneyflowModalVue from "../moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "../moneyflow/EditMoneyflowModal.vue";
import ListMoneyflowModal from "../moneyflow/ListMoneyflowModal.vue";
import { default as CapitalsourceSummary } from "./CapitalsourceSummary.vue";
import CapitalsourceTableVue from "./CapitalsourceTable.vue";
import ReceiptModalVue from "./ReceiptModal.vue";
import ReportTableDesktop from "./ReportTableDesktop.vue";
import ReportTableMobile from "./ReportTableMobile.vue";
const serverErrors = ref(new Array<string>());

const report = ref({} as Report);
const dataLoaded = ref(false);

const sortBy = defineModel<Map<keyof Moneyflow, boolean>>({
  type: Object as PropType<Map<keyof Moneyflow, boolean>>,
  required: true,
});
const receiptModal = useTemplateRef<typeof ReceiptModalVue>("receiptModal");
const deleteModal =
  useTemplateRef<typeof DeleteMoneyflowModalVue>("deleteModal");
const editModal = useTemplateRef<typeof EditMoneyflowModalVue>("editModal");
const listModal = useTemplateRef<typeof ListMoneyflowModal>("listModal");

const filteredMoneyflows = ref([] as Moneyflow[]);
const { t } = useI18n();
watch(
  () => report.value.moneyflows,
  () => {
    filter();
  },
  { deep: true },
);

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
    (data.amountCurrent != undefined && data.amountCurrent != 0) ||
    (data.amountEndOfMonthFixed != undefined && data.amountEndOfMonthFixed != 0)
  );
};
const assetsTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        (data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
          data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET) &&
        capitalsourceHasMovement(data),
    );
  }
  return new Array<ReportTurnoverCapitalsource>();
});
const liabilitiesTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        (data.capitalsourceType === CapitalsourceType.RESERVE_ASSET ||
          data.capitalsourceType === CapitalsourceType.PROVISION_ASSET) &&
        capitalsourceHasMovement(data),
    );
  }
  return new Array<ReportTurnoverCapitalsource>();
});
const creditTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        data.capitalsourceType === CapitalsourceType.CREDIT &&
        capitalsourceHasMovement(data),
    );
  }
  return new Array<ReportTurnoverCapitalsource>();
});
const currentMonthIsSettled = computed(() => {
  if (dataLoaded.value && report.value.reportTurnoverCapitalsources) {
    for (let data of report.value.reportTurnoverCapitalsources) {
      if (data.amountEndOfMonthFixed) {
        return true;
      }
    }
  }
  return false;
});
const amountSum = computed(() => {
  let sum = 0;
  if (dataLoaded.value && filteredMoneyflows.value) {
    for (const mmf of filteredMoneyflows.value) {
      sum += mmf.amount;
    }
  }
  return sum;
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  ReportService.listReports(year, month)
    .then((_report) => {
      report.value = _report;

      let assetsLastAmount = 0;
      let assetsFixAmount = 0;
      if (report.value.reportTurnoverCapitalsources) {
        for (const data of report.value.reportTurnoverCapitalsources) {
          if (
            data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
          ) {
            assetsLastAmount += data.amountBeginOfMonthFixed;
            if (data.amountEndOfMonthFixed)
              assetsFixAmount = +(assetsFixAmount + data.amountEndOfMonthFixed);
          }
        }
      }

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
});
</script>
