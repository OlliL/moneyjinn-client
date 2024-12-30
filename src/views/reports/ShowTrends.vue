<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("Reports.title.trends") }}</h4>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-4 col-md-7 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="showTrends">
              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-md-6 col-xs-12 mb-2">
                    <InputDate
                      v-model="startDate"
                      :validation-schema="schema.startDate"
                      id="startDate"
                      pickMode="month"
                      :field-label="$t('General.startDate')"
                    />
                  </div>
                  <div class="col-md-6 col-xs-12">
                    <InputDate
                      v-model="endDate"
                      :validation-schema="schema.endDate"
                      id="endDate"
                      pickMode="month"
                      :field-label="$t('General.endDate')"
                    />
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12 mb-3 text-start">
                    <label
                      for="capitalsourceIds"
                      :style="
                        'opacity: .65; color: ' +
                        errorCapitalsourceIds.fieldColor
                      "
                      ><small>{{
                        errorCapitalsourceIds.fieldLabel
                      }}</small></label
                    >
                    <select
                      v-model="capitalsourceIds"
                      id="capitalsourceIds"
                      name="capitalsourceIds"
                      :class="
                        'form-select form-control ' +
                        errorCapitalsourceIds.inputClass
                      "
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

                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12 mb-3 text-start">
                    <label for="etfs" style="opacity: 0.65"
                      ><small>{{ $t("General.etfs") }}</small></label
                    >
                    <select
                      v-model="selectedEtfIds"
                      id="etfIds"
                      name="etfIds"
                      class="form-select form-control"
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

                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                      {{ $t("General.show") }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row justify-content-md-center"
      style="position: relative; height: 55vh"
    >
      <div class="col-xxl-7 col-xl-10 col-xs-12">
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
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Line } from "vue-chartjs";
import { date, number } from "zod";

import DivError from "@/components/DivError.vue";
import InputDate from "@/components/InputDate.vue";

import { formatNumber } from "@/tools/views/FormatNumber";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import {
  generateErrorDataVeeValidate,
  type ErrorData,
} from "@/tools/views/ErrorData";
import { globErr } from "@/tools/views/ZodUtil";

import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { TrendsParameter } from "@/model/report/TrendsParameter";

import ReportService from "@/service/ReportService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import CrudEtfService from "@/service/CrudEtfService";
import type { Etf } from "@/model/etf/Etf";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
  capitalsourceIds: number()
    .array()
    .min(1, t("Moneyflow.validation.postingAccountId")),
};

const dataLoaded = ref(false);
const trendsGraphLoaded = ref(false);
const allEtfs = ref(new Array<Etf>());
const startDate = ref(new Date());
const endDate = ref(new Date());
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
const selectBoxValues = computed(
  (): Array<SelectBoxValue> => capitalsourceStore.getAllAsSelectBoxValues(),
);
const etfSelectBoxValues = computed(
  (): Array<SelectBoxValue> =>
    allEtfs.value.map((etf) => {
      return { id: etf.id, value: etf.name } as SelectBoxValue;
    }),
);

const selectedEtfIds = ref(new Array<number>());
const { handleSubmit, values, setFieldTouched } = useForm();
const {
  value: capitalsourceIds,
  meta: capitalsourceIdsMeta,
  errorMessage,
} = useField<Array<number>>(
  "postingAccountIdsYes",
  toTypedSchema(schema.capitalsourceIds),
  { initialValue: new Array<number>(), syncVModel: true },
);

const errorCapitalsourceIds = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    capitalsourceIdsMeta.touched,
    t("General.capitalsources"),
    errorMessage.value,
  );
});

const getXLabel = (month: number, year: number) => {
  if (month < 10) {
    return "0" + month + "/" + year;
  } else {
    return month + "/" + year;
  }
};

onMounted(() => {
  loadData();
});

const loadData = () => {
  serverErrors.value = new Array<string>();

  dataLoaded.value = false;
  Promise.all([ReportService.showTrendsForm(), CrudEtfService.fetchAllEtf()])
    .then(([trendsTransporter, etfTransporters]) => {
      const minDate = trendsTransporter.startDate;
      const maxDate = trendsTransporter.endDate;

      startDate.value = minDate;
      endDate.value = maxDate;

      if (trendsTransporter.selectedCapitalsourceIds)
        capitalsourceIds.value = trendsTransporter.selectedCapitalsourceIds;

      if (trendsTransporter.selectedEtfIds)
        selectedEtfIds.value = trendsTransporter.selectedEtfIds;

      allEtfs.value = etfTransporters;

      dataLoaded.value = true;
      Object.keys(values).forEach((field) => setFieldTouched(field, false));
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
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
  };
  ReportService.showTrendsGraph(trendsParameter)
    .then((trends) => {
      if (trends && trends.trendsSettled && trends.trendsSettled.length > 0) {
        const labelsSettled: Array<string> = trends.trendsSettled.map(
          function (e) {
            return getXLabel(e.month, e.year);
          },
        );

        const dataSettled: Array<number> = trends.trendsSettled.map(
          function (e) {
            return e.amount;
          },
        );

        chartData.value.labels = labelsSettled;
        chartData.value.datasets[0].data = dataSettled;

        if (trends.trendsCalculated && trends.trendsCalculated.length > 0) {
          const labelsCalculated: Array<string> = trends.trendsCalculated.map(
            function (e) {
              return getXLabel(e.month, e.year);
            },
          );

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

          labelsCalculated.forEach((label) => {
            chartData.value.labels.push(label);
          });

          chartData.value.datasets[1].data = dataCalculated;
          chartData.value.datasets[1].hidden = false;
        } else {
          chartData.value.datasets[1].hidden = true;
        }

        const dataEtf: Array<number> | undefined = trends.trendsEtfs?.map(
          function (e) {
            return e.amount;
          },
        );

        if (dataEtf) {
          chartData.value.datasets[2].data = dataEtf;
          chartData.value.datasets[2].hidden = false;
        } else {
          chartData.value.datasets[2].hidden = true;
        }

        const startLabel = chartData.value.labels[0];
        const endLabel =
          chartData.value.labels[chartData.value.labels.length - 1];
        chartOptions.value.plugins.title.text = t("Reports.title.trendGraph", {
          startLabel: startLabel,
          endLabel: endLabel,
        });
        trendsGraphLoaded.value = true;
      }
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
