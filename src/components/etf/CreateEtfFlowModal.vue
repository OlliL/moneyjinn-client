<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtfFlow" id="createEtfFlowForm">
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
          <div class="row">
            <div class="col-xs-12">
              <div class="form-floating">
                <select
                  v-model="etfFlow.isin"
                  id="etf"
                  @change="validateEtf"
                  :class="'form-select form-control ' + etfErrorData.inputClass"
                >
                  <option v-for="etf in etfs" :key="etf.isin" :value="etf.isin">
                    {{ etf.name }}
                  </option>
                </select>

                <label for="etf" :style="'color: ' + etfErrorData.fieldColor">{{
                  etfErrorData.fieldLabel
                }}</label>
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <DatepickerVue
                id="bookingdate"
                :label="bookingdateErrorData.fieldLabel"
                :default-date="bookingdate"
                :input-class="
                  ' form-control ' + bookingdateErrorData.inputClass
                "
                :label-style="'color: ' + bookingdateErrorData.fieldColor"
                @date-selected="bookingdateSelected"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="bookingtime"
                  id="bookingtime"
                  type="text"
                  @change="validateBookingtime"
                  :class="'form-control ' + bookingtimeErrorData.inputClass"
                />
                <label
                  for="bookingtime"
                  :style="'color: ' + bookingtimeErrorData.fieldColor"
                  >{{ bookingtimeErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="etfFlow.amount"
                  id="amount"
                  type="number"
                  step="0.001"
                  @change="validateAmount"
                  :class="'form-control ' + amountErrorData.inputClass"
                />
                <label
                  for="amount"
                  :style="'color: ' + amountErrorData.fieldColor"
                  >{{ amountErrorData.fieldLabel }}</label
                >
              </div>
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="input-group">
                <div class="form-floating">
                  <input
                    v-model="etfFlow.price"
                    id="price"
                    type="number"
                    step="0.001"
                    @change="validatePrice"
                    :class="
                      ' form-control text-end ' + priceErrorData.inputClass
                    "
                  />
                  <label
                    for="price"
                    :style="'color: ' + priceErrorData.fieldColor"
                    >{{ priceErrorData.fieldLabel }}</label
                  >
                </div>
                <span class="input-group-text"
                  ><i class="bi bi-currency-euro"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :form="'createEtfFlowForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { EtfFlow } from "@/model/etf/EtfFlow";
import EtfFlowControllerHandler from "@/handler/EtfControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import { getError } from "@/tools/views/ThrowError";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { formatTime } from "@/tools/views/FormatDate";
import type { Etf } from "@/model/etf/Etf";
import DatepickerVue from "../Datepicker.vue";

type CreateEtfFlowModalData = {
  etfs: Array<Etf>;
  etfFlow: EtfFlow;
  origEtfFlow: EtfFlow | undefined;
  bookingdate: Date | undefined;
  bookingtime: string;
  serverError: Array<String>;
  etfIsValid: boolean | null;
  etfErrorMessage: string;
  bookingdateIsValid: boolean | null;
  bookingdateErrorMessage: string;
  bookingtimeIsValid: boolean | null;
  bookingtimeErrorMessage: string;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
  priceIsValid: boolean | null;
  priceErrorMessage: string;
};
export default defineComponent({
  name: "CreateEtfFlowModal",
  data(): CreateEtfFlowModalData {
    return {
      etfs: {} as Array<Etf>,
      etfFlow: {} as EtfFlow,
      origEtfFlow: undefined,
      bookingdate: undefined,
      bookingtime: "",
      serverError: {} as Array<String>,
      etfIsValid: null,
      etfErrorMessage: "",
      bookingdateIsValid: null,
      bookingdateErrorMessage: "",
      bookingtimeIsValid: null,
      bookingtimeErrorMessage: "",
      amountIsValid: null,
      amountErrorMessage: "",
      priceIsValid: null,
      priceErrorMessage: "",
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
  },
  computed: {
    formIsValid(): boolean {
      const isValid =
        this.etfIsValid &&
        this.bookingdateIsValid &&
        this.bookingtimeIsValid &&
        this.amountIsValid &&
        this.priceIsValid;
      if (isValid) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origEtfFlow === undefined
        ? "ETF Buchung hinzufügen"
        : "ETF Buchung bearbeiten";
    },
    etfErrorData(): ErrorData {
      return generateErrorData(this.etfIsValid, "ETF", this.etfErrorMessage);
    },
    bookingdateErrorData(): ErrorData {
      return generateErrorData(
        this.bookingdateIsValid,
        "Buchungsdatum",
        this.bookingdateErrorMessage
      );
    },
    bookingtimeErrorData(): ErrorData {
      return generateErrorData(
        this.bookingtimeIsValid,
        "Buchungszeit",
        this.bookingtimeErrorMessage
      );
    },
    amountErrorData(): ErrorData {
      return generateErrorData(
        this.amountIsValid,
        "Stück",
        this.amountErrorMessage
      );
    },
    priceErrorData(): ErrorData {
      return generateErrorData(
        this.priceIsValid,
        "Stückpreis",
        this.priceErrorMessage
      );
    },
  },
  methods: {
    async _show(etfs: Array<Etf>, etfFlow?: EtfFlow) {
      this.etfs = etfs;
      this.origEtfFlow = etfFlow ? etfFlow : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      if (this.origEtfFlow) {
        const bookingDate = new Date(this.origEtfFlow.timestamp);

        this.etfFlow = {
          amount: this.origEtfFlow.amount,
          etfflowid: this.origEtfFlow.etfflowid,
          isin: this.origEtfFlow.isin,
          nanoseconds: this.origEtfFlow.nanoseconds,
          price: this.origEtfFlow.price,
          timestamp: this.origEtfFlow.timestamp,
        };

        const timestamp = new Date(this.etfFlow.timestamp);
        this.bookingdate = bookingDate;
        this.bookingtime =
          formatTime(timestamp) +
          ":" +
          String(this.etfFlow.nanoseconds + 1000000000).substring(1, 4); //80000000 -> 1080000000 -> 080
      } else {
        const bookingDate = new Date();

        this.etfFlow = {} as EtfFlow;
        this.bookingdate = bookingDate;
        this.bookingtime = "";
        this.etfFlow.isin = this.etfs[0].isin;
      }
      this.etfIsValid = null;
      this.etfErrorMessage = "";
      this.bookingdateIsValid = null;
      this.bookingdateErrorMessage = "";
      this.bookingtimeIsValid = null;
      this.bookingtimeErrorMessage = "";
      this.amountIsValid = null;
      this.amountErrorMessage = "";
      this.priceIsValid = null;
      this.priceErrorMessage = "";

      this.serverError = {} as Array<String>;
    },
    validateEtf() {
      [this.etfIsValid, this.etfErrorMessage] = validateInputField(
        this.etfFlow.isin,
        "ETF auswählen!"
      );
    },
    validateBookingdate() {
      [this.bookingdateIsValid, this.bookingdateErrorMessage] =
        validateInputField(this.etfFlow.timestamp, "Buchungsdatum angeben!");
    },
    validateBookingtime() {
      const message = "Buchungszeit im Format 00:00:00:000 angeben!";
      [this.bookingtimeIsValid, this.bookingtimeErrorMessage] =
        validateInputField(this.bookingtime, message);
      if (
        !/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]:[0-9]{3}$/.test(this.bookingtime)
      ) {
        this.bookingtimeIsValid = false;
        this.bookingtimeErrorMessage = message;
      }
    },
    validateAmount() {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        this.etfFlow.amount,
        "Stück angeben!"
      );
    },
    validatePrice() {
      [this.priceIsValid, this.priceErrorMessage] = validateInputField(
        this.etfFlow.price,
        "Stückpreis angeben!"
      );
    },
    bookingdateSelected(date: Date) {
      this.etfFlow.timestamp = date;
      this.validateBookingdate();
    },
    handleServerError(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
      }
      return !validationResult.result;
    },

    async createEtfFlow() {
      this.validateEtf();
      this.validateBookingdate();
      this.validateBookingtime();
      this.validateAmount();
      this.validatePrice();

      if (this.formIsValid) {
        const times: Array<string> = this.bookingtime.split(":");
        const bookingDate = this.bookingdate;
        if (times && times.length == 4 && bookingDate) {
          this.etfFlow.timestamp = bookingDate;
          this.etfFlow.timestamp.setHours(+times[0], +times[1], +times[2], 0);
          this.etfFlow.nanoseconds = +times[3] * 1000000;

          if (this.etfFlow.etfflowid > 0) {
            //update
            const validationResult =
              await EtfFlowControllerHandler.updateEtfFlow(this.etfFlow);
            if (!this.handleServerError(validationResult)) {
              (this.$refs.modalComponent as typeof ModalVue)._hide();
              this.$emit("etfFlowUpdated", this.etfFlow);
            }
          } else {
            //create
            const etfFlowValidation =
              await EtfFlowControllerHandler.createEtfFlow(this.etfFlow);
            const validationResult = etfFlowValidation.validationResult;

            if (!this.handleServerError(validationResult)) {
              this.etfFlow = etfFlowValidation.etfFlow;
              (this.$refs.modalComponent as typeof ModalVue)._hide();
              this.$emit("etfFlowCreated", this.etfFlow);
            }
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["etfFlowCreated", "etfFlowUpdated"],
  components: { ModalVue, DatepickerVue },
});
</script>
