<template>
  <EditMonthlySettlementModalVue
    ref="editModal"
    @monthly-settlement-upserted="monthlySettlementUpserted"
  />
  <div class="container-fluid">
    <div class="row justify-content-md-center text-center">
      <div class="col-xs-12 mb-4">
        <h4>Aufgabenliste</h4>
      </div>
    </div>
    <div class="row justify-content-md-center" v-if="importedMoneyflows">
      <div class="col-4 col-sm-2 col-lg-2 col-xl-1 col-xxl-1 mb-4 text-end">
        <button
          type="button"
          class="btn btn-primary"
          @click="navigateImportMoneyflows()"
        >
          bearbeiten
        </button>
      </div>
      <div
        class="col-8 col-sm-10 col-lg-8 col-xl-6 col-xxl-4 mb-4 d-flex align-items-center"
      >
        Es liegen noch nicht bearbeitete importierte Geldbewegungen vor!
      </div>
    </div>
    <div class="row justify-content-md-center" v-if="monthlySettlementMissing">
      <div class="col-4 col-sm-2 col-lg-2 col-xl-1 col-xxl-1 mb-4 text-end">
        <button
          type="button"
          class="btn btn-primary"
          @click="showEditMonthlySettlementModal()"
        >
          bearbeiten
        </button>
      </div>
      <div
        class="col-8 col-sm-10 col-lg-8 col-xl-6 col-xxl-4 mb-4 d-flex align-items-center"
      >
        F&uuml;r den vergangenen Monat existiert kein Monatsabschlu&szlig;!
      </div>
    </div>
    <div
      class="text-center text-success"
      v-if="!importedMoneyflows && !monthlySettlementMissing"
    >
      Alles erledigt! <i class="bi bi-emoji-smile"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditMonthlySettlementModalVue from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import type { Events } from "@/model/event/Events";
import EventControllerHandler from "@/handler/EventControllerHandler";
import router, { Routes } from "@/router";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      importedMoneyflows: false,
      monthlySettlementMissing: false,
      monthlySettlementMonth: 0,
      monthlySettlementYear: 0,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const events: Events = await EventControllerHandler.showEventList();

      if (events.numberOfImportedMoneyflows > 0) {
        this.importedMoneyflows = true;
      }
      this.monthlySettlementMissing = events.monthlySettlementMissing;
      this.monthlySettlementMonth = events.monthlySettlementMonth;
      this.monthlySettlementYear = events.monthlySettlementYear;
    },
    showEditMonthlySettlementModal() {
      (this.$refs.editModal as typeof EditMonthlySettlementModalVue)._show(
        this.monthlySettlementYear,
        this.monthlySettlementMonth
      );
    },
    monthlySettlementUpserted() {
      this.monthlySettlementMissing = false;
    },
    navigateImportMoneyflows() {
      router.push({
        name: Routes.ImportMoneyflows,
      });
    },
  },
  components: {
    EditMonthlySettlementModalVue,
  },
});
</script>
