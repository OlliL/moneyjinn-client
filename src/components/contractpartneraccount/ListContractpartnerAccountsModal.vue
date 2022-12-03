<template>
  <CreateContractpartnerAccountModalVue
    v-if="dataLoaded"
    ref="createContractpartnerAccountModal"
    id-suffix="listAccounts"
    :contractpartner-id="mcp.id"
    @contractpartner-account-created="contractpartnerAccountCreated"
    @contractpartner-account-updated="contractpartnerAccountUpdated"
  />
  <DeleteContractpartnerAccountModalVue
    v-if="dataLoaded"
    ref="deleteModal"
    @contractpartner-account-deleted="contractpartnerAccountDeleted"
  />

  <ModalVue
    :title="mcp.name + ': Vertragspartnerkonten'"
    ref="modalComponent"
    max-width="600px"
  >
    <template #body>
      <div class="row justify-content-md-center">
        <div class="col">
          <table class="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th width="40%" class="text-center">IBAN</th>
                <th width="30%" class="text-center">BIC</th>
                <th width="30%" class="text-center" colspan="2"></th>
              </tr>
            </thead>
            <tbody>
              <ListContractpartnerAccountRowVue
                v-for="mca in contractpartnerAccount"
                :key="mca.accountNumber"
                :mca="mca"
                @delete-contractpartner-account="deleteContractpartnerAccount"
                @edit-contractpartner-account="editContractpartnerAccount"
              />
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-primary"
        @click="showCreateContractpartnerAccountModal"
      >
        Neu
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";
import ListContractpartnerAccountRowVue from "./ListContractpartnerAccountRow.vue";
import CreateContractpartnerAccountModalVue from "./CreateContractpartnerAccountModal.vue";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import DeleteContractpartnerAccountModalVue from "./DeleteContractpartnerAccountModal.vue";

export default defineComponent({
  name: "ListContractpartnerAccountsModal",
  data() {
    return {
      mcp: {} as Contractpartner,
      contractpartnerAccount: {} as Array<ContractpartnerAccount>,
      dataLoaded: false,
    };
  },
  computed: {},
  methods: {
    async _show(mcp: Contractpartner) {
      this.dataLoaded = false;
      this.mcp = mcp;
      this.loadData();
      (this.$refs.modalComponent as typeof ModalVue)._show();
      this.dataLoaded = true;
    },
    async loadData() {
      this.contractpartnerAccount =
        await ContractpartnerAccountControllerHandler.fetchAllContractpartnerAccount(
          this.mcp.id
        );
    },
    editContractpartnerAccount(mca: ContractpartnerAccount) {
      (
        this.$refs
          .createContractpartnerAccountModal as typeof CreateContractpartnerAccountModalVue
      )._show(mca);
    },
    contractpartnerAccountUpdated() {
      this.loadData();
    },
    deleteContractpartnerAccount(mca: ContractpartnerAccount) {
      (
        this.$refs.deleteModal as typeof DeleteContractpartnerAccountModalVue
      )._show(mca);
    },
    contractpartnerAccountDeleted() {
      this.loadData();
    },
    showCreateContractpartnerAccountModal() {
      (
        this.$refs
          .createContractpartnerAccountModal as typeof CreateContractpartnerAccountModalVue
      )._show();
    },
    contractpartnerAccountCreated() {
      this.loadData();
    },
  },
  expose: ["_show"],
  components: {
    ModalVue,
    ListContractpartnerAccountRowVue,
    CreateContractpartnerAccountModalVue,
    DeleteContractpartnerAccountModalVue,
  },
});
</script>
