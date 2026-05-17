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
        class="w-full max-w-xl rounded-sm border bg-card text-card-foreground shadow-sm bg-muted p-6"
      >
        <form @submit.prevent="showReportingGraph">
          <div class="space-y-6">
            <div
              class="flex flex-wrap items-end justify-between gap-4 pb-4 border-b"
            >
              <div class="flex flex-wrap items-end gap-4">
                <div class="w-36" v-show="!groupByYear">
                  <InputDate
                    v-model="startDateMonth"
                    :validation-schema-ref="schema.startDateMonth"
                    id="startDateMonth"
                    pickMode="month"
                    :field-label="$t('General.startDate')"
                  />
                </div>
                <div class="w-36" v-show="!groupByYear">
                  <InputDate
                    v-model="endDateMonth"
                    :validation-schema-ref="schema.endDateMonth"
                    id="endDateMonth"
                    pickMode="month"
                    :field-label="$t('General.endDate')"
                  />
                </div>

                <div class="w-36" v-show="groupByYear">
                  <InputDate
                    v-model="startDateYear"
                    :validation-schema-ref="schema.startDateYear"
                    id="startDateYear"
                    pickMode="year"
                    :field-label="$t('General.startDate')"
                  />
                </div>
                <div class="w-36" v-show="groupByYear">
                  <InputDate
                    v-model="endDateYear"
                    :validation-schema-ref="schema.endDateYear"
                    id="endDateYear"
                    pickMode="year"
                    :field-label="$t('General.endDate')"
                  />
                </div>
              </div>

              <div class="space-y-2 text-left min-w-[200px] pt-2 md:pt-0">
                <div class="flex items-center gap-2">
                  <Switch
                    id="showreppostingaccountmode"
                    v-model="singlePostingAccounts"
                  />
                  <Label
                    for="showreppostingaccountmode"
                    class="cursor-pointer text-sm font-medium select-none text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {{ singlePostingAccountsLabel }}
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Switch id="showrepmonth" v-model="groupByYear" />
                  <Label
                    for="showrepmonth"
                    class="cursor-pointer text-sm font-medium select-none text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {{ groupByYearLabel }}
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <div
                class="mb-3 text-left rounded-sm border bg-background p-4 shadow-sm space-y-3 w-full"
                v-show="!singlePostingAccounts"
              >
                <div class="flex items-center justify-between pb-2 border-b">
                  <div class="flex items-center gap-2">
                    <Label class="font-semibold text-sm" for="postingAccounts">
                      {{ $t("General.postingAccounts") }}
                    </Label>
                  </div>

                  <div class="flex items-center gap-1 text-xs">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      class="h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer"
                      @click="
                        selectBoxValues.forEach(
                          (v) => (selectedPostingAccountIds[v.id] = true),
                        )
                      "
                    >
                      {{ $t("General.all") }}
                    </Button>
                    <span class="text-muted-foreground/30 px-0.5">|</span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      class="h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer"
                      @click="
                        selectBoxValues.forEach(
                          (v) => (selectedPostingAccountIds[v.id] = false),
                        )
                      "
                    >
                      {{ $t("General.none") }}
                    </Button>
                  </div>
                </div>

                <Command
                  class="rounded-sm border border-input h-[180px] overflow-hidden flex flex-col transition-opacity bg-background"
                  id="postingAccounts"
                >
                  <CommandInput
                    :placeholder="$t('General.searchForPostingAccount')"
                    class="h-9 text-xs w-full px-3"
                  />
                  <CommandEmpty
                    class="py-6 text-xs text-muted-foreground w-full text-center block"
                  >
                    {{ $t("General.noEntries") }}
                  </CommandEmpty>

                  <ScrollArea class="flex-1 w-full overflow-y-auto">
                    <CommandGroup class="p-1.5">
                      <CommandItem
                        v-for="value of selectBoxValues"
                        :key="value.id"
                        :value="value.value"
                        class="flex items-center space-x-2 py-1.5 px-2 cursor-pointer rounded-md transition-colors data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
                      >
                        <Checkbox
                          :id="`postingaccount-${value.id}`"
                          v-model="selectedPostingAccountIds[value.id]"
                          class="h-4 w-4"
                        />
                        <Label
                          :for="`postingaccount-${value.id}`"
                          class="text-xs font-medium cursor-pointer select-none truncate w-full pr-2"
                        >
                          {{ value.value }}
                        </Label>
                      </CommandItem>
                    </CommandGroup>
                  </ScrollArea>
                </Command>

                <div class="text-xs text-muted-foreground text-right pr-1 pt-1">
                  {{
                    $t("General.xOfySelected", {
                      selected: Object.values(selectedPostingAccountIds).filter(
                        Boolean,
                      ).length,
                      total: selectBoxValues.length,
                    })
                  }}
                </div>
              </div>

              <div
                class="flex justify-center mt-3 w-full"
                v-show="singlePostingAccounts"
              >
                <div class="w-full sm:w-5/6 text-left">
                  <SelectPostingAccount
                    v-model="selectedPostingAccountId"
                    :validation-schema-ref="schema.selectedPostingAccount"
                    id-suffix="ShowReporting"
                    :field-label="$t('General.postingAccount')"
                  />
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-center">
              <ButtonSubmit :button-label="$t('General.show')">
                <template #icon><Eye class="h-4 w-4" /></template>
              </ButtonSubmit>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div
      class="flex justify-center"
      style="position: relative; height: 55vh"
      v-if="reportingGraphLoaded"
    >
      <div class="w-full lg:w-10/12">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";
import InputDate from "@/components/InputDate.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";
import type { ReportingParameter } from "@/model/report/ReportingParameter";
import ReportService from "@/service/ReportService";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import { toFixed } from "@/tools/math";
import { formatNumber } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { globErr } from "@/tools/views/ZodUtil";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Eye } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { Bar } from "vue-chartjs";
import { useI18n } from "vue-i18n";
import { any, date, number } from "zod";
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
const postingAccountStore = usePostingAccountStore();

const selectBoxValues = computed(
  () => postingAccountStore.getAsSelectBoxValues,
);

const selectedPostingAccountIds = ref(new Array<boolean>());
const selectedPostingAccountId = ref(0);

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

watch(singlePostingAccounts, () => {
  setFieldTouched("postingAccountShowReporting", false);
});

const loadData = () => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  selectedPostingAccountIds.value = new Array<boolean>();
  postingAccountStore.postingAccount.forEach((mpa) => {
    selectedPostingAccountIds.value[mpa.id] = false;
  });
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
      reportingParameter.selectedPostingAccounts.forEach((mpa) => {
        selectedPostingAccountIds.value[mpa.id] = true;
      });
      dataLoaded.value = true;
      Object.keys(values).forEach((field) => setFieldTouched(field, false));
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
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

    const _selectedPostingAccount = postingAccountStore.postingAccount.find(
      (mpa) => mpa.id === selectedPostingAccountId.value,
    );
    if (_selectedPostingAccount) {
      selectedPostingAccounts.push(_selectedPostingAccount);
    }
    reportingParameter.selectedPostingAccounts = selectedPostingAccounts;
  } else {
    reportingParameter.selectedPostingAccounts =
      postingAccountStore.postingAccount.filter(
        (mpa) => selectedPostingAccountIds.value[mpa.id],
      );
    reportingParameter.unselectedPostingAccounts =
      postingAccountStore.postingAccount.filter(
        (mpa) => !selectedPostingAccountIds.value[mpa.id],
      );
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
      console.log(backendError);
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
