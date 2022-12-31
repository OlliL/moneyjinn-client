<template>
  <ModalVue
    :title="'Monatsabschluss ' + (editMode ? 'bearbeiten' : 'hinzufügen')"
    ref="modalComponent"
  >
    <template #body v-if="dataLoaded">
      <div v-if="serverError">
        <div
          class="alert alert-danger"
          v-for="(error, index) in serverError"
          :key="index"
        >
          {{ error }}
        </div>
      </div>
      <div class="row justify-content-md-center mb-4">
        <div class="col-6">
          <DatepickerVue
            id="selectedMonth"
            label="Monat"
            pick-mode="month"
            :default-date="selectedMonth"
            input-class="form-control"
            @date-selected="onDateSelected"
          />
        </div>
      </div>
      <div class="row justify-content-md-center mb-4">
        <div class="col">
          <table
            class="table table-striped table-bordered table-hover"
            v-if="monthlySettlementsNoCredit"
          >
            <col style="width: 60%" />
            <col style="width: 40%" />
            <thead>
              <tr>
                <th>Kapitalquelle</th>
                <th>Betrag</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mms in monthlySettlementsNoCredit" :key="mms.id">
                <td class="text-start">{{ mms.capitalsourceComment }}</td>
                <td>
                  <div class="input-group">
                    <input
                      v-model="mms.amount"
                      id="amount"
                      type="number"
                      step="0.01"
                      @change="validateAmount(mms)"
                      :class="
                        ' form-control text-end ' + mms.errorData.inputClass
                      "
                      ref="amountRef"
                      :disabled="mms.imported"
                    />
                    <span class="input-group-text"
                      ><i class="bi bi-currency-euro"></i
                    ></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            class="table table-striped table-bordered table-hover"
            v-if="monthlySettlementsCredit"
          >
            <col style="width: 60%" />
            <col style="width: 40%" />
            <thead v-if="!monthlySettlementsNoCredit">
              <tr>
                <th>Kapitalquelle</th>
                <th>Betrag</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mms in monthlySettlementsCredit" :key="mms.id">
                <td class="text-start">{{ mms.capitalsourceComment }}</td>
                <td>
                  <div class="input-group">
                    <input
                      v-model="mms.amount"
                      id="amountCredit"
                      type="number"
                      step="0.01"
                      @change="validateAmount(mms)"
                      :class="
                        ' form-control text-end ' + mms.errorData.inputClass
                      "
                      ref="amountCreditRef"
                      :disabled="mms.imported"
                    />
                    <span class="input-group-text"
                      ><i class="bi bi-currency-euro"></i
                    ></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="upsertMonthlySettlement"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getMonthName } from "@/tools/views/MonthName";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { getError } from "@/tools/views/ThrowError";
import DatepickerVue from "../Datepicker.vue";

type MonthlySettlementFormData = MonthlySettlement & {
  imported: boolean;
  isValid: boolean | null;
  errorData: ErrorData;
};
type EditMonthlySettlementModal = {
  serverError: Array<String> | undefined;
  dataLoaded: boolean;
  editMode: boolean;
  year: number;
  month: number;
  selectedMonth: Date | undefined;
  monthlySettlementsNoCredit: Array<MonthlySettlementFormData>;
  monthlySettlementsCredit: Array<MonthlySettlementFormData>;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
};

export default defineComponent({
  name: "EditMonthlySettlementModal",
  data(): EditMonthlySettlementModal {
    return {
      serverError: undefined,
      dataLoaded: false,
      editMode: false,
      year: 0,
      month: 0,
      selectedMonth: undefined,
      monthlySettlementsNoCredit: {} as Array<MonthlySettlementFormData>,
      monthlySettlementsCredit: {} as Array<MonthlySettlementFormData>,
      amountIsValid: null,
      amountErrorMessage: "",
    };
  },
  computed: {
    monthName(): string {
      return getMonthName(this.month);
    },
  },
  methods: {
    amountErrorData(isValid: boolean | null): ErrorData {
      return generateErrorData(isValid, "Betrag", "Betrag angeben!");
    },
    validateAmount(mms: MonthlySettlementFormData) {
      mms.isValid = mms.amount + "" === "" ? false : true;
      mms.errorData = this.amountErrorData(mms.isValid);
    },
    getMonthName(month: number): string {
      return getMonthName(month);
    },
    async _show(year?: number, month?: number) {
      if (year && month) {
        const monthDate = new Date();
        monthDate.setFullYear(year);
        monthDate.setMonth(month - 1);
        this.selectedMonth = monthDate;
      } else {
        this.selectedMonth = undefined;
      }
      this.loadMonthlySettlements();
      this.serverError = new Array<String>();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    onDateSelected(selectedDate: Date) {
      this.selectedMonth = selectedDate;
      this.loadMonthlySettlements();
    },
    async loadMonthlySettlements() {
      let year = undefined;
      let month = undefined;
      if (this.selectedMonth) {
        year = this.selectedMonth.getFullYear();
        month = this.selectedMonth.getMonth() + 1;
      }
      const transporter: MonthlySettlementEditTransporter =
        await MonthlySettlementControllerHandler.getMonthlySettlementForEdit(
          year,
          month
        );

      const monthlySettlements = new Array<MonthlySettlementFormData>();

      for (let mms of transporter.monthlySettlements) {
        monthlySettlements.push({
          ...mms,
          imported: false,
          isValid: null,
          errorData: this.amountErrorData(null),
        });
      }
      if (transporter.importedMonthlySettlements) {
        for (let mms of transporter.importedMonthlySettlements) {
          monthlySettlements.push({
            ...mms,
            imported: false,
            isValid: null,
            errorData: this.amountErrorData(null),
          });
        }
      }

      const monthlySettlementsCredit = new Array<MonthlySettlementFormData>();
      const monthlySettlementsNoCredit = new Array<MonthlySettlementFormData>();

      for (let mms of monthlySettlements) {
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          monthlySettlementsCredit.push(mms);
        } else {
          monthlySettlementsNoCredit.push(mms);
        }
      }

      this.year = transporter.year;
      this.month = transporter.month;
      const monthDate = new Date();
      monthDate.setFullYear(transporter.year);
      monthDate.setDate(1);
      monthDate.setMonth(transporter.month - 1);

      this.selectedMonth = monthDate;
      this.editMode = transporter.editMode;
      this.monthlySettlementsCredit = monthlySettlementsCredit;
      this.monthlySettlementsNoCredit = monthlySettlementsNoCredit;
      this.dataLoaded = true;
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
    async upsertMonthlySettlement() {
      let monthlySettlements = new Array<MonthlySettlementFormData>();
      monthlySettlements = this.monthlySettlementsCredit.concat(
        this.monthlySettlementsNoCredit
      );

      let isValid = true;
      for (let mms of monthlySettlements) {
        this.validateAmount(mms);

        if (mms.isValid === false) {
          isValid = false;
        }
      }

      if (isValid) {
        const valRes =
          await MonthlySettlementControllerHandler.upsertMonthlySettlement(
            monthlySettlements
          );

        if (this.followUpServerCall(valRes)) {
          (this.$refs.modalComponent as typeof ModalVue)._hide();
          this.$emit("monthlySettlementUpserted", this.year, this.month);
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["monthlySettlementUpserted"],
  components: { ModalVue, DatepickerVue },
});
</script>
