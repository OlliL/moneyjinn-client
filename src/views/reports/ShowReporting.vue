<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">
        {{ $t("Reports.title.costReporting") }}
      </h4>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div
        class="w-full max-w-5xl rounded-lg border bg-card text-card-foreground shadow-sm p-4"
      >
        <form @submit.prevent="showReportingGraph">
          <div class="space-y-4">
            <div class="grid gap-3 md:grid-cols-12">
              <div class="md:col-span-4" v-show="!groupByYear">
                <InputDate
                  v-model="startDateMonth"
                  :validation-schema-ref="schema.startDateMonth"
                  id="startDateMonth"
                  pickMode="month"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="md:col-span-4" v-show="!groupByYear">
                <InputDate
                  v-model="endDateMonth"
                  :validation-schema-ref="schema.endDateMonth"
                  id="endDateMonth"
                  pickMode="month"
                  :field-label="$t('General.endDate')"
                />
              </div>

              <div class="md:col-span-4" v-show="groupByYear">
                <InputDate
                  v-model="startDateYear"
                  :validation-schema-ref="schema.startDateYear"
                  id="startDateYear"
                  pickMode="year"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="md:col-span-4" v-show="groupByYear">
                <InputDate
                  v-model="endDateYear"
                  :validation-schema-ref="schema.endDateYear"
                  id="endDateYear"
                  pickMode="year"
                  :field-label="$t('General.endDate')"
                />
              </div>
              <div class="md:col-span-4 space-y-2 pt-2">
                <div class="flex items-center gap-2 text-left">
                  <Switch
                    id="showreppostingaccountmode"
                    v-model="singlePostingAccounts"
                  />
                  <Label
                    for="showreppostingaccountmode"
                    class="cursor-pointer text-sm font-medium select-none"
                  >
                    {{ singlePostingAccountsLabel }}
                  </Label>
                </div>
                <div class="flex items-center gap-2 text-left">
                  <Switch id="showrepmonth" v-model="groupByYear" />
                  <Label
                    for="showrepmonth"
                    class="cursor-pointer text-sm font-medium select-none"
                  >
                    {{ groupByYearLabel }}
                  </Label>
                </div>
              </div>
            </div>

            <div
              class="grid gap-3 md:grid-cols-12"
              v-show="!singlePostingAccounts"
            >
              <div
                class="md:col-span-12 flex flex-row items-center justify-between gap-4"
              >
                <div class="flex-1">
                  <Label
                    for="postingAccountIdsYes"
                    class="text-left ml-1 pb-2"
                    >{{ errorDatasPostingAccountsYes.fieldLabel }}</Label
                  >
                  <select
                    v-model="selectedPostingAccountsYes"
                    id="postingAccountIdsYes"
                    name="postingAccountIdsYes"
                    :class="
                      'w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-40' +
                      errorDatasPostingAccountsYes.inputClass
                    "
                    multiple
                    size="5"
                  >
                    <option
                      v-for="postingAccount of postingAccountsYes"
                      :key="postingAccount.id"
                      :value="postingAccount.id"
                    >
                      {{ postingAccount.name }}
                    </option>
                  </select>
                </div>

                <div
                  class="w-20 flex flex-col items-center justify-center gap-2 pt-5"
                >
                  <Button
                    type="button"
                    variant="outline"
                    class="h-8 w-8"
                    @click="removeAllPostingAccounts"
                  >
                    <ChevronsRight class="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    class="h-8 w-8"
                    @click="removeSelectedPostingAccounts"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    class="h-8 w-8"
                    @click="addSelectedPostingAccounts"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    class="h-8 w-8"
                    @click="addAllPostingAccounts"
                  >
                    <ChevronsLeft class="h-4 w-4" />
                  </Button>
                </div>

                <div class="flex-1">
                  <Label
                    for="postingAccountIdsNo"
                    class="text-left ml-1 pb-2"
                    >{{ $t("Reports.excluded") }}</Label
                  >
                  <select
                    v-model="selectedPostingAccountsNo"
                    id="postingAccountIdsNo"
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-40"
                    multiple
                    size="5"
                  >
                    <option
                      v-for="postingAccount of postingAccountsNo"
                      :key="postingAccount.id"
                      :value="postingAccount.id"
                    >
                      {{ postingAccount.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div
              class="flex justify-center mt-3"
              v-show="singlePostingAccounts"
            >
              <div class="w-full sm:w-1/2">
                <SelectPostingAccount
                  v-model="selectedPostingAccount"
                  :validation-schema-ref="schema.selectedPostingAccount"
                  id-suffix="ShowReporting"
                  :field-label="$t('General.postingAccount')"
                />
              </div>
            </div>

            <div class="mt-3 flex justify-center">
              <ButtonSubmit :button-label="$t('General.show')" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex justify-center" style="position: relative; height: 55vh">
      <div class="w-full lg:w-10/12">
        <Bar
          :data="chartData"
          :options="chartOptions"
          v-if="reportingGraphLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { Bar } from "vue-chartjs";
import { useI18n } from "vue-i18n";
import { any, date, number, object } from "zod";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";
import InputDate from "@/components/InputDate.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";

import { formatNumber } from "@/tools/views/FormatNumber";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";
import { getMonthName } from "@/tools/views/MonthName";
import { globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { toFixed } from "@/tools/math";

import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ReportingParameter } from "@/model/report/ReportingParameter";
import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";

import ReportService from "@/service/ReportService";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";
import Label from "@/components/ui/label/Label.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const dataLoaded = ref(false);
const reportingGraphLoaded = ref(false);
const groupByYear = ref(false);
const singlePostingAccounts = ref(false);
const startDateMonth = ref(new Date());
const endDateMonth = ref(new Date());
const startDateYear = ref(new Date());
const endDateYear = ref(new Date());

const postingAccounts = ref(new Array<PostingAccount>());
const postingAccountsNo = ref(new Array<PostingAccount>());
const selectedPostingAccountsYes = ref(new Array<number>());
const selectedPostingAccountsNo = ref(new Array<number>());
const selectedPostingAccount = ref(0);
const chartData = ref({
  labels: new Array<string>(),
  datasets: [
    {
      data: new Array<number | null>(),
      backgroundColor: new Array<string>(),
    },
  ],
} as ChartData);
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "",
    },
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";

          if (context.parsed.y !== null) {
            label += formatNumber(+context.parsed.y, 2) + currency;
          }
          return label;
        },
      },
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },

  scales: {
    y: {
      ticks: {
        callback: function (value: any) {
          return formatNumber(+value, 0) + currency;
        },
      },
    },
  },
});

const currency = t("General.currency");
const startDateSchema = date(globErr(t("General.validation.startDate")));
const endDateSchema = date(globErr(t("General.validation.endDate")));
const optionalSchema = any().optional();
const schema = {
  startDateMonth: computed(() =>
    groupByYear.value ? optionalSchema : startDateSchema,
  ),
  endDateMonth: computed(() =>
    groupByYear.value ? optionalSchema : endDateSchema,
  ),
  startDateYear: computed(() =>
    groupByYear.value ? startDateSchema : optionalSchema,
  ),
  endDateYear: computed(() =>
    groupByYear.value ? endDateSchema : optionalSchema,
  ),
  selectedPostingAccount: computed(() =>
    singlePostingAccounts.value
      ? number(globErr(t("Moneyflow.validation.postingAccountId"))).gt(0)
      : optionalSchema,
  ),
};

const postingAccountIdsYesSchema = computed(() =>
  singlePostingAccounts.value
    ? toTypedSchema(optionalSchema)
    : toTypedSchema(
        object({ id: number() })
          .array()
          .min(1, t("Moneyflow.validation.postingAccountId")),
      ),
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type ChartDataDataset = {
  data: Array<number | null>;
  backgroundColor: Array<string>;
};
type ChartData = {
  labels: Array<string>;
  datasets: Array<ChartDataDataset>;
};

const { handleSubmit, values, setFieldTouched } = useForm();

const {
  value: postingAccountsYes,
  meta: postingAccountsYesMeta,
  errorMessage,
  setState,
} = useField<Array<PostingAccount>>(
  "postingAccountIdsYes",
  postingAccountIdsYesSchema,
  { initialValue: new Array<PostingAccount>(), syncVModel: true },
);

const errorDatasPostingAccountsYes = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    postingAccountsYesMeta.touched,
    t("Reports.included"),
    errorMessage.value,
  );
});

onMounted(() => {
  loadData();
});

const groupByYearLabel = computed(() => {
  return groupByYear.value
    ? t("Reports.aggregationOnYears")
    : t("Reports.aggregationOnMonths");
});
const singlePostingAccountsLabel = computed(() => {
  return singlePostingAccounts.value
    ? t("Reports.singlePostingAccount")
    : t("Reports.multiplePostingAccounts");
});

const loadData = () => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  ReportService.showReportingForm()
    .then((reportingParameter) => {
      const minDate = reportingParameter.startDate;
      const maxDate = reportingParameter.endDate;

      if (minDate) {
        startDateMonth.value = new Date(minDate);
        startDateYear.value = new Date(minDate);
      }
      if (maxDate) {
        endDateMonth.value = new Date(maxDate);
        endDateYear.value = new Date(maxDate);
      }

      postingAccountsYes.value = reportingParameter.selectedPostingAccounts;
      postingAccountsNo.value =
        reportingParameter.unselectedPostingAccounts ?? [];
      postingAccounts.value = postingAccountsYes.value.concat(
        postingAccountsNo.value,
      );
      dataLoaded.value = true;
      Object.keys(values).forEach((field) => setFieldTouched(field, false));
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const movePostingAccounts = (
  from: Array<PostingAccount>,
  to: Array<PostingAccount>,
  toBeMovedIds: Array<number>,
): Array<PostingAccount> => {
  const toBeMoved = from.filter((mpa) =>
    toBeMovedIds.find((id) => id == mpa.id),
  );
  const newFrom = from.filter((mpa) => !toBeMovedIds.includes(mpa.id));
  for (let mpa of toBeMoved) {
    to.push(mpa);
  }
  to.sort((a, b) => a.name.localeCompare(b.name));
  setState({ touched: true });
  return newFrom;
};
const removeAllPostingAccounts = () => {
  postingAccountsNo.value = postingAccounts.value;
  postingAccountsYes.value = new Array<PostingAccount>();
  setState({ touched: true });
};
const removeSelectedPostingAccounts = () => {
  postingAccountsYes.value = movePostingAccounts(
    postingAccountsYes.value,
    postingAccountsNo.value,
    selectedPostingAccountsYes.value,
  );
  selectedPostingAccountsYes.value = [];
};
const addAllPostingAccounts = () => {
  postingAccountsNo.value = [];
  postingAccountsYes.value = postingAccounts.value;
  setState({ touched: true });
};
const addSelectedPostingAccounts = () => {
  postingAccountsNo.value = movePostingAccounts(
    postingAccountsNo.value,
    postingAccountsYes.value,
    selectedPostingAccountsNo.value,
  );
  selectedPostingAccountsNo.value = [];
};
const randomColor = () => {
  const possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D"];
  let color = "#";
  for (let i = 1; i <= 6; i++) {
    const rnd = Math.floor(Math.random() * 12) + 1;
    color += possibilities[rnd];
  }
  return color;
};
const retrieveGraphData = (
  reportingParameter: ReportingParameter,
): Promise<Array<ReportingMonthAmount>> => {
  if (groupByYear.value) {
    return ReportService.showYearlyReportGraph(reportingParameter);
  }
  return ReportService.showMonthlyReportGraph(reportingParameter);
};
const makeChartTitle = (reportingParameter: ReportingParameter): string => {
  const sameYear: boolean =
    reportingParameter.startDate.getFullYear() ===
    reportingParameter.endDate.getFullYear();
  const sameMonth: boolean =
    reportingParameter.startDate.getFullYear() +
      "-" +
      reportingParameter.startDate.getMonth() ===
    reportingParameter.endDate.getFullYear() +
      "-" +
      reportingParameter.endDate.getMonth();

  let chartTitle: string;
  if (groupByYear.value) {
    if (sameYear) {
      chartTitle = t("Reports.title.costReportYear", {
        year: reportingParameter.startDate.getFullYear().toString(),
      });
    } else {
      chartTitle = t("Reports.title.costReportYearTilYear", {
        yearFrom: reportingParameter.startDate.getFullYear(),
        yearTil: reportingParameter.endDate.getFullYear(),
      });
    }
  } else if (sameMonth) {
    chartTitle = t("Reports.title.costReportMonthYear", {
      month: getMonthName(reportingParameter.startDate.getMonth() + 1),
      year: reportingParameter.startDate.getFullYear(),
    });
  } else {
    chartTitle = t("Reports.title.costReportMonthYearTilMonthYear", {
      monthFrom: getMonthName(reportingParameter.startDate.getMonth() + 1),
      yearFrom: reportingParameter.startDate.getFullYear(),
      monthTil: getMonthName(reportingParameter.endDate.getMonth() + 1),
      yearTil: reportingParameter.endDate.getFullYear(),
    });
  }

  if (singlePostingAccounts.value) {
    chartTitle =
      reportingParameter.selectedPostingAccounts[0]!.name + " - " + chartTitle;
  }
  return chartTitle;
};
const showReportingGraph = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const reportingParameter = {} as ReportingParameter;
  if (groupByYear.value) {
    if (startDateYear.value && endDateYear.value) {
      reportingParameter.startDate = new Date(startDateYear.value);
      reportingParameter.endDate = new Date(endDateYear.value);
      reportingParameter.endDate.setMonth(11);
      reportingParameter.endDate.setDate(31);
    }
  } else if (startDateMonth.value && endDateMonth.value) {
    reportingParameter.startDate = new Date(startDateMonth.value);
    reportingParameter.endDate = new Date(endDateMonth.value);
    reportingParameter.endDate.setMonth(
      reportingParameter.endDate.getMonth() + 1,
    );
    reportingParameter.endDate.setDate(0);
  }

  if (singlePostingAccounts.value) {
    const selectedPostingAccounts = new Array<PostingAccount>();
    const _selectedPostingAccount = postingAccounts.value.find(
      (mpa) => mpa.id === selectedPostingAccount.value,
    );
    if (_selectedPostingAccount) {
      selectedPostingAccounts.push(_selectedPostingAccount);
    }
    reportingParameter.selectedPostingAccounts = selectedPostingAccounts;
  } else {
    reportingParameter.selectedPostingAccounts = postingAccountsYes.value;
    reportingParameter.unselectedPostingAccounts = postingAccountsNo.value;
  }
  reportingGraphLoaded.value = false;

  retrieveGraphData(reportingParameter)
    .then((reportingMonthAmounts) => {
      if (reportingMonthAmounts) {
        const chartTitle = makeChartTitle(reportingParameter);
        const resultMap = makeResultMap(reportingMonthAmounts);

        chartData.value.labels = [];
        chartData.value.datasets[0]!.data = [];
        chartOptions.value.plugins.title.text = chartTitle;

        for (let [key, value] of resultMap) {
          chartData.value.labels.push(key);
          chartData.value.datasets[0]!.data.push(value);
          chartData.value.datasets[0]!.backgroundColor.push(randomColor());
        }
      }
      reportingGraphLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

const makeResultMap = (
  reportingMonthAmounts: ReportingMonthAmount[],
): Map<string, number> => {
  const resultMap = new Map<string, number>();

  if (singlePostingAccounts.value) {
    for (let reportingMonthAmount of reportingMonthAmounts) {
      let key: string = "";
      if (groupByYear.value) {
        key = reportingMonthAmount.year + "";
      } else {
        key =
          getMonthName(reportingMonthAmount.month) +
          " '" +
          reportingMonthAmount.year.toString().substring(2, 4);
      }
      resultMap.set(key, reportingMonthAmount.amount * -1);
    }
  } else {
    for (let reportingMonthAmount of reportingMonthAmounts) {
      const key = reportingMonthAmount.postingAccountName;
      let amount = resultMap.get(key);
      if (amount === undefined) {
        amount = 0;
      }
      amount = toFixed(amount + reportingMonthAmount.amount * -1, 2);
      resultMap.set(key, amount);
    }

    resultMap[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
      return undefined;
    };
  }

  return resultMap;
};
</script>
