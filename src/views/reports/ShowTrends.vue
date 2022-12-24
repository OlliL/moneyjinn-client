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
                    <DatepickerVue
                      id="startDate"
                      :label="startDateErrorData.fieldLabel"
                      :default-date="startDate"
                      pick-mode="month"
                      :input-class="
                        ' form-control ' + startDateErrorData.inputClass
                      "
                      :label-style="'color: ' + startDateErrorData.fieldColor"
                      @date-selected="startDateSelected"
                    />
                  </div>
                  <div class="col-md-6 col-xs-12">
                    <DatepickerVue
                      id="endDate"
                      :label="endDateErrorData.fieldLabel"
                      :default-date="endDate"
                      pick-mode="month"
                      :input-class="
                        ' form-control ' + endDateErrorData.inputClass
                      "
                      :label-style="'color: ' + endDateErrorData.fieldColor"
                      @date-selected="endDateSelected"
                    />
                  </div>
                </div>

                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12 text-start">
                    <small
                      :style="'color:' + capitalsourceErrorData.fieldColor"
                      >{{ capitalsourceErrorData.fieldLabel }}</small
                    >
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12 mb-3">
                    <select
                      v-model="capitalsourceIds"
                      id="capitalsourceIds2"
                      class="form-select form-control"
                      multiple
                      size="4"
                    >
                      <option
                        v-for="capitalsource of capitalsourceArray"
                        :key="capitalsource.id"
                        :value="capitalsource.id"
                      >
                        {{ capitalsource.comment }}
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

<script lang="ts">
import ReportControllerHandler from "@/handler/ReportControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { TrendsParameter } from "@/model/report/TrendsParameter";
import type { Trends } from "@/model/report/Trends";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import DatepickerVue from "@/components/Datepicker.vue";
import { defineComponent } from "vue";
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

import { Line } from "vue-chartjs";

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

type ShowTrendsData = {
  dataLoaded: boolean;
  trendsGraphLoaded: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startDateIsValid: boolean | null;
  startDateErrorMessage: string;
  endDateIsValid: boolean | null;
  endDateErrorMessage: string;
  capitalsourceIsValid: boolean | null;
  capitalsourceErrorMessage: string;
  capitalsourceIds: Array<number>;
  chartData: ChartData;
  chartOptions: any;
};

function getXLabel(month: number, year: number) {
  if (month < 10) {
    return "0" + month + "/" + year;
  } else {
    return month + "/" + year;
  }
}

export default defineComponent({
  name: "ShowTrends",
  data(): ShowTrendsData {
    return {
      dataLoaded: false,
      trendsGraphLoaded: false,
      startDate: undefined,
      endDate: undefined,
      startDateIsValid: null,
      startDateErrorMessage: "",
      endDateIsValid: null,
      endDateErrorMessage: "",
      capitalsourceIds: new Array<number>(),
      capitalsourceIsValid: null,
      capitalsourceErrorMessage: "",
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "",
          },
        },
        interaction: {
          mode: "index",
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
          },
        },
      },
      chartData: {
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
      },
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    formIsValid(): boolean {
      const isValid =
        this.startDateIsValid &&
        this.endDateIsValid &&
        this.capitalsourceIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    startDateErrorData(): ErrorData {
      return generateErrorData(
        this.startDateIsValid,
        "Startdatum",
        this.startDateErrorMessage
      );
    },
    endDateErrorData(): ErrorData {
      return generateErrorData(
        this.endDateIsValid,
        "Enddatum",
        this.endDateErrorMessage
      );
    },
    capitalsourceErrorData(): ErrorData {
      return generateErrorData(
        this.capitalsourceIsValid,
        "Kapitalquellen",
        this.capitalsourceErrorMessage
      );
    },
    capitalsourceArray(): Array<Capitalsource> {
      const capitalsourceStore = useCapitalsourceStore();
      return capitalsourceStore.capitalsource;
    },
  },
  methods: {
    async loadData() {
      this.dataLoaded = false;
      const trendsTransporter: TrendsParameter =
        await ReportControllerHandler.showTrendsForm();

      const minDate = trendsTransporter.startDate;
      const maxDate = trendsTransporter.endDate;

      this.startDate = minDate;
      this.endDate = maxDate;

      this.capitalsourceIds = trendsTransporter.selectedCapitalsourceIds;

      this.dataLoaded = true;
    },
    validateStartDate() {
      [this.startDateIsValid, this.startDateErrorMessage] = validateInputField(
        this.startDate,
        "Startdatum angeben!"
      );
    },
    validateEndDate() {
      [this.endDateIsValid, this.endDateErrorMessage] = validateInputField(
        this.endDate,
        "Enddatum angeben!"
      );
    },
    validateCapitalsource() {
      [this.capitalsourceIsValid, this.capitalsourceErrorMessage] =
        validateInputField(
          this.capitalsourceIds.length,
          "Kapitalquellen angeben!"
        );
    },
    startDateSelected(date: Date) {
      this.startDate = date;
      this.validateStartDate();
    },
    endDateSelected(date: Date) {
      this.endDate = date;
      this.validateEndDate();
    },

    async showTrends() {
      this.validateEndDate();
      this.validateStartDate();
      this.validateCapitalsource();
      this.trendsGraphLoaded = false;

      if (this.formIsValid && this.startDate && this.endDate) {
        const endDate = this.endDate;
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        const trendsParameter: TrendsParameter = {
          startDate: this.startDate,
          endDate: this.endDate,
          selectedCapitalsourceIds: this.capitalsourceIds,
        };
        const trends: Trends = await ReportControllerHandler.showTrendsGraph(
          trendsParameter
        );
        if (trends && trends.trendsSettled && trends.trendsSettled.length > 0) {
          const labelsSettled: Array<string> = trends.trendsSettled.map(
            function (e) {
              return getXLabel(e.month, e.year);
            }
          );

          const dataSettled: Array<number> = trends.trendsSettled.map(function (
            e
          ) {
            return e.amount;
          });

          this.chartData.labels = labelsSettled;
          this.chartData.datasets[0].data = dataSettled;

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
              this.chartData.labels.push(label);
            });

            this.chartData.datasets[1].data = dataCalculated;
            this.chartData.datasets[1].hidden = false;
          } else {
            this.chartData.datasets[1].hidden = true;
          }

          const startLabel = this.chartData.labels[0];
          const endLabel =
            this.chartData.labels[this.chartData.labels.length - 1];
          this.chartOptions.plugins.title.text =
            "Vermögenstrend der ausgewählten Kapitalquellen " +
            startLabel +
            " bis " +
            endLabel;
          this.trendsGraphLoaded = true;
        }
      }
    },
  },
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { Line, DatepickerVue },
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
