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

            <div class="flex justify-start">
              <div class="flex items-center gap-3 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  id="capitalsourcesActive"
                  v-model="capitalsourcesActive"
                />
                <label
                  for="capitalsourcesActive"
                  class="text-muted-foreground"
                  >{{ $t("General.capitalsources") }}</label
                >
              </div>
            </div>
            <div class="grid" v-if="capitalsourcesActive">
              <div class="mb-3 text-left">
                <select
                  v-model="capitalsourceIds"
                  id="capitalsourceIds"
                  name="capitalsourceIds"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  multiple
                  size="4"
                >
                  <option
                    v-for="value of selectBoxValues"
                    :key="value.id"
                    :value="value.id"
                  >
                    {{ value.value }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex justify-start">
              <div class="flex items-center gap-3 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  id="etfsActive"
                  v-model="etfsActive"
                />
                <label for="etfs" class="text-muted-foreground">{{
                  $t("General.etfs")
                }}</label>
              </div>
            </div>
            <div class="grid" v-if="etfsActive">
              <div class="mb-3 text-left">
                <select
                  v-model="selectedEtfIds"
                  id="etfIds"
                  name="etfIds"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  multiple
                  size="4"
                >
                  <option
                    v-for="value of etfSelectBoxValues"
                    :key="value.id"
                    :value="value.id"
                  >
                    {{ value.value }}
                  </option>
                </select>
              </div>
            </div>

            <div class="flex justify-center">
              <Button type="submit">
                {{ $t("General.show") }}
              </Button>
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
import { Button } from "@/components/ui/button";

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

const capitalsourceIds = ref(new Array<number>());
const selectedEtfIds = ref(new Array<number>());
const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

const loadData = () => {
  serverErrors.value = new Array<string>();

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
        capitalsourceIds.value = trendsTransporter.selectedCapitalsourceIds;

      if (trendsTransporter.selectedEtfIds)
        selectedEtfIds.value = trendsTransporter.selectedEtfIds;

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

  const _endDate = endDate.value;
  _endDate.setMonth(_endDate.getMonth() + 1);
  _endDate.setDate(0);
  const trendsParameter: TrendsParameter = {
    startDate: startDate.value,
    endDate: _endDate,
    selectedCapitalsourceIds: capitalsourceIds.value,
    selectedEtfIds: selectedEtfIds.value,
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
