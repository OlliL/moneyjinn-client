<template>
  <div class="row" style="margin-top: 20px" v-if="dataLoaded">
    <div class="card">
      <div class="card-header text-center p-3">
        <h5>
          {{ $t("Reports.title.report", { month: monthName, year: year }) }}
        </h5>
      </div>

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

      <div
        class="card-body table-responsive text-center"
        v-if="report.moneyflows"
      >
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th></th>
              <th>
                {{ $t("Moneyflow.bookingdate") }}
                <i
                  :class="`bi ${sortIcon('bookingDate')} link-primary`"
                  @click="sortByColumn('bookingDate')"
                ></i>
              </th>
              <th>
                {{ $t("Moneyflow.invoicedate") }}
                <i
                  :class="`bi ${sortIcon('invoiceDate')} link-primary`"
                  @click="sortByColumn('invoiceDate')"
                ></i>
              </th>
              <th colspan="2">
                {{ $t("General.amount") }}
                <i
                  :class="`bi ${sortIcon('amount')} link-primary`"
                  @click="sortByColumn('amount')"
                ></i>
              </th>
              <th>
                {{ $t("General.contractpartner") }}
                <i
                  :class="`bi ${sortIcon('contractpartnerName')} link-primary`"
                  @click="sortByColumn('contractpartnerName')"
                ></i>
              </th>
              <th>
                {{ $t("General.comment") }}
                <i
                  :class="`bi ${sortIcon('comment')} link-primary`"
                  @click="sortByColumn('comment')"
                ></i>
              </th>
              <th>
                {{ $t("General.postingAccount") }}
                <i
                  :class="`bi ${sortIcon('postingAccountName')} link-primary`"
                  @click="sortByColumn('postingAccountName')"
                ></i>
              </th>
              <th>
                {{ $t("General.capitalsource") }}
                <i
                  :class="`bi ${sortIcon('capitalsourceComment')} link-primary`"
                  @click="sortByColumn('capitalsourceComment')"
                ></i>
              </th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ReportTableRowVue
              v-for="mmf in report.moneyflows"
              :key="mmf.id"
              :mmf="mmf"
              @show-receipt="showReceipt"
              @delete-moneyflow="deleteMoneyflow"
              @edit-moneyflow="editMoneyflow"
            />
            <tr>
              <td class="text-end" colspan="3">&sum;</td>
              <td colspan="2" class="text-end">
                <u><SpanAmount :amount="amountSum" /></u>
              </td>
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-if="report.reportTurnoverCapitalsources">
    <div class="row" style="margin-top: 40px">
      <div class="col-xs-12 text-center">
        <h1>{{ $t("Reports.overview") }}</h1>
      </div>
    </div>

    <div
      class="row justify-content-md-center py-4"
      v-if="
        assetsTurnoverCapitalsources && assetsTurnoverCapitalsources.length > 0
      "
    >
      <div class="col col-xxl-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>{{ $t("Reports.ownCapital") }}</h4>
          </div>
          <div class="card-body">
            <CapitalsourceTableVue
              :capitalsource-data="assetsTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
            <div class="row justify-content-md-center">
              <div class="col col-lg-4">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th id="thEmpty"></th>
                      <th id="thMonth">{{ $t("General.month") }}</th>
                      <th id="thYear">{{ $t("General.year") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="currentMonthIsSettled">
                      <th class="text-end" id="thFixedProfit">
                        {{ $t("Reports.fixedProfit") }}
                      </th>
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyFixedTurnover" />
                      </td>
                      <td class="text-end">
                        <SpanAmount :amount="assetsYearlyFixedTurnover" />
                      </td>
                    </tr>
                    <tr>
                      <th class="text-end" id="thCalculatedProfit">
                        {{ $t("Reports.calculatedProfit") }}
                      </th>
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyCalculatedTurnover" />
                      </td>
                      <td class="text-end">
                        <SpanAmount
                          :amount="report.turnoverEndOfYearCalculated"
                        />
                      </td>
                    </tr>
                    <tr v-if="currentMonthIsSettled">
                      <th class="text-end" id="thDifference">
                        {{ $t("Reports.difference") }}
                      </th>
                      <td class="text-end">
                        <SpanAmount :amount="assetsMonthlyDifference" />
                      </td>
                      <td class="text-end">
                        <SpanAmount :amount="assetsYearlyDifference" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="row justify-content-md-center py-4"
      v-if="
        liabilitiesTurnoverCapitalsources &&
        liabilitiesTurnoverCapitalsources.length > 0
      "
    >
      <div class="col col-xxl-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>{{ $t("Reports.debtCapital") }}</h4>
          </div>
          <div class="card-body">
            <CapitalsourceTableVue
              :capitalsource-data="liabilitiesTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="row justify-content-md-center py-4"
      v-if="
        creditTurnoverCapitalsources && creditTurnoverCapitalsources.length > 0
      "
    >
      <div class="col col-xxl-8">
        <div class="card">
          <div class="card-header text-center p-3">
            <h4>{{ $t("Reports.loans") }}</h4>
          </div>
          <div class="card-body">
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
import { computed, onMounted, ref, watch } from "vue";

import CapitalsourceTableVue from "./CapitalsourceTable.vue";
import DeleteMoneyflowModalVue from "../moneyflow/DeleteMoneyflowModal.vue";
import DivError from "../DivError.vue";
import EditMoneyflowModalVue from "../moneyflow/EditMoneyflowModal.vue";
import ReceiptModalVue from "./ReceiptModal.vue";
import ReportTableRowVue from "./ReportTableRow.vue";
import SpanAmount from "../SpanAmount.vue";

import { getMonthName } from "@/tools/views/MonthName";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { Report } from "@/model/report/Report";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";

import ReportControllerHandler from "@/handler/ReportControllerHandler";

const serverErrors = ref(new Array<string>());

const report = ref({} as Report);
const dataLoaded = ref(false);
const assetsMonthlyFixedTurnover = ref(0);
const assetsYearlyFixedTurnover = ref(0);
const assetsMonthlyCalculatedTurnover = ref(0);
const sortBy = ref(new Map<string, boolean>());
const receiptModal = ref();
const deleteModal = ref();
const editModal = ref();

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

const monthName = computed(() => {
  return getMonthName(report.value.month);
});
const assetsTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
        data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET,
    );
  }
  return new Array<ReportTurnoverCapitalsource>();
});
const liabilitiesTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) =>
        data.capitalsourceType === CapitalsourceType.RESERVE_ASSET ||
        data.capitalsourceType === CapitalsourceType.PROVISION_ASSET,
    );
  }
  return new Array<ReportTurnoverCapitalsource>();
});
const creditTurnoverCapitalsources = computed(() => {
  if (dataLoaded.value) {
    return report.value.reportTurnoverCapitalsources?.filter(
      (data) => data.capitalsourceType === CapitalsourceType.CREDIT,
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
  if (dataLoaded.value && report.value.moneyflows) {
    for (const mmf of report.value.moneyflows) {
      sum += mmf.amount;
    }
  }
  return sum;
});
const assetsMonthlyDifference = computed(() => {
  return +(
    assetsMonthlyFixedTurnover.value - assetsMonthlyCalculatedTurnover.value
  );
});
const assetsYearlyDifference = computed(() => {
  return +(
    assetsYearlyFixedTurnover.value -
    (report.value.turnoverEndOfYearCalculated
      ? report.value.turnoverEndOfYearCalculated
      : 0)
  );
});

const loadData = (year: number, month: number) => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  ReportControllerHandler.listReports(year, month)
    .then((_report) => {
      report.value = _report;

      assetsMonthlyCalculatedTurnover.value = 0;

      let assetsLastAmount = 0;
      let assetsFixAmount = 0;
      if (report.value.reportTurnoverCapitalsources) {
        for (const data of report.value.reportTurnoverCapitalsources) {
          if (
            data.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
            data.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
          ) {
            assetsMonthlyCalculatedTurnover.value += +(
              data.amountEndOfMonthCalculated - data.amountBeginOfMonthFixed
            );
            assetsLastAmount += data.amountBeginOfMonthFixed;
            if (data.amountEndOfMonthFixed)
              assetsFixAmount = +(assetsFixAmount + data.amountEndOfMonthFixed);
          }
        }
      }
      assetsMonthlyFixedTurnover.value = +(assetsFixAmount - assetsLastAmount);
      assetsYearlyFixedTurnover.value = +(
        assetsFixAmount -
        (report.value.amountBeginOfYear ? report.value.amountBeginOfYear : 0)
      );

      sortBy.value.clear();
      sortBy.value.set("bookingDate", true);
      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const showReceipt = (moneyflowId: number) => {
  receiptModal.value._show(moneyflowId);
};
const deleteMoneyflow = (mmf: Moneyflow) => {
  deleteModal.value._show(mmf);
};
const editMoneyflow = (mmf: Moneyflow) => {
  editModal.value._show(mmf);
};
/**
 * recalculate End of Month amount (for matching Capitalsource),
 * recalculate End of Month amount (overall),
 * recalculate End of Year amount,
 * @param capitalsourceComment
 * @param amount
 */
const bookCapitalsourceAmounts = (mmf: Moneyflow, bookOut: boolean) => {
  const bookingDate = mmf.bookingDate;
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
      if (
        mcs.capitalsourceType === CapitalsourceType.CURRENT_ASSET ||
        mcs.capitalsourceType === CapitalsourceType.LONG_TERM_ASSET
      ) {
        assetsMonthlyCalculatedTurnover.value += amount;
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

  for (let i = 0; i < report.value.moneyflows.length; i++) {
    if (mmf.id === report.value.moneyflows[i].id) {
      report.value.moneyflows[i] = mmf;
      break;
    }
  }
  bookCapitalsourceAmounts(mmf, false);
};
const sortIcon = (sortedField: string) => {
  if (sortBy.value.get(sortedField) === undefined) {
    return "bi-caret-down-square";
  } else if (sortBy.value.get(sortedField)) {
    return "bi-caret-down-square-fill";
  }
  return "bi-caret-up-square-fill";
};
const compareColumns = (
  a: Moneyflow,
  b: Moneyflow,
  field: keyof Moneyflow,
): number => {
  let aField = a[field];
  let bField = b[field];
  if (aField === undefined || bField === undefined) return 0;
  if (typeof aField === "string" && typeof bField === "string") {
    aField = aField.toLowerCase();
    bField = bField.toLowerCase();
  }
  if (aField > bField) return 1;
  else if (bField > aField) return -1;
  return 0;
};
const sortByColumn = (field: keyof Moneyflow) => {
  let sortByField = sortBy.value.get(field);
  if (sortByField == undefined || !sortByField) {
    report.value.moneyflows.sort((a, b) => compareColumns(a, b, field));
    sortByField = true;
  } else {
    report.value.moneyflows.sort((a, b) => -1 * compareColumns(a, b, field));
    sortByField = false;
  }
  sortBy.value.clear();
  sortBy.value.set(field, sortByField);
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
