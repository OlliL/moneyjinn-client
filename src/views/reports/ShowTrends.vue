<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Reports.title.trends") }}</h4>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div
        class="w-full max-w-3xl rounded-lg border bg-card text-card-foreground shadow-sm bg-muted p-4"
      >
        <form @submit.prevent="showTrends">
          <div class="space-y-4">
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <InputDate
                  v-model="startDate"
                  :validation-schema="schema.startDate"
                  id="startDate"
                  pickMode="month"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div>
                <InputDate
                  v-model="endDate"
                  :validation-schema="schema.endDate"
                  id="endDate"
                  pickMode="month"
                  :field-label="$t('General.endDate')"
                />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="grid">
                <div
                  class="mb-3 text-left rounded-lg border bg-background p-3 shadow-sm space-y-2 w-full"
                >
                  <div class="flex items-center justify-between pb-1 border-b">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="capitalsourcesActive"
                        class="bg-background"
                        v-model="capitalsourcesActive"
                      />
                      <Label for="capitalsourcesActive" class="cursor-pointer">
                        {{ $t("General.capitalsources") }}
                      </Label>
                    </div>

                    <div class="flex items-center space-x-1 text-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        :class="[
                          'px-1.5 py-0.5 h-auto text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors font-normal',
                          !capitalsourcesActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        @click="
                          selectBoxValues.forEach(
                            (v) => (capitalsourceIds[v.id] = true),
                          )
                        "
                      >
                        {{ $t("General.all") }}
                      </Button>
                      <span class="text-muted-foreground/40">|</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        :class="[
                          'px-1.5 py-0.5 h-auto text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors font-normal',
                          !capitalsourcesActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
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
                    :class="[
                      'rounded-md border border-input h-[160px] overflow-hidden flex flex-col transition-opacity',
                      !capitalsourcesActive
                        ? 'opacity-40 pointer-events-none select-none bg-muted/50'
                        : '',
                    ]"
                  >
                    <CommandInput
                      :placeholder="$t('General.searchForCapitalsource')"
                      class="h-8 text-xs text-xs w-full !px-3"
                    />

                    <CommandEmpty
                      class="py-4 text-xs text-muted-foreground w-full text-center block"
                    >
                      {{ $t("General.noEntries") }}
                    </CommandEmpty>

                    <ScrollArea
                      class="flex-1 w-full overflow-y-auto overflow-x-hidden -mx-1 px-1"
                    >
                      <CommandGroup class="p-1">
                        <CommandItem
                          v-for="value of selectBoxValues"
                          :key="value.id"
                          :value="value.value"
                          class="flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-sm hover:bg-accent data-[selected='true']:bg-transparent"
                        >
                          <Checkbox
                            :id="`capitalsource-${value.id}`"
                            v-model="capitalsourceIds[value.id]"
                          />
                          <Label
                            :for="`capitalsource-${value.id}`"
                            class="text-xs font-medium cursor-pointer select-none truncate w-full"
                          >
                            {{ value.value }}
                          </Label>
                        </CommandItem>
                      </CommandGroup>
                    </ScrollArea>
                  </Command>

                  <div
                    :class="[
                      'text-[10px] text-muted-foreground text-right pr-1',
                      !capitalsourcesActive ? 'hidden' : '',
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
              </div>

              <div class="grid">
                <div
                  class="mb-3 text-left rounded-lg border bg-background p-3 shadow-sm space-y-2 w-full"
                >
                  <div class="flex items-center justify-between pb-1 border-b">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="etfs"
                        class="bg-background"
                        v-model="etfsActive"
                      />
                      <Label for="etfs" class="cursor-pointer">
                        {{ $t("General.etfs") }}
                      </Label>
                    </div>
                    <div class="flex items-center space-x-1 text-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        :class="[
                          'px-1.5 py-0.5 h-auto text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors font-normal',
                          !etfsActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
                        @click="
                          etfSelectBoxValues.forEach(
                            (v) => (etfIds[v.id] = true),
                          )
                        "
                      >
                        {{ $t("General.all") }}
                      </Button>
                      <span class="text-muted-foreground/40">|</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        :class="[
                          'px-1.5 py-0.5 h-auto text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors font-normal',
                          !etfsActive
                            ? 'opacity-40 pointer-events-none select-none'
                            : '',
                        ]"
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
                    :class="[
                      'rounded-md border border-input h-[160px] overflow-hidden flex flex-col transition-opacity',
                      !etfsActive
                        ? 'opacity-40 pointer-events-none select-none bg-muted/50'
                        : '',
                    ]"
                  >
                    <CommandInput
                      :placeholder="$t('General.searchForEtf')"
                      class="h-8 text-xs text-xs w-full !px-3"
                    />

                    <CommandEmpty
                      class="py-4 text-xs text-muted-foreground w-full text-center block"
                    >
                      {{ $t("General.noEntries") }}
                    </CommandEmpty>

                    <ScrollArea
                      class="flex-1 w-full overflow-y-auto overflow-x-hidden -mx-1 px-1"
                    >
                      <CommandGroup class="p-1">
                        <CommandItem
                          v-for="value of etfSelectBoxValues"
                          :key="value.id"
                          :value="value.value"
                          class="flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-sm hover:bg-accent data-[selected='true']:bg-transparent"
                        >
                          <Checkbox
                            :id="`etf-${value.id}`"
                            v-model="etfIds[value.id]"
                          />
                          <Label
                            :for="`etf-${value.id}`"
                            class="text-xs font-medium cursor-pointer select-none truncate w-full"
                          >
                            {{ value.value }}
                          </Label>
                        </CommandItem>
                      </CommandGroup>
                    </ScrollArea>
                  </Command>

                  <div
                    :class="[
                      'text-[10px] text-muted-foreground text-right pr-1',
                      !etfsActive ? 'hidden' : '',
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
            <div class="mt-3 flex justify-center">
              <ButtonSubmit :button-label="$t('General.show')"
                ><template #icon><Eye class="h-4 w-4" /></template
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
          v-if="trendsGraphLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Line } from "vue-chartjs";
import { date } from "zod";

import DivError from "@/components/DivError.vue";
import InputDate from "@/components/InputDate.vue";

import { formatNumber } from "@/tools/views/FormatNumber";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { globErr } from "@/tools/views/ZodUtil";

import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { TrendsParameter } from "@/model/report/TrendsParameter";

import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import type { Trends } from "@/model/report/Trends";
import { useEtfStore } from "@/stores/EtfStore";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import { Eye } from "lucide-vue-next";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
};

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
          dataCalculated.push(0.0);
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
