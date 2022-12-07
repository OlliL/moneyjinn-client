<template>
  <ModalVue
    :title="'Monatsabschluss ' + monthName + ' ' + year + ' bearbeiten'"
    ref="modalComponent"
  >
    <template #body>
      <div class="row justify-content-md-center mb-4" v-if="dataLoaded">
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

type MonthlySettlementFormData = MonthlySettlement & {
  imported: boolean;
};
type EditMonthlySettlementModal = {
  dataLoaded: boolean;
  year: number;
  month: number;
  monthlySettlementsNoCredit: Array<MonthlySettlementFormData>;
  monthlySettlementsCredit: Array<MonthlySettlementFormData>;
  amountIsValid: boolean | null;
  amountErrorMessage: string;
};

export default defineComponent({
  name: "EditMonthlySettlementModal",
  data(): EditMonthlySettlementModal {
    return {
      dataLoaded: false,
      year: 0,
      month: 0,
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
    async _show(year?: number, month?: number) {
      console.log(year, month);
      this.loadMonthlySettlements(year, month);
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async loadMonthlySettlements(year?: number, month?: number) {
      if (year && month) {
        // FIXME temporary for trying it out.
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
        const monthlySettlementsNoCredit =
          new Array<MonthlySettlementFormData>();

        for (let mms of monthlySettlements) {
          if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
            monthlySettlementsCredit.push(mms);
          } else {
            monthlySettlementsNoCredit.push(mms);
          }
        }

        this.monthlySettlementsCredit = monthlySettlementsCredit;
        this.monthlySettlementsNoCredit = monthlySettlementsNoCredit;
        this.dataLoaded = true;
      }
    },
    validateAmount(amount: number) {
      [this.amountIsValid, this.amountErrorMessage] = validateInputField(
        amount,
        "Betrag angeben!"
      );
    },
    upsertMonthlySettlement() {
      /*
      MonthlySettlementControllerHandler.deleteMonthlySettlement(
        this.year,
        this.month
      );
    */
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("monthlySettlementUpserted", this.year, this.month);
    },
  },
  expose: ["_show"],
  emits: ["monthlySettlementUpserted"],
  components: { ModalVue },
});
</script>
