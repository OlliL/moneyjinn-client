<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Reports.title.trends") }}</h4>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div class="w-full max-w-3xl card-panel p-4">
        <form @submit.prevent="showTrends">
          <div class="space-y-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 items-start gap-4 pb-4 border-b"
            >
              <div class="col-span-1">
                <InputDate
                  v-model="startDate"
                  :validation-schema="schema.startDate"
                  id="startDate"
                  pickMode="month"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="col-span-1">
                <InputDate
                  v-model="endDate"
                  :validation-schema="schema.endDate"
                  id="endDate"
                  pickMode="month"
                  :field-label="$t('General.endDate')"
                />
              </div>
            </div>

            <div
              @click="mobileOptionsOpen = !mobileOptionsOpen"
              class="flex items-center justify-between p-3 cursor-pointer text-xs font-semibold text-muted-foreground md:hidden select-none border border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div class="flex items-center gap-2">
                <SlidersHorizontal class="icon-small" />
                <span>{{ $t("General.displayOptions") }}</span>
              </div>
              <ChevronDown
                class="icon-small transition-transform duration-200"
                :class="{ 'rotate-180': mobileOptionsOpen }"
              />
            </div>

            <div
              :class="{ block: mobileOptionsOpen, hidden: !mobileOptionsOpen }"
              class="md:block text-left"
            >
              <div class="grid gap-4 md:grid-cols-2">
                <div
                  data-testid="capitalsources-section"
                  class="p-4 space-y-3 rounded-sm border bg-background"
                >
                  <div class="flex items-center justify-between pb-2 border-b">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="capitalsourcesActive"
                        class="bg-background"
                        data-testid="capitalsourcesActive"
                        v-model="capitalsourcesActive"
                      />
                      <Label
                        for="capitalsourcesActive"
                        class="cursor-pointer font-semibold text-sm"
                      >
                        {{ $t("General.capitalsources") }}
                      </Label>
                    </div>

                    <div class="flex items-center gap-1 text-xs">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        :class="[
                          'h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer',
                          !capitalsourcesActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        data-testid="capitalsource-select-all-button"
                        @click="
                          selectBoxValues.forEach(
                            (v) => (capitalsourceIds[v.id] = true),
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
                        :class="[
                          'h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer',
                          !capitalsourcesActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        data-testid="capitalsource-select-none-button"
                        @click="
                          selectBoxValues.forEach(
                            (v) => (capitalsourceIds[v.id] = false),
                          )
                        "
                      >
                        {{ $t("General.none") }}
                      </Button>
                    </div>
                  </div>

                  <Command
                    data-testid="capitalsources-command"
                    :class="[
                      'rounded-sm border border-input h-[180px] overflow-hidden flex flex-col transition-opacity',
                      !capitalsourcesActive
                        ? 'opacity-40 pointer-events-none select-none bg-muted/30'
                        : 'bg-background',
                    ]"
                  >
                    <CommandInput
                      data-testid="capitalsource-search-input"
                      :placeholder="$t('General.searchForCapitalsource')"
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
                          :data-testid="`capitalsource-item-${value.id}`"
                          :value="value.value"
                          class="flex items-center space-x-2 py-1.5 px-2 cursor-pointer rounded-md transition-colors data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
                        >
                          <Checkbox
                            :id="`capitalsource-${value.id}`"
                            v-model="capitalsourceIds[value.id]"
                            class="icon-small"
                            :data-testid="`capitalsource-${value.id}`"
                          />
                          <Label
                            :for="`capitalsource-${value.id}`"
                            class="text-xs font-medium cursor-pointer select-none truncate w-full pr-2"
                          >
                            {{ value.value }}
                          </Label>
                        </CommandItem>
                      </CommandGroup>
                    </ScrollArea>
                  </Command>

                  <div
                    :class="[
                      'text-xs text-muted-foreground text-right pr-1 transition-opacity',
                      !capitalsourcesActive
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100',
                    ]"
                  >
                    {{
                      $t("General.xOfySelected", {
                        selected:
                          Object.values(capitalsourceIds).filter(Boolean)
                            .length,
                        total: selectBoxValues.length,
                      })
                    }}
                  </div>
                </div>

                <div
                  data-testid="etfs-section"
                  class="p-4 space-y-3 rounded-sm border bg-background"
                >
                  <div class="flex items-center justify-between pb-2 border-b">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="etfs"
                        class="bg-background"
                        data-testid="etfs"
                        v-model="etfsActive"
                      />
                      <Label
                        for="etfs"
                        class="cursor-pointer font-semibold text-sm"
                      >
                        {{ $t("General.etfs") }}
                      </Label>
                    </div>

                    <div class="flex items-center gap-1 text-xs">
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        :class="[
                          'h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer',
                          !etfsActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        data-testid="etf-select-all-button"
                        @click="
                          etfSelectBoxValues.forEach(
                            (v) => (etfIds[v.id] = true),
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
                        :class="[
                          'h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-normal no-underline hover:underline cursor-pointer',
                          !etfsActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        data-testid="etf-select-none-button"
                        @click="
                          etfSelectBoxValues.forEach(
                            (v) => (etfIds[v.id] = false),
                          )
                        "
                      >
                        {{ $t("General.none") }}
                      </Button>
                    </div>
                  </div>

                  <Command
                    data-testid="etfs-command"
                    :class="[
                      'rounded-sm border border-input h-[180px] overflow-hidden flex flex-col transition-opacity',
                      !etfsActive
                        ? 'opacity-40 pointer-events-none select-none bg-muted/30'
                        : 'bg-background',
                    ]"
                  >
                    <CommandInput
                      data-testid="etf-search-input"
                      :placeholder="$t('General.searchForEtf')"
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
                          v-for="value of etfSelectBoxValues"
                          :key="value.id"
                          :data-testid="`etf-item-${value.id}`"
                          :value="value.value"
                          class="flex items-center space-x-2 py-1.5 px-2 cursor-pointer rounded-md transition-colors data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
                        >
                          <Checkbox
                            :id="`etf-${value.id}`"
                            v-model="etfIds[value.id]"
                            class="icon-small"
                            :data-testid="`etf-${value.id}`"
                          />
                          <Label
                            :for="`etf-${value.id}`"
                            class="text-xs font-medium cursor-pointer select-none truncate w-full pr-2"
                          >
                            {{ value.value }}
                          </Label>
                        </CommandItem>
                      </CommandGroup>
                    </ScrollArea>
                  </Command>

                  <div
                    :class="[
                      'text-xs text-muted-foreground text-right pr-1 transition-opacity',
                      !etfsActive
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100',
                    ]"
                  >
                    {{
                      $t("General.xOfySelected", {
                        selected: Object.values(etfIds).filter(Boolean).length,
                        total: etfSelectBoxValues.length,
                      })
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex justify-center"
              data-testid="show-trends-button-container"
            >
              <ButtonSubmit
                :button-label="$t('General.show')"
                test-id="show-trends-button"
                ><template #icon><Eye class="icon-small" /></template
              ></ButtonSubmit>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex justify-center" style="position: relative; height: 55vh">
      <div class="w-full lg:w-10/12 xl:w-9/12">
        <Line
          :data="chartData"
          :options="chartOptions"
          data-testid="trends-canvas"
          v-if="trendsGraphLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputDate from "@/components/common/InputDate.vue";
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
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { Trends } from "@/model/report/Trends";
import type { TrendsParameter } from "@/model/report/TrendsParameter";
import ReportService from "@/service/ReportService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useEtfStore } from "@/stores/EtfStore";
import { formatNumber } from "@/tools/views/FormatNumber";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { ChevronDown, Eye, SlidersHorizontal } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { Line } from "vue-chartjs";
import { useI18n } from "vue-i18n";
import { date } from "zod";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
};

const mobileOptionsOpen = ref(false);
const dataLoaded = ref(false);
const trendsGraphLoaded = ref(false);
const startDate = ref(new Date());
const endDate = ref(new Date());
const capitalsourcesActive = ref(true);
const etfsActive = ref(true);
const chartData = ref({
  labels: new Array<string>(),
  datasets: [
    {
      label: t("Reports.settled"),
      data: new Array<number | null>(),
      fill: true,
      borderColor: "#B0C4DE",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 500, 0, 0);

        gradient.addColorStop(0, "rgba(176, 196, 222, 1)");
        gradient.addColorStop(1, "rgba(230, 230, 250, 1)");

        return gradient;
      },
    },
    {
      label: t("Reports.calculated"),
      data: new Array<number | null>(),
      fill: true,
      borderColor: "#689bde",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 500, 0, 0);

        gradient.addColorStop(0, "rgba(104, 155, 222, 1)");
        gradient.addColorStop(1, "rgba(174, 174, 250, 1)");

        return gradient;
      },
    },
    {
      label: t("General.etfs"),
      data: new Array<number | null>(),
      fill: true,
      borderColor: "#be2200",
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 500, 0, 0);

        gradient.addColorStop(0, "rgba( 253, 112, 81, 1)");
        gradient.addColorStop(1, "rgba( 242, 47, 6 , 1)");

        return gradient;
      },
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
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";

          if (label) label += ": ";

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
    x: {
      title: {
        text: t("Reports.title.trendMonthYear"),
        display: true,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        text: t("Reports.title.trendAmount"),
        display: true,
      },
      ticks: {
        callback: function (value: any) {
          return formatNumber(+value, 0) + currency;
        },
      },
    },
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ChartDataDataset = {
  label: string;
  data: Array<number | null>;
  fill: boolean;
  borderColor: string;
  backgroundColor: any;
  hidden?: boolean;
};
type ChartData = {
  labels: Array<string>;
  datasets: Array<ChartDataDataset>;
};

const currency = t("General.currency");
const capitalsourceStore = useCapitalsourceStore();
const etfStore = useEtfStore();

const selectBoxValues = computed(
  (): Array<SelectBoxValue> => capitalsourceStore.getAllAsSelectBoxValues(),
);
const etfSelectBoxValues = computed(
  (): Array<SelectBoxValue> => etfStore.getAsSelectBoxValues(),
);

const capitalsourceIds = ref(new Array<boolean>());
const etfIds = ref(new Array<boolean>());
const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

const loadData = () => {
  serverErrors.value = new Array<string>();
  capitalsourceStore.capitalsource.forEach((capitalsource) => {
    capitalsourceIds.value[capitalsource.id] = false;
  });
  etfStore.etf.forEach((etf) => {
    etfIds.value[etf.id] = false;
  });
  dataLoaded.value = false;
  ReportService.showTrendsForm()
    .then((trendsTransporter) => {
      const minDate = trendsTransporter.startDate;
      const maxDate = trendsTransporter.endDate;

      startDate.value = minDate;
      endDate.value = maxDate;
      etfsActive.value = trendsTransporter.etfsActive;
      capitalsourcesActive.value = trendsTransporter.capitalsourcesActive;

      if (trendsTransporter.selectedCapitalsourceIds)
        trendsTransporter.selectedCapitalsourceIds.forEach((id: number) => {
          capitalsourceIds.value[id] = true;
        });

      if (trendsTransporter.selectedEtfIds)
        trendsTransporter.selectedEtfIds.forEach((id: number) => {
          etfIds.value[id] = true;
        });

      dataLoaded.value = true;
      Object.keys(values).forEach((field) => setFieldTouched(field, false));
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const getXLabel = (month: number, year: number) => {
  if (month < 10) {
    return "0" + month + "/" + year;
  } else {
    return month + "/" + year;
  }
};

const addXAxisLabels = (trends: Trends) => {
  if (trends.trendsSettled && trends.trendsSettled.length > 0) {
    // Settled Capitalsources
    const labelsSettled: Array<string> = trends.trendsSettled.map(function (e) {
      return getXLabel(e.month, e.year);
    });
    chartData.value.labels = labelsSettled;

    // Calculated Capitalsources
    if (trends.trendsCalculated && trends.trendsCalculated.length > 0) {
      const labelsCalculated: Array<string> = trends.trendsCalculated.map(
        function (e) {
          return getXLabel(e.month, e.year);
        },
      );
      labelsCalculated.forEach((label) => {
        chartData.value.labels.push(label);
      });
    }
  } else if (trends.trendsEtfs && trends.trendsEtfs.length > 0) {
    // ETFs
    const labelsSettled: Array<string> = trends.trendsEtfs.map(function (e) {
      return getXLabel(e.month, e.year);
    });
    chartData.value.labels = labelsSettled;
  }
};

const addCapitalsourceData = (trends: Trends) => {
  if (trends.trendsSettled && trends.trendsSettled.length > 0) {
    // Settled Capitalsources
    const dataSettled: Array<number> = trends.trendsSettled.map(function (e) {
      return e.amount;
    });

    chartData.value.datasets[0]!.data = dataSettled;
    chartData.value.datasets[0]!.hidden = false;

    // Calculated Capitalsources
    if (trends.trendsCalculated && trends.trendsCalculated.length > 0) {
      const dataCalculated = new Array<number | null>();

      for (let i = 0; i < dataSettled.length; i++) {
        if (i + 1 == dataSettled.length) {
          dataCalculated.push(0);
        } else {
          dataCalculated.push(null);
        }
      }

      trends.trendsCalculated.forEach((data) => {
        dataCalculated.push(data.amount);
      });

      chartData.value.datasets[1]!.data = dataCalculated;
      chartData.value.datasets[1]!.hidden = false;
    }
  }
};

const addEtfData = (trends: Trends) => {
  if (trends.trendsEtfs && trends.trendsEtfs.length > 0) {
    // ETFs
    const dataEtf: Array<number> | undefined = trends.trendsEtfs.map(
      function (e) {
        return e.amount;
      },
    );

    if (dataEtf) {
      chartData.value.datasets[2]!.data = dataEtf;
      chartData.value.datasets[2]!.hidden = false;
    }

    const startLabel = chartData.value.labels[0];
    const endLabel = chartData.value.labels[chartData.value.labels.length - 1];
    chartOptions.value.plugins.title.text = t("Reports.title.trendGraph", {
      startLabel: startLabel,
      endLabel: endLabel,
    });
  }
};

const showTrends = handleSubmit(() => {
  serverErrors.value = new Array<string>();
  trendsGraphLoaded.value = false;
  const selectedCapitalsourceIds = new Array<number>();
  for (const key of capitalsourceIds.value.keys()) {
    if (capitalsourceIds.value[key]) {
      selectedCapitalsourceIds.push(key);
    }
  }
  const selectedEtfIds = new Array<number>();
  for (const key of etfIds.value.keys()) {
    if (etfIds.value[key]) {
      selectedEtfIds.push(key);
    }
  }

  const _endDate = endDate.value;
  _endDate.setMonth(_endDate.getMonth() + 1);
  _endDate.setDate(0);
  const trendsParameter: TrendsParameter = {
    startDate: startDate.value,
    endDate: _endDate,
    selectedCapitalsourceIds: selectedCapitalsourceIds,
    selectedEtfIds: selectedEtfIds,
    capitalsourcesActive: capitalsourcesActive.value,
    etfsActive: etfsActive.value,
  };
  ReportService.showTrendsGraph(trendsParameter)
    .then((trends) => {
      chartData.value.datasets[0]!.hidden = true;
      chartData.value.datasets[1]!.hidden = true;
      chartData.value.datasets[2]!.hidden = true;

      if (trends) {
        addXAxisLabels(trends);
        addCapitalsourceData(trends);
        addEtfData(trends);
        trendsGraphLoaded.value = true;
      }
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
