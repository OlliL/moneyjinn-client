<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Datenvergleich</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-2">
      <div class="col-xxl-7 col-md-8 col-sm-10 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="compareData">
              <div class="container-fluid">
                <div v-if="serverError">
                  <div
                    class="alert alert-danger"
                    v-for="(error, index) in serverError"
                    :key="index"
                  >
                    {{ error }}
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-md-3 col-xs-12 mb-2">
                    <DatepickerVue
                      id="startDate"
                      :label="startDateErrorData.fieldLabel"
                      :default-date="startDate"
                      :input-class="
                        ' form-control ' + startDateErrorData.inputClass
                      "
                      :label-style="'color: ' + startDateErrorData.fieldColor"
                      @date-selected="startDateSelected"
                    />
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <DatepickerVue
                      id="endDate"
                      :label="endDateErrorData.fieldLabel"
                      :default-date="endDate"
                      :input-class="
                        ' form-control ' + endDateErrorData.inputClass
                      "
                      :label-style="'color: ' + endDateErrorData.fieldColor"
                      @date-selected="endDateSelected"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12">
                    <CapitalsourceSelectVue
                      :field-color="capitalsourceErrorData.fieldColor"
                      :field-label="capitalsourceErrorData.fieldLabel"
                      :input-class="capitalsourceErrorData.inputClass"
                      :validity-date="new Date()"
                      :selected-id="capitalsourceId"
                      id-suffix="CompareData"
                      @capitalsource-selected="onCapitalsourceSelected"
                    />
                  </div>
                  <div class="col-md-2 col-xs-12 d-flex align-items-center">
                    <div class="form-check form-switch text-start">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="sourceIsImport"
                        v-model="sourceIsImport"
                      />
                      <label class="form-check-label" for="sourceIsImport">{{
                        sourceIsImportLabel
                      }}</label>
                    </div>
                  </div>
                </div>
                <div
                  class="row no-gutters flex-lg-nowrap d-flex align-items-center"
                  v-if="!sourceIsImport"
                >
                  <div class="col-md-6 col-xs-12 mb-2 text-start">
                    <label
                      for="input"
                      :style="
                        'opacity: .65; color: ' + uploadFileErrorData.fieldColor
                      "
                      ><small>{{
                        uploadFileErrorData.fieldLabel
                      }}</small></label
                    >
                    <input
                      type="file"
                      :class="' form-control ' + uploadFileErrorData.inputClass"
                      id="input"
                      multiple
                      ref="fileUpload"
                      @change="validateUploadFile"
                    />
                  </div>
                  <div class="col-md-4 col-xs-12 mb-2">
                    <div class="form-floating">
                      <select
                        v-model="compareDataFormat"
                        id="compareDataFormat"
                        @change="validateCompareDataFormat"
                        :class="
                          'form-select form-control ' +
                          compareDataFormatErrorData.inputClass
                        "
                      >
                        <option
                          v-for="cdf of compareDataFormats"
                          :key="cdf.formatId"
                          :value="cdf.formatId"
                        >
                          {{ cdf.name }}
                        </option>
                      </select>

                      <label
                        for="compareDataFormat"
                        :style="
                          'color: ' + compareDataFormatErrorData.fieldColor
                        "
                        >{{ compareDataFormatErrorData.fieldLabel }}</label
                      >
                    </div>
                  </div>
                </div>
                <div class="row no-gutters flex-lg-nowrap mt-2">
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
    <div class="row justify-content-md-center mt-4" v-if="dataCompared">
      <div class="col-xxl-7 col-md-8 col-sm-10 col-xs-12">
        <table class="table table-striped table-bordered">
          <col style="width: 10%" />
          <col style="width: 90%" />
          <tbody>
            <tr>
              <th :class="compareDatasNotInDatabaseCountClass">
                {{ compareDatasNotInDatabaseCount }}
              </th>
              <td class="text-start">
                Datens&auml;tze die in der Export-Datei, aber nicht in der
                Datenbank, enthalten sind
              </td>
            </tr>
            <tr>
              <th :class="compareDatasNotInFileCountClass">
                {{ compareDatasNotInFileCount }}
              </th>
              <td class="text-start">
                Datens&auml;tze die in der Datenbank, aber nicht in der
                Export-Datei, enthalten sind
              </td>
            </tr>
            <tr>
              <th :class="compareDatasWrongCapitalsourceCountClass">
                {{ compareDatasWrongCapitalsourceCount }}
              </th>
              <td class="text-start">
                passende Datens&auml;tze jedoch mit falscher Kapitalquelle
              </td>
            </tr>
            <tr>
              <th :class="compareDatasMatchingCountClass">
                {{ compareDatasMatchingCount }}
              </th>
              <td class="text-start">passende Datens&auml;tze</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CompareDataControllerHandler from "@/handler/CompareDataControllerHandler";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import DatepickerVue from "@/components/Datepicker.vue";
import CapitalsourceSelectVue from "@/components/capitalsource/CapitalsourceSelect.vue";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { CompareDataFormat } from "@/model/comparedata/CompareDataFormat";
import type { CompareData } from "@/model/comparedata/CompareData";

type CompareDataData = {
  serverError: Array<String> | undefined;
  dataLoaded: boolean;
  dataCompared: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  capitalsourceId: number;
  sourceIsImport: boolean;
  compareDataFormat: number;
  compareDataFormats: Array<CompareDataFormat>;
  startDateIsValid: boolean | null;
  startDateErrorMessage: string;
  endDateIsValid: boolean | null;
  endDateErrorMessage: string;
  capitalsourceIsValid: boolean | null;
  capitalsourceErrorMessage: string;
  compareDataFormatIsValid: boolean | null;
  compareDataFormatErrorMessage: string;
  uploadFileIsValid: boolean | null;
  uploadFileErrorMessage: string;
  compareDatasMatching: Array<CompareData> | undefined;
  compareDatasWrongCapitalsource: Array<CompareData> | undefined;
  compareDatasNotInFile: Array<CompareData> | undefined;
  compareDatasNotInDatabase: Array<CompareData> | undefined;
};
export default defineComponent({
  name: "CompareData",
  data(): CompareDataData {
    return {
      serverError: undefined,
      dataLoaded: false,
      dataCompared: false,
      startDate: undefined,
      endDate: undefined,
      capitalsourceId: 0,
      sourceIsImport: true,
      compareDataFormat: 0,
      compareDataFormats: {} as Array<CompareDataFormat>,
      startDateIsValid: null,
      startDateErrorMessage: "",
      endDateIsValid: null,
      endDateErrorMessage: "",
      capitalsourceIsValid: null,
      capitalsourceErrorMessage: "",
      compareDataFormatIsValid: null,
      compareDataFormatErrorMessage: "",
      uploadFileIsValid: null,
      uploadFileErrorMessage: "",
      compareDatasMatching: undefined,
      compareDatasWrongCapitalsource: undefined,
      compareDatasNotInFile: undefined,
      compareDatasNotInDatabase: undefined,
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    sourceIsImportLabel(): string {
      return this.sourceIsImport ? "Datenimport" : "Datei";
    },
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
        "Kapitalquelle",
        this.capitalsourceErrorMessage
      );
    },
    compareDataFormatErrorData(): ErrorData {
      return generateErrorData(
        this.compareDataFormatIsValid,
        "Format",
        this.compareDataFormatErrorMessage
      );
    },
    uploadFileErrorData(): ErrorData {
      return generateErrorData(
        this.uploadFileIsValid,
        "Importdatei",
        this.uploadFileErrorMessage
      );
    },
    compareDatasMatchingCount(): number {
      return this.compareDatasMatching ? this.compareDatasMatching.length : 0;
    },
    compareDatasMatchingCountClass(): string {
      return this.compareDatasMatchingCount > 0
        ? "text-success"
        : "text-danger";
    },
    compareDatasWrongCapitalsourceCount(): number {
      return this.compareDatasWrongCapitalsource
        ? this.compareDatasWrongCapitalsource.length
        : 0;
    },
    compareDatasWrongCapitalsourceCountClass(): string {
      return this.compareDatasWrongCapitalsourceCount > 0
        ? "text-danger"
        : "text-success";
    },
    compareDatasNotInFileCount(): number {
      return this.compareDatasNotInFile ? this.compareDatasNotInFile.length : 0;
    },
    compareDatasNotInFileCountClass(): string {
      return this.compareDatasNotInFileCount > 0
        ? "text-danger"
        : "text-success";
    },
    compareDatasNotInDatabaseCount(): number {
      return this.compareDatasNotInDatabase
        ? this.compareDatasNotInDatabase.length
        : 0;
    },
    compareDatasNotInDatabaseCountClass(): string {
      return this.compareDatasNotInDatabaseCount > 0
        ? "text-danger"
        : "text-success";
    },
  },
  methods: {
    async loadData() {
      this.dataLoaded = false;
      const compareDataParameter: CompareDataParameter =
        await CompareDataControllerHandler.showCompareDataForm();

      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      this.startDate = startDate;
      this.endDate = endDate;
      this.sourceIsImport = compareDataParameter.selectedSourceIsImport;
      this.compareDataFormat = compareDataParameter.selectedCompareDataFormat;
      this.compareDataFormats = compareDataParameter.compareDataFormats;
      this.capitalsourceId = compareDataParameter.selectedCapitalSourceId;

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
    validateCompareDataFormat() {
      [this.compareDataFormatIsValid, this.compareDataFormatErrorMessage] =
        validateInputField(this.compareDataFormat, "Format angeben!");
    },
    validateCapitalsource() {
      [this.capitalsourceIsValid, this.capitalsourceErrorMessage] =
        validateInputField(this.capitalsourceId, "Kapitalquelle angeben!");
    },
    validateUploadFile() {
      const filesElement = this.$refs.fileUpload as HTMLInputElement;
      const files = filesElement.files;
      [this.uploadFileIsValid, this.uploadFileErrorMessage] =
        validateInputField(
          files != null && files.length === 1,
          "Datei angeben!"
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
    onCapitalsourceSelected(capitalsource: Capitalsource) {
      if (capitalsource) {
        this.capitalsourceId = capitalsource.id;
      } else {
        this.capitalsourceId = 0;
      }
      this.validateCapitalsource();
    },
    async compareData() {
      this.validateEndDate();
      this.validateStartDate();
      this.validateCapitalsource();
      this.dataCompared = false;
      this.serverError = undefined;

      let formIsValid: boolean | null = this.formIsValid;
      if (!this.sourceIsImport) {
        this.validateCompareDataFormat();
        this.validateUploadFile();
        formIsValid =
          formIsValid &&
          this.compareDataFormatIsValid &&
          this.uploadFileIsValid;
      }

      if (formIsValid && this.startDate && this.endDate) {
        const compareDataParameter = {
          startDate: this.startDate,
          endDate: this.endDate,
          selectedCapitalSourceId: this.capitalsourceId,
          selectedSourceIsImport: this.sourceIsImport,
        } as CompareDataParameter;

        if (!this.sourceIsImport) {
          const filesElement = this.$refs.fileUpload as HTMLInputElement;
          const files = filesElement.files;

          if (files != null && files.length === 1) {
            const file = files[0];
            const arrayBuffer = new Uint8Array(await file.arrayBuffer());
            let fileContents: string = "";
            for (var i = 0; i < arrayBuffer.byteLength; i++) {
              fileContents += String.fromCharCode(arrayBuffer[i]);
            }
            compareDataParameter.fileContents = btoa(fileContents);
            compareDataParameter.selectedCompareDataFormat =
              this.compareDataFormat;
          }
        }

        try {
          const compareDataResult: CompareDataResult =
            await CompareDataControllerHandler.compareData(
              compareDataParameter
            );

          this.compareDatasMatching = compareDataResult.compareDatasMatching;
          this.compareDatasNotInDatabase =
            compareDataResult.compareDatasNotInDatabase;
          this.compareDatasNotInFile = compareDataResult.compareDatasNotInFile;
          this.compareDatasWrongCapitalsource =
            compareDataResult.compareDatasWrongCapitalsource;

          this.dataCompared = true;
        } catch (e) {
          this.serverError = new Array<string>();
          this.serverError.push((e as Error).message);
        }
      }
    },
  },
  components: { DatepickerVue, CapitalsourceSelectVue },
});
</script>
