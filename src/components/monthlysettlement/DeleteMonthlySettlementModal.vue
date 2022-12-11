<template>
  <ModalVue
    :title="'Monatsabschluss ' + monthName + ' ' + year + ' l&ouml;schen?'"
    ref="modalComponent"
  >
    <template #body>
      <div class="row justify-content-md-center mb-4" v-if="month">
        <div class="col">
          <ShowMonthlySettlementVue :year="year" :month="month" />
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteMonthlySettlement"
      >
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import MonthlySettlementControllerHandler from "@/handler/MonthlySettlementControllerHandler";
import { getMonthName } from "@/tools/views/MonthName";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

export default defineComponent({
  name: "DeleteMonthlySettlementModal",
  data() {
    return {
      year: 0,
      month: 0,
    };
  },
  computed: {
    monthName(): string {
      return getMonthName(this.month);
    },
  },
  methods: {
    async _show(year: number, month: number) {
      this.year = year;
      this.month = month;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deleteMonthlySettlement() {
      await MonthlySettlementControllerHandler.deleteMonthlySettlement(
        this.year,
        this.month
      );
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("monthlySettlementDeleted", this.year, this.month);
    },
  },
  expose: ["_show"],
  emits: ["monthlySettlementDeleted"],
  components: { ModalVue, ShowMonthlySettlementVue },
});
</script>
