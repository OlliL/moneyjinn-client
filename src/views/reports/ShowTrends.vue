<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Trends</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-4 col-md-6 col-sm-10 col-xs-12">
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
                      field-label="Startdatum"
                    />
                  </div>
                  <div class="col-md-6 col-xs-12">
                    <InputDate
                      v-model="endDate"
                      :validation-schema="schema.endDate"
                      id="endDate"
                      pickMode="month"
                      field-label="Enddatum"
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
                  <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                      anzeigen
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
      <div class="col-xxl-7 col-md-10 col-sm-12 col-xs-12">
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
import { toFieldValidator } from "@vee-validate/zod";
import { computed, onMounted, ref } from "vue";
import { Line } from "vue-chartjs";
import { date, number } from "zod";

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

import ReportControllerHandler from "@/handler/ReportControllerHandler";

const schema = {
  startDate: date(globErr("Bitte Startdatum angeben!")),
  endDate: date(globErr("Bitte Enddatum angeben!")),
  capitalsourceIds: number().array().min(1, "Bitte Buchungskonto angeben!"),
};

const dataLoaded = ref(false);
const trendsGraphLoaded = ref(false);
const startDate = ref(new Date());
const endDate = ref(new Date());
const chartData = ref({
  labels: new Array<string>(),
  datasets: [
    {
      label: "festgeschrieben",
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
      label: "berechnet",
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
            label += formatNumber(+context.parsed.y, 2) + "€";
          }
          return label;
        },
      },
    },
  },
  interaction: {
    mode: "index" as "index",
    intersect: false,
  },
  scales: {
    x: {
      title: {
        text: "Monat/Jahr",
        display: true,
      },
    },
    y: {
      title: {
        text: "Betrag",
        display: true,
      },
      ticks: {
        callback: function (value: number) {
          return formatNumber(value, 0) + "€";
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
  Filler
);

type ChartDataDataset = {
  label: string;
  data: Array<number | null>;
  fill: boolean;
  borderColor: string;
  backgroundColor: any; // string | CanvasGradient;
  hidden?: boolean;
};
type ChartData = {
  labels: Array<string>;
  datasets: Array<ChartDataDataset>;
};

const capitalsourceStore = useCapitalsourceStore();
const selectBoxValues = computed((): Array<SelectBoxValue> => {
  return capitalsourceStore.getAllAsSelectBoxValues();
});

const { handleSubmit, values, setFieldTouched } = useForm();
const {
  value: capitalsourceIds,
  meta: capitalsourceIdsMeta,
  errorMessage,
} = useField<Array<number>>(
  "postingAccountIdsYes",
  toFieldValidator(schema.capitalsourceIds),
  { initialValue: new Array<number>() }
);

const errorCapitalsourceIds = computed((): ErrorData => {
  return generateErrorDataVeeValidate(
    capitalsourceIdsMeta.touched,
    "Kapitalquellen",
    errorMessage.value
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
  dataLoaded.value = false;
  ReportControllerHandler.showTrendsForm().then((trendsTransporter) => {
    const minDate = trendsTransporter.startDate;
    const maxDate = trendsTransporter.endDate;

    startDate.value = minDate;
    endDate.value = maxDate;

    if (trendsTransporter.selectedCapitalsourceIds)
      capitalsourceIds.value = trendsTransporter.selectedCapitalsourceIds;

    dataLoaded.value = true;
    Object.keys(values).forEach((field) => setFieldTouched(field, false));
  });
};

const showTrends = handleSubmit(() => {
  trendsGraphLoaded.value = false;

  const _endDate = endDate.value;
  _endDate.setMonth(_endDate.getMonth() + 1);
  _endDate.setDate(0);
  const trendsParameter: TrendsParameter = {
    startDate: startDate.value,
    endDate: _endDate,
    selectedCapitalsourceIds: capitalsourceIds.value,
  };
  ReportControllerHandler.showTrendsGraph(trendsParameter).then((trends) => {
    if (trends && trends.trendsSettled && trends.trendsSettled.length > 0) {
      const labelsSettled: Array<string> = trends.trendsSettled.map(function (
        e
      ) {
        return getXLabel(e.month, e.year);
      });

      const dataSettled: Array<number> = trends.trendsSettled.map(function (e) {
        return e.amount;
      });

      chartData.value.labels = labelsSettled;
      chartData.value.datasets[0].data = dataSettled;

      if (trends.trendsCalculated && trends.trendsCalculated.length > 0) {
        const labelsCalculated: Array<string> = trends.trendsCalculated.map(
          function (e) {
            return getXLabel(e.month, e.year);
          }
        );

        const dataCalculated = new Array<number | null>();

        for (let i = 0; i < dataSettled.length; i++) {
          if (i + 1 == dataSettled.length) {
            dataCalculated.push(dataSettled[i]);
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

      const startLabel = chartData.value.labels[0];
      const endLabel =
        chartData.value.labels[chartData.value.labels.length - 1];
      chartOptions.value.plugins.title.text =
        "Vermögenstrend der ausgewählten Kapitalquellen " +
        startLabel +
        " bis " +
        endLabel;
      trendsGraphLoaded.value = true;
    }
  });
});
</script>
