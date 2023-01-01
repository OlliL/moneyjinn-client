<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModalList"
    id-suffix="List"
    @contractpartner-created="searchContent"
    @contractpartner-updated="searchContent"
  />
  <DeleteContractpartnerModalVue
    ref="deleteModal"
    @contractpartner-deleted="searchContent"
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
                  placeholder="Suchen nach Name..."
                  v-model="searchString"
                  @input="searchContent"
                />
                <div class="form-check form-switch align-self-center ms-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="capitalsourcesValid"
                    v-model="validNow"
                    @change="searchContent"
                  />
                  <label class="form-check-label" for="capitalsourcesValid"
                    >Jetzt g&uuml;ltig</label
                  >
                </div>
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
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import CreateContractpartnerModalVue from "@/components/contractpartner/CreateContractpartnerModal.vue";
import ListContractpartnerRowVue from "@/components/contractpartner/ListContractpartnerRow.vue";
import DeleteContractpartnerModalVue from "@/components/contractpartner/DeleteContractpartnerModal.vue";
import ListContractpartnerAccountsModalVue from "@/components/contractpartneraccount/ListContractpartnerAccountsModal.vue";
export default defineComponent({
  name: "ListContractpartners",
  data() {
    return {
      validNow: true,
      contractpartners: {} as Array<Contractpartner>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchAllContent();
  },
  computed: {},
  methods: {
    ...mapActions(useContractpartnerStore, ["searchContractpartner"]),
    showCreateContractpartnerModal() {
      (
        this.$refs
          .createContractpartnerModalList as typeof CreateContractpartnerModalVue
      )._show();
    },
    editContractpartner(mcp: Contractpartner) {
      (
        this.$refs
          .createContractpartnerModalList as typeof CreateContractpartnerModalVue
      )._show(mcp);
    },
    deleteContractpartner(mcp: Contractpartner) {
      (this.$refs.deleteModal as typeof DeleteContractpartnerModalVue)._show(
        mcp
      );
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    async searchContent() {
      this.contractpartners = await this.searchContractpartner(
        this.searchString,
        this.validNow
      );
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
