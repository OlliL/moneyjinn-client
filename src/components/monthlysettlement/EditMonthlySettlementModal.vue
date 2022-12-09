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
        <div class="col-md-4">
          <div class="form-floating">
            <select
              class="form-select"
              v-model="selectedMonth"
              id="month"
              @change="selectYearMonth"
            >
              <label for="year">Jahr</label
              >>
              <option v-for="i in 12" :value="i" :key="i">
                {{ getMonthName(i) }}
              </option>
            </select>
            <label for="month">Monat</label>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-floating">
            <input
              v-model="selectedYear"
              type="text"
              id="year"
              class="form-control"
              @change="selectYearMonth"
            />
            <label for="year">Jahr</label>
          </div>
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
                      @change="validateAmount(mms.amount)"
                      :class="
                        ' form-control text-end ' + amountErrorData.inputClass
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
                      @change="validateAmount(mms.amount)"
                      :class="
                        ' form-control text-end ' + amountErrorData.inputClass
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
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { getError } from "@/tools/views/ThrowError";

// FIXME: amount fields must get unique ID, validation too. currently errorData is shared among all amount fields

type MonthlySettlementFormData = MonthlySettlement & {
  imported: boolean;
};
type EditMonthlySettlementModal = {
  serverError: Array<String> | undefined;
  dataLoaded: boolean;
  editMode: boolean;
  year: number;
  month: number;
  selectedMonth: number;
  selectedYear: string;
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
      selectedMonth: 0,
      selectedYear: "",
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
    amountErrorData(): ErrorData {
      return generateErrorData(
        this.amountIsValid,
        "Betrag",
        this.amountErrorMessage
      );
    },
  },
  methods: {
    getMonthName(month: number): string {
      return getMonthName(month);
    },
    async _show(year?: number, month?: number) {
      this.loadMonthlySettlements(year, month);
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    selectYearMonth() {
      if (!isNaN(+this.selectedYear)) {
        this.loadMonthlySettlements(+this.selectedYear, this.selectedMonth);
      }
    },
    async loadMonthlySettlements(year?: number, month?: number) {
      const transporter: MonthlySettlementEditTransporter =
        await MonthlySettlementControllerHandler.getMonthlySettlementForEdit(
          year,
          month
        );

      const monthlySettlements = new Array<MonthlySettlementFormData>();

      for (let mms of transporter.monthlySettlements) {
        monthlySettlements.push({ ...mms, imported: false });
      }
      if (transporter.importedMonthlySettlements) {
        for (let mms of transporter.importedMonthlySettlements) {
          monthlySettlements.push({ ...mms, imported: true });
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
      this.selectedYear = transporter.year.toString();
      this.selectedMonth = transporter.month;
      this.editMode = transporter.editMode;
      this.monthlySettlementsCredit = monthlySettlementsCredit;
      this.monthlySettlementsNoCredit = monthlySettlementsNoCredit;
      this.dataLoaded = true;
    },
    validateAmount(amount: number) {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        amount,
        "Betrag angeben!"
      );
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
      let monthlySettlements = new Array<MonthlySettlement>();
      monthlySettlements = this.monthlySettlementsCredit.concat(
        this.monthlySettlementsNoCredit
      );
      const valRes =
        await MonthlySettlementControllerHandler.upsertMonthlySettlement(
          monthlySettlements
        );

      if (this.followUpServerCall(valRes)) {
        (this.$refs.modalComponent as typeof ModalVue)._hide();
        this.$emit("monthlySettlementUpserted", this.year, this.month);
      }
    },
  },
  expose: ["_show"],
  emits: ["monthlySettlementUpserted"],
  components: { ModalVue },
});
</script>
