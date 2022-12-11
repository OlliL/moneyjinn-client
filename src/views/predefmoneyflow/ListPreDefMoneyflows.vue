<template>
  <CreatePreDefMoneyflowModalVue
    ref="createPreDedMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-created="preDefMoneyflowCreated"
    @pre-def-moneyflow-updated="preDefMoneyflowUpdated"
  />
  <DeletePreDefMoneyflowModalVue
    ref="deletePreDedMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-deleted="preDefMoneyflowDeleted"
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
              <nav aria-label="Start letter navigation" v-if="dataLoaded">
                <ul class="pagination month-selection">
                  <li class="page-item">
                    <a
                      :class="
                        $props.letter === '' ? 'page-link active' : 'page-link'
                      "
                      href="#"
                      @click="selectLetter('')"
                      >Alle</a
                    >
                  </li>
                  <li class="page-item" v-for="letter in letters" :key="letter">
                    <a
                      :class="
                        $props.letter === letter
                          ? 'page-link active'
                          : 'page-link'
                      "
                      href="#"
                      @click="selectLetter(letter)"
                      >{{ letter }}</a
                    >
                  </li>
                </ul>
              </nav>
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
import router, { Routes } from "@/router";
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
      dataLoaded: false,
      letters: {} as Array<string>,
      preDefMoneyflows: {} as Array<PreDefMoneyflow>,
      allPreDefMoneyflows: {} as Array<PreDefMoneyflow>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
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

      const letters = this.allPreDefMoneyflows.map((entry) =>
        entry.contractpartnerName.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      this.letters = uniqueLetters;

      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.dataLoaded = false;
      if (letter === "") {
        this.preDefMoneyflows = this.allPreDefMoneyflows;
      } else {
        this.preDefMoneyflows = this.allPreDefMoneyflows.filter(
          (entry) =>
            entry.contractpartnerName.substring(0, 1).toUpperCase() === letter
        );
      }

      this.dataLoaded = true;
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListPreDefMoneyflows,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreatePreDefMoneyflowModal() {
      (
        this.$refs
          .createPreDedMoneyflowModalList as typeof CreatePreDefMoneyflowModalVue
      )._show();
    },
    preDefMoneyflowCreated() {
      this.reloadView();
    },
    editPreDefMoneyflow(mpm: PreDefMoneyflow) {
      (
        this.$refs
          .createPreDedMoneyflowModalList as typeof CreatePreDefMoneyflowModalVue
      )._show(mpm);
    },
    preDefMoneyflowUpdated() {
      this.reloadView();
    },
    deletePreDefMoneyflow(mpm: PreDefMoneyflow) {
      (
        this.$refs
          .deletePreDedMoneyflowModalList as typeof DeletePreDefMoneyflowModalVue
      )._show(mpm);
    },
    preDefMoneyflowDeleted() {
      this.reloadView();
    },
  },
  components: {
    ListPreDefMoneyflowRowVue,
    CreatePreDefMoneyflowModalVue,
    DeletePreDefMoneyflowModalVue,
  },
});
</script>
