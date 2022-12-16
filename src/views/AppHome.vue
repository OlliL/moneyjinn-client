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
    <div class="row justify-content-md-center">
      <div class="col-sm-11 col-lg-9 col-xl-6 col-xxl-4 mb-4">
        <ul
          class="list-group"
          v-if="importedMoneyflows || monthlySettlementMissing"
        >
          <li class="list-group-item" v-if="importedMoneyflows">
            <button
              type="button"
              class="btn btn-primary"
              @click="navigateImportMoneyflows()"
            >
              bearbeiten</button
            ><span class="align-middle"
              >&nbsp;Es liegen noch nicht bearbeitete importierte Geldbewegungen
              vor!</span
            >
          </li>
          <li class="list-group-item" v-if="monthlySettlementMissing">
            <button
              type="button"
              class="btn btn-primary"
              @click="showEditMonthlySettlementModal()"
            >
              bearbeiten</button
            ><span class="align-middle"
              >&nbsp;F&uuml;r den vergangenen Monat existiert kein
              Monatsabschlu&szlig;!</span
            >
          </li>
        </ul>
        <div
          class="text-center text-success"
          v-if="!importedMoneyflows && !monthlySettlementMissing"
        >
          Alles erledigt! <i class="bi bi-emoji-smile"></i>
        </div>
      </div>
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
      console.log(events);

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
