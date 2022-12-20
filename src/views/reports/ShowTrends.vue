<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Trends</h4>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-4 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="showTrends">
              <div class="container-fluid">
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-md-6 col-xs-12 mb-2">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startDate"
                          id="trendsStartDate"
                          type="month"
                          @change="validateStartDate"
                          :class="
                            ' form-control ' + startDateErrorData.inputClass
                          "
                        />
                        <label
                          for="trendsStartDate"
                          :style="'color: ' + startDateErrorData.fieldColor"
                          >{{ startDateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-6 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="endDate"
                          id="trendsEndDate"
                          type="month"
                          @change="validateEndDate"
                          :class="
                            ' form-control ' + endDateErrorData.inputClass
                          "
                        />
                        <label
                          for="trendsEndDate"
                          :style="'color: ' + endDateErrorData.fieldColor"
                          >{{ endDateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
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
                  <div class="col-12 mb-4">
                    <select
                      v-model="capitalsourceIds"
                      id="capitalsourceIds2"
                      class="form-select form-control"
                      multiple
                      size="5"
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
                    <button type="submit" class="btn btn-primary mx-2">
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
import { defineComponent } from "vue";

type ShowTrendsData = {
  dataLoaded: boolean;
  startDate: string;
  endDate: string;
  startDateIsValid: boolean | null;
  startDateErrorMessage: string;
  endDateIsValid: boolean | null;
  endDateErrorMessage: string;
  capitalsourceIsValid: boolean | null;
  capitalsourceErrorMessage: string;
  capitalsourceIds: Array<number>;
};

export default defineComponent({
  name: "ShowTrends",
  data(): ShowTrendsData {
    return {
      dataLoaded: false,
      startDate: "",
      endDate: "",
      startDateIsValid: null,
      startDateErrorMessage: "",
      endDateIsValid: null,
      endDateErrorMessage: "",
      capitalsourceIds: {} as Array<number>,
      capitalsourceIsValid: null,
      capitalsourceErrorMessage: "",
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
      const minDateYear = minDate.getFullYear();
      const minDateMonth =
        minDate.getMonth() < 9
          ? "0" + (minDate.getMonth() + 1)
          : minDate.getMonth() + 1;
      this.startDate = minDateYear + "-" + minDateMonth;

      const maxDate = trendsTransporter.endDate;
      const maxDateYear = maxDate.getFullYear();
      const maxDateMonth =
        maxDate.getMonth() < 9
          ? "0" + (maxDate.getMonth() + 1)
          : maxDate.getMonth() + 1;
      this.endDate = maxDateYear + "-" + maxDateMonth;

      this.capitalsourceIds = trendsTransporter.selectedCapitalsourceIds;

      console.log(trendsTransporter);
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

    async showTrends() {
      this.validateEndDate();
      this.validateStartDate();
      this.validateCapitalsource();

      if (this.formIsValid) {
        const startDate = new Date(this.startDate + "-01");
        const endDate = new Date(this.endDate + "-01");
        const trendsParameter: TrendsParameter = {
          startDate: startDate,
          endDate: endDate,
          selectedCapitalsourceIds: this.capitalsourceIds,
        };
        const trends: Trends = await ReportControllerHandler.showTrendsGraph(
          trendsParameter
        );

        console.log(trends);
      }
    },
  },
  components: {},
});
</script>

<style>
ul.month-selection {
  margin: 0 !important;
}
</style>
