<template>
  <div class="row justify-content-md-center mb-4">
    <div class="col-md-9 col-xs-12">
      <div class="card w-100 bg-light">
        <div class="card-body">
          <div v-if="serverError">
            <div
              class="alert alert-danger"
              v-for="(error, index) in serverError"
              :key="index"
            >
              {{ error }}
            </div>
          </div>
          <div class="row">
            <div
              style="overflow-x: scroll; white-space: nowrap; height: 400px"
              class="col-md-3 col-xs-12"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receipt.receipt}`"
                style="max-width: 100%"
              />
              <object
                style="height: 75vh; width: 100%"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receipt.receipt}`"
                type="application/pdf"
              ></object>
            </div>
            <div class="col-md-9 col-xs-12">
              <form @submit.prevent="searchMoneyflows">
                <div
                  class="row no-gutters flex-lg-nowrap mb-4 justify-content-center"
                >
                  <div
                    class="col-md-1 col-xs-6 d-flex align-items-center justify-content-end"
                  >
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-search"></i>
                    </button>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="amount"
                          id="receiptAmount"
                          type="number"
                          step="0.01"
                          @change="validateAmount"
                          :class="
                            ' form-control text-end ' +
                            amountErrorData.inputClass
                          "
                        />
                        <label
                          for="amount"
                          :style="'color: ' + amountErrorData.fieldColor"
                          >{{ amountErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-currency-euro"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="startDate"
                          id="receiptStartDate"
                          type="date"
                          @change="validateStartDate"
                          :class="
                            ' form-control ' + startDateErrorData.inputClass
                          "
                        />
                        <label
                          for="receiptStartDate"
                          :style="'color: ' + startDateErrorData.fieldColor"
                          >{{ startDateErrorData.fieldLabel }}</label
                        >
                      </div>
                      <span class="input-group-text"
                        ><i class="bi bi-calendar-date"></i
                      ></span>
                    </div>
                  </div>
                  <div class="col-md-3 col-xs-12">
                    <div class="input-group">
                      <div class="form-floating">
                        <input
                          v-model="endDate"
                          id="receiptEndDate"
                          type="date"
                          @change="validateEndDate"
                          :class="
                            ' form-control ' + endDateErrorData.inputClass
                          "
                        />
                        <label
                          for="receiptStartDate"
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
              </form>
              <div
                class="row no-gutters flex-lg-nowrap mb-4 justify-content-center"
              >
                <div class="col-xs-12">
                  <table
                    class="table table-striped table-bordered table-hover"
                    v-if="searchExecuted && searchSuccessful"
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>Rechnungsdatum</th>
                        <th>Betrag</th>
                        <th>Vertragspartner</th>
                        <th>Kommentar</th>
                        <th colspan="2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <ImportReceiptSearchRowVue
                        v-for="moneyflow in moneyflows"
                        :key="moneyflow.id"
                        :mmf="moneyflow"
                        @delete-moneyflow="emitDeleteMoneyflow"
                        @edit-moneyflow="emitEditMoneyflow"
                        @emit-selection="selectMoneyflow"
                      />
                    </tbody>
                  </table>
                  <div v-if="searchExecuted && !searchSuccessful">
                    Keine passenden Geldbewegungen gefunden!
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row no-gutters flex-lg-nowrap">
            <div class="col-12">
              <button
                type="button"
                class="btn btn-primary mx-2"
                @click="importReceipt"
                v-if="searchExecuted && searchSuccessful"
                :disabled="!moneyflowSelected"
              >
                &uuml;bernehmen
              </button>
              <button
                type="button"
                class="btn btn-danger mx-2"
                @click="deleteReceipt"
              >
                l&ouml;schen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ImportedMoneyflowReceiptControllerHandler from "@/handler/ImportedMoneyflowReceiptControllerHandler";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { toFixed } from "@/tools/math";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getISOStringDate } from "@/tools/views/FormatDate";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent, type PropType } from "vue";
import ImportReceiptSearchRowVue from "./ImportReceiptSearchRow.vue";

type ImportReceiptsRowData = {
  serverError: Array<String> | undefined;
  startDate: string;
  endDate: string;
  amount: number;
  moneyflows: Array<Moneyflow>;
  searchExecuted: boolean;
  searchSuccessful: boolean;
  selectedMoneyflowId: number;
  startDateIsValid: boolean | null;
  startDateErrorMessage: string;
  endDateIsValid: boolean | null;
  endDateErrorMessage: string;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
};

export default defineComponent({
  name: "ImportReceiptsRow",
  data(): ImportReceiptsRowData {
    return {
      serverError: undefined,
      startDate: "",
      endDate: "",
      amount: 0,
      moneyflows: {} as Array<Moneyflow>,
      searchExecuted: false,
      searchSuccessful: false,
      selectedMoneyflowId: 0,
      startDateIsValid: null,
      startDateErrorMessage: "",
      endDateIsValid: null,
      endDateErrorMessage: "",
      amountIsValid: null,
      amountErrorMessage: "",
    };
  },
  mounted() {
    const today = new Date();
    const todayMinus30 = new Date();
    todayMinus30.setDate(todayMinus30.getDate() - 30);

    this.startDate = getISOStringDate(todayMinus30);
    this.endDate = getISOStringDate(today);

    const posOfDot = this.receipt.filename.indexOf(".");
    const amountFromFilename = this.receipt.filename.substring(0, posOfDot);
    if (!isNaN(Number(amountFromFilename))) {
      this.amount = toFixed(+amountFromFilename / 100, 2);
      this.searchMoneyflows();
    }
  },
  props: {
    receipt: {
      type: Object as PropType<ImportedMoneyflowReceipt>,
      required: true,
    },
  },
  computed: {
    isJpeg() {
      return this.receipt.mediaType === "image/jpeg";
    },
    isPdf() {
      return this.receipt.mediaType === "application/pdf";
    },
    moneyflowSelected() {
      return this.selectedMoneyflowId > 0;
    },
    formIsValid(): boolean {
      const isValid =
        this.startDateIsValid && this.endDateIsValid && this.amountIsValid;
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
    amountErrorData(): ErrorData {
      return generateErrorData(
        this.amountIsValid,
        "Betrag",
        this.amountErrorMessage
      );
    },
  },
  emits: ["deleteMoneyflow", "editMoneyflow", "removeReceiptFromView"],
  methods: {
    async searchMoneyflows() {
      this.validateAmount();
      this.validateEndDate();
      this.validateStartDate();

      if (this.formIsValid) {
        this.searchExecuted = false;
        this.moneyflows =
          await MoneyflowControllerHandler.searchMoneyflowsByAmount(
            this.amount,
            new Date(this.startDate),
            new Date(this.endDate)
          );
        this.searchExecuted = true;
        this.searchSuccessful = this.moneyflows.length > 0;
      }
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
    validateAmount() {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        this.amount,
        "Betrag angeben!"
      );
    },
    emitDeleteMoneyflow(id: number) {
      this.$emit("deleteMoneyflow", id);
    },
    emitEditMoneyflow(id: number) {
      this.$emit("editMoneyflow", id);
    },
    selectMoneyflow(id: number) {
      this.selectedMoneyflowId = id;
      console.log(this.selectedMoneyflowId);
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
        return false;
      }
      return true;
    },
    async importReceipt() {
      const validationResult: ValidationResult =
        await ImportedMoneyflowReceiptControllerHandler.importImportedMoneyflowReceipt(
          this.receipt.id,
          this.selectedMoneyflowId
        );
      if (this.followUpServerCall(validationResult)) {
        this.$emit("removeReceiptFromView", this.receipt.id);
      }
    },
    deleteReceipt() {
      ImportedMoneyflowReceiptControllerHandler.deleteImportedMoneyflowReceiptById(
        this.receipt.id
      );
      this.$emit("removeReceiptFromView", this.receipt.id);
    },
  },
  components: { ImportReceiptSearchRowVue },
});
</script>
