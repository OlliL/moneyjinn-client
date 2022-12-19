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
                  <div class="col-md-6 col-xs-12 mb-4">
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
import type { TrendsTransporter } from "@/model/report/TrendsTransporter";
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
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    formIsValid(): boolean {
      const isValid = this.startDateIsValid && this.endDateIsValid;
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
  },
  methods: {
    async loadData() {
      this.dataLoaded = false;
      const trendsTransporter: TrendsTransporter =
        await ReportControllerHandler.showTrendsForm();

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

    showTrends() {
      this.validateEndDate();
      this.validateStartDate();

      if (this.formIsValid) {
        console.log("search");
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
