<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  &nbsp;
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import type { Events } from "@/model/event/Events";
import EventControllerHandler from "@/handler/EventControllerHandler";

export default defineComponent({
  name: "HomeView",
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const events: Events = await EventControllerHandler.showEventList();
      console.log(events);
      //FIXME: Display link to import Moneyflows if they exist
      //FIXME: Display Modal-Link for Monthly Settlement-Creation if needed
    },
    showEditMonthlySettlementModal(year?: number, month?: number) {
      (this.$refs.editModal as typeof EditMonthlySettlementModalVue)._show(
        year,
        month
      );
    },
    monthlySettlementUpserted() {},
  },
  components: {
    EditMonthlySettlementModalVue,
  },
});
</script>
