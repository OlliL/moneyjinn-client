<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModalList"
    id-suffix="List"
    @contractpartner-created="contractpartnerCreated"
    @contractpartner-updated="contractpartnerUpdated"
  />
  <DeleteContractpartnerModalVue
    ref="deleteModal"
    @contractpartner-deleted="contractpartnerDeleted"
  />

  <ListContractpartnerAccountsModalVue ref="accountsModal" />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Vertragspartner</h4>
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
                @click="showCreateContractpartnerModal"
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
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-auto">
        <form action="#">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="contractpartnersValid"
              v-model="validNow"
              @change="reloadView"
            />
            <label class="form-check-label" for="contractpartnersValid"
              >Jetzt g&uuml;ltig</label
            >
          </div>
        </form>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>g&uuml;ltig ab</th>
              <th>g&uuml;ltig bis</th>
              <th>Standard Kommentar</th>
              <th>Standard Buchungskonto</th>
              <th colspan="3"></th>
            </tr>
          </thead>
          <tbody>
            <ListContractpartnerRowVue
              v-for="mcp in contractpartners"
              :key="mcp.id"
              :mcp="mcp"
              @delete-contractpartner="deleteContractpartner"
              @edit-contractpartner="editContractpartner"
              @list-contractpartner-accounts="listContractpartnerAccounts"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import router, { Routes } from "@/router";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import ListContractpartnerRowVue from "@/components/contractpartner/ListContractpartnerRow.vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import DeleteContractpartnerModalVue from "@/components/contractpartner/DeleteContractpartnerModal.vue";
import ListContractpartnerAccountsModalVue from "@/components/contractpartneraccount/ListContractpartnerAccountsModal.vue";
export default defineComponent({
  name: "ListContractpartners",
  data() {
    return {
      dataLoaded: false,
      validNow: false,
      letters: {} as Array<string>,
      contractpartners: {} as Array<Contractpartner>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.loadData(this.$props.letter);
    this.dataLoaded = true;
  },
  computed: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  methods: {
    ...mapActions(useContractpartnerStore, ["getContractpartnerLetters"]),
    ...mapActions(useContractpartnerStore, ["getContractpartnerForLetter"]),
    reloadView() {
      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.letters = await this.getContractpartnerLetters(this.validNow);
      this.contractpartners = this.getContractpartnerForLetter(
        letter,
        this.validNow
      );
      if (this.contractpartners.length === 0) this.selectLetter("");
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListContractpartners,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreateContractpartnerModal() {
      (
        this.$refs
          .createContractpartnerModalList as typeof CreateContractpartnerModalVue
      )._show();
    },
    contractpartnerCreated() {
      this.reloadView();
    },
    editContractpartner(mcp: Contractpartner) {
      (
        this.$refs
          .createContractpartnerModalList as typeof CreateContractpartnerModalVue
      )._show(mcp);
    },
    contractpartnerUpdated() {
      this.reloadView();
    },
    deleteContractpartner(mcp: Contractpartner) {
      (this.$refs.deleteModal as typeof DeleteContractpartnerModalVue)._show(
        mcp
      );
    },
    contractpartnerDeleted() {
      this.reloadView();
    },
    listContractpartnerAccounts(mcp: Contractpartner) {
      (
        this.$refs.accountsModal as typeof ListContractpartnerAccountsModalVue
      )._show(mcp);
    },
  },
  components: {
    CreateContractpartnerModalVue,
    ListContractpartnerRowVue,
    DeleteContractpartnerModalVue,
    ListContractpartnerAccountsModalVue,
  },
});
</script>
