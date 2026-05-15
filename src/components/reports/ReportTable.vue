<template>
  <div class="mt-8" v-if="dataLoaded">
    <div class="rounded-lg border">
      <div class="border-b text-center p-3 py-4">
        <h5 class="text-xl">
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
      <ListMoneyflowModal ref="listModal" />

      <div class="p-4 overflow-x-auto text-center" v-if="filteredMoneyflows">
        <div class="flex flex-col rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="hidden md:table-cell align-top"></TableHead>
                <TableHead class="align-top text-center">
                  <span class="hidden md:block items-center justify-center mt-1"
                    >{{ $t("Moneyflow.bookingdate") }}
                    <component
                      :is="sortIcon('bookingDate')"
                      class="inline h-4 w-4 text-primary cursor-pointer"
                      :title="$t('Moneyflow.bookingdate')"
                      :aria-label="$t('Moneyflow.bookingdate')"
                      @click="sortByColumn('bookingDate')"
                    />
                  </span>
                  <span class="block md:hidden">
                    <component
                      :is="sortIcon('bookingDate')"
                      class="inline h-4 w-4 text-primary cursor-pointer"
                      :title="$t('Moneyflow.bookingdate')"
                      :aria-label="$t('Moneyflow.bookingdate')"
                      @click="sortByColumn('bookingDate')"
                    />
                  </span>
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center align-top hidden md:table-cell"
                >
                  <span
                    class="hidden md:flex items-center justify-center gap-1 mt-1"
                  >
                    {{ $t("Moneyflow.invoicedate") }}
                    <component
                      :is="sortIcon('invoiceDate')"
                      class="inline h-4 w-4 text-primary cursor-pointer"
                      :title="$t('Moneyflow.invoicedate')"
                      :aria-label="$t('Moneyflow.invoicedate')"
                      @click="sortByColumn('invoiceDate')"
                    />
                  </span>
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center align-top"
                  colspan="2"
                >
                  <span
                    class="hidden md:flex items-center justify-center gap-1 mt-1"
                  >
                    {{ $t("General.amount") }}
                    <component
                      :is="sortIcon('amount')"
                      class="h-4 w-4 text-primary cursor-pointer shrink-0"
                      :title="$t('General.amount')"
                      :aria-label="$t('General.amount')"
                      @click="sortByColumn('amount')"
                    />
                  </span>

                  <span
                    class="flex md:hidden items-center justify-center w-full"
                  >
                    <component
                      :is="sortIcon('amount')"
                      class="h-4 w-4 text-primary cursor-pointer"
                      :title="$t('General.amount')"
                      :aria-label="$t('General.amount')"
                      @click="sortByColumn('amount')"
                    />
                  </span>
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center align-top hidden md:table-cell"
                >
                  <span
                    class="hidden md:flex items-center justify-center gap-1 mt-1"
                  >
                    {{ $t("General.contractpartner") }}
                    <component
                      :is="sortIcon('contractpartnerName')"
                      class="inline h-4 w-4 text-primary cursor-pointer"
                      :title="$t('General.contractpartner')"
                      :aria-label="$t('General.contractpartner')"
                      @click="sortByColumn('contractpartnerName')"
                    />
                  </span>
                  <div class="flex items-center w-full max-w-sm mt-1">
                    <Input
                      type="text"
                      :placeholder="$t('General.enterFilter')"
                      v-model="filterContractpartner"
                      class="h-8 rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                    />

                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      :title="$t('General.reset')"
                      :aria-label="$t('General.reset')"
                      @click="filterContractpartner = ''"
                      class="h-8 w-8 rounded-l-none border-l text-muted-foreground hover:text-foreground"
                    >
                      <X />
                    </Button>
                  </div>
                </TableHead>
                <TableHead class="font-bold border text-foreground text-center">
                  <div class="hidden md:block">
                    <span
                      class="hidden md:flex items-center justify-center gap-1 mt-1"
                    >
                      {{ $t("General.comment") }}
                      <component
                        :is="sortIcon('comment')"
                        class="inline h-4 w-4 text-primary cursor-pointer mb-1 ml-0.5"
                        :title="$t('General.comment')"
                        :aria-label="$t('General.comment')"
                        @click="sortByColumn('comment')"
                      />
                    </span>
                    <div class="flex items-center w-full max-w-sm mt-1">
                      <Input
                        type="text"
                        :placeholder="$t('General.enterFilter')"
                        v-model="filterComment"
                        class="h-8 rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        :title="$t('General.reset')"
                        :aria-label="$t('General.reset')"
                        @click="filterComment = ''"
                        class="h-8 w-8 rounded-l-none border-l text-muted-foreground hover:text-foreground"
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                  <div class="block md:hidden">
                    <component
                      :is="sortIcon('comment')"
                      class="inline h-4 w-4 text-primary cursor-pointer"
                      :title="$t('General.comment')"
                      :aria-label="$t('General.comment')"
                      @click="sortByColumn('comment')"
                    />
                  </div>
                </TableHead>

                <TableHead
                  class="font-bold border text-foreground text-center align-top hidden md:table-cell"
                >
                  <span
                    class="hidden md:flex items-center justify-center gap-1 mt-1"
                  >
                    {{ $t("General.postingAccount") }}
                    <component
                      :is="sortIcon('postingAccountName')"
                      class="inline h-4 w-4 text-primary cursor-pointer mb-1 ml-0.5"
                      :title="$t('General.postingAccount')"
                      :aria-label="$t('General.postingAccount')"
                      @click="sortByColumn('postingAccountName')"
                    />
                  </span>
                  <div class="flex items-center w-full max-w-sm mt-1">
                    <Input
                      type="text"
                      :placeholder="$t('General.enterFilter')"
                      v-model="filterPostingAccount"
                      class="h-8 rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      :title="$t('General.reset')"
                      :aria-label="$t('General.reset')"
                      @click="filterPostingAccount = ''"
                      class="h-8 w-8 rounded-l-none border-l text-muted-foreground hover:text-foreground"
                    >
                      <X />
                    </Button>
                  </div>
                </TableHead>

                <TableHead
                  class="font-bold border text-foreground text-center align-top hidden md:table-cell"
                >
                  <span
                    class="hidden md:flex items-center justify-center gap-1 mt-1"
                  >
                    {{ $t("General.capitalsource") }}
                    <component
                      :is="sortIcon('capitalsourceComment')"
                      class="inline h-4 w-4 text-primary cursor-pointer mb-1 ml-0.5"
                      :title="$t('General.capitalsource')"
                      :aria-label="$t('General.capitalsource')"
                      @click="sortByColumn('capitalsourceComment')"
                    />
                  </span>
                  <div class="flex items-center w-full max-w-sm mt-1">
                    <Input
                      type="text"
                      :placeholder="$t('General.enterFilter')"
                      v-model="filterCapitalsource"
                      class="h-8 rounded-r-none border-r-0 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:z-10"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      :title="$t('General.reset')"
                      :aria-label="$t('General.reset')"
                      @click="filterCapitalsource = ''"
                      class="h-8 w-8 rounded-l-none border-l text-muted-foreground hover:text-foreground"
                    >
                      <X />
                    </Button>
                  </div>
                </TableHead>
                <TableHead
                  class="font-bold border text-foreground text-center"
                  colspan="2"
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ReportTableRowVue
                v-for="(mmf, index) in filteredMoneyflows"
                :key="mmf.id"
                :mmf="mmf"
                :index="index"
                @show-receipt="showReceipt"
                @delete-moneyflow="deleteMoneyflow"
                @edit-moneyflow="editMoneyflow"
                @list-moneyflow="listMoneyflow"
              />
              <TableRow>
                <TableCell colspan="3" class="text-end block md:table-cell">
                  &sum;
                </TableCell>
                <TableCell colspan="2" class="text-end">
                  <u><SpanAmount :amount="amountSum" /></u>
                </TableCell>
                <TableCell colspan="6" class="block md:table-cell"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
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
        <div class="rounded-lg border">
          <div class="border-b text-center p-3">
            <h4 class="text-2xl font-bold">{{ $t("Reports.ownCapital") }}</h4>
          </div>
          <div class="p-4">
            <CapitalsourceTableVue
              :capitalsource-data="assetsTurnoverCapitalsources"
              :current-month-is-settled="currentMonthIsSettled"
            />
            <div class="flex justify-center">
              <div class="w-full max-w-lg">
                <div class="flex flex-col rounded-md border">
                  <Table
                    class="[&_tr:nth-child(even)]:bg-primary/[0.10] [&_td]:!py-1 [&_th]:!py-1"
                  >
                    <TableHeader>
                      <TableRow>
                        <TableHead id="thEmpty"></TableHead>
                        <TableHead id="thMonth">
                          {{ $t("General.month") }}
                        </TableHead>
                        <TableHead id="thYear">{{
                          $t("General.year")
                        }}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-if="currentMonthIsSettled">
                        <TableHead class="text-end" id="thFixedProfit">
                          {{ $t("Reports.fixedProfit") }}
                        </TableHead>
                        <TableCell class="text-end">
                          <SpanAmount :amount="assetsMonthlyFixedTurnover" />
                        </TableCell>
                        <TableCell class="text-end">
                          <SpanAmount :amount="assetsYearlyFixedTurnover" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead class="text-end" id="thCalculatedProfit">
                          {{ $t("Reports.calculatedProfit") }}
                        </TableHead>
                        <TableCell class="text-end">
                          <SpanAmount
                            :amount="assetsMonthlyCalculatedTurnover"
                          />
                        </TableCell>
                        <TableCell class="text-end">
                          <SpanAmount
                            :amount="report.turnoverEndOfYearCalculated"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow v-if="currentMonthIsSettled">
                        <TableHead class="text-end" id="thDifference">
                          {{ $t("Reports.difference") }}
                        </TableHead>
                        <TableCell class="text-end">
                          <SpanAmount :amount="assetsMonthlyDifference" />
                        </TableCell>
                        <TableCell class="text-end">
                          <SpanAmount :amount="assetsYearlyDifference" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
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
        <div class="rounded-lg border">
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
        <div class="rounded-lg border">
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
import {
  computed,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type PropType,
} from "vue";

import CapitalsourceTableVue from "./CapitalsourceTable.vue";
import DeleteMoneyflowModalVue from "../moneyflow/DeleteMoneyflowModal.vue";
import DivError from "../DivError.vue";
import EditMoneyflowModalVue from "../moneyflow/EditMoneyflowModal.vue";
import ReceiptModalVue from "./ReceiptModal.vue";
import ReportTableRowVue from "./ReportTableRow.vue";
import SpanAmount from "../SpanAmount.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-vue-next";

import { getMonthName } from "@/tools/views/MonthName";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { Report } from "@/model/report/Report";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";

import ReportService from "@/service/ReportService";
import ListMoneyflowModal from "../moneyflow/ListMoneyflowModal.vue";

const serverErrors = ref(new Array<string>());

const report = ref({} as Report);
const dataLoaded = ref(false);
const assetsMonthlyFixedTurnover = ref(0);
const assetsYearlyFixedTurnover = ref(0);
const assetsMonthlyCalculatedTurnover = ref(0);
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

watch(
  [
    filterContractpartner,
    filterComment,
    filterPostingAccount,
    filterCapitalsource,
  ],
  () => {
    filter();
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

const monthName = computed(() => {
  return getMonthName(report.value.month);
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
  ReportService.listReports(year, month)
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

      if (sortBy.value.size > 0) {
        const entry = sortBy.value.entries().next().value;
        if (entry) {
          sortByColumn(entry[0]);
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

  for (const reportMmf of report.value.moneyflows) {
    if (mmf.id === reportMmf.id) {
      Object.assign(reportMmf, mmf);
      break;
    }
  }
  bookCapitalsourceAmounts(mmf, false);
};
const sortIcon = (sortedField: keyof Moneyflow) => {
  if (sortBy.value.get(sortedField) === undefined) {
    return ArrowUpDown;
  } else if (sortBy.value.get(sortedField)) {
    return ArrowUp;
  }
  return ArrowDown;
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
  if (sortByField === undefined || !sortByField) {
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
