<template>
  <CreatePreDefMoneyflowModalVue
    ref="createPreDefMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-created="reloadView"
    @pre-def-moneyflow-updated="reloadView"
  />
  <DeletePreDefMoneyflowModalVue
    ref="deletePreDefMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-deleted="reloadView"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Vordefinierte Geldbewegungen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <table style="margin: 0 auto">
          <tr>
            <td class="text-right pe-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreatePreDefMoneyflowModal"
              >
                Neu
              </button>
            </td>
            <td>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="searchAllContent"
                >
                  Alle
                </button>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Suchen nach Vertragspartner..."
                  v-model="searchString"
                  @input="searchContent"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Betrag</th>
              <th>Vertragspartner</th>
              <th>Kommentar</th>
              <th>Buchungskonto</th>
              <th>Kapitalquelle</th>
              <th>1x</th>
              <th>angelegt am</th>
              <th>verwendet am</th>
              <th colspan="2"></th>
            </tr>
            <ListPreDefMoneyflowRowVue
              v-for="mpm in preDefMoneyflows"
              :key="mpm.id"
              :mpm="mpm"
              @edit-pre-def-moneyflow="editPreDefMoneyflow"
              @delete-pre-def-moneyflow="deletePreDefMoneyflow"
            />
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import ListPreDefMoneyflowRowVue from "@/components/predefmoneyflow/ListPreDefMoneyflowRow.vue";
import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import DeletePreDefMoneyflowModalVue from "@/components/predefmoneyflow/DeletePreDefMoneyflowModal.vue";

export default defineComponent({
  name: "ListPreDefMoneyflows",
  data() {
    return {
      preDefMoneyflows: {} as Array<PreDefMoneyflow>,
      allPreDefMoneyflows: {} as Array<PreDefMoneyflow>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchString = "";
    this.reloadView();
  },
  computed: {},
  methods: {
    async reloadView() {
      this.allPreDefMoneyflows =
        await PreDefMoneyflowControllerHandler.fetchAllPreDefMoneyflow();

      this.allPreDefMoneyflows.sort((a, b) => {
        return a.contractpartnerName
          .toUpperCase()
          .localeCompare(b.contractpartnerName.toUpperCase());
      });
      this.searchContent();
    },
    showCreatePreDefMoneyflowModal() {
      (
        this.$refs
          .createPreDefMoneyflowModalList as typeof CreatePreDefMoneyflowModalVue
      )._show();
    },
    editPreDefMoneyflow(mpm: PreDefMoneyflow) {
      (
        this.$refs
          .createPreDefMoneyflowModalList as typeof CreatePreDefMoneyflowModalVue
      )._show(mpm);
    },
    deletePreDefMoneyflow(mpm: PreDefMoneyflow) {
      (
        this.$refs
          .deletePreDefMoneyflowModalList as typeof DeletePreDefMoneyflowModalVue
      )._show(mpm);
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    searchContent() {
      let mpm = this.allPreDefMoneyflows;
      if (this.searchString === "") {
        this.preDefMoneyflows = mpm;
      }

      const commentUpper = this.searchString.toUpperCase();
      this.preDefMoneyflows = mpm.filter((entry) =>
        entry.contractpartnerName.toUpperCase().includes(commentUpper)
      );
    },
  },
  components: {
    ListPreDefMoneyflowRowVue,
    CreatePreDefMoneyflowModalVue,
    DeletePreDefMoneyflowModalVue,
  },
});
</script>
