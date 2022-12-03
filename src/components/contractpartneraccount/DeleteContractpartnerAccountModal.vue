<template>
  <ModalVue
    title="Vertragspartnerkonto l&ouml;schen"
    ref="modalComponent"
    zIndex="2001"
  >
    <template #body>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          IBAN
        </div>
        <div class="text-start col-sm-9">{{ mca.accountNumber }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          BIC
        </div>
        <div class="text-start col-sm-9">{{ mca.bankCode }}</div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteContractpartnerAccount"
      >
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import ContractpartnerAccountControllerHandler from "@/handler/ContractpartnerAccountControllerHandler";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeleteContractpartnerAccountModal",
  data() {
    return {
      mca: {} as ContractpartnerAccount,
    };
  },
  methods: {
    async _show(mca: ContractpartnerAccount) {
      this.mca = mca;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async deleteContractpartnerAccount() {
      // wait for result otherwise we reload before the server deleted the data
      await ContractpartnerAccountControllerHandler.deleteContractpartnerAccount(
        this.mca.id
      );
      (this.$refs.modalComponent as typeof ModalVue)._hide();
      this.$emit("contractpartnerAccountDeleted", this.mca);
    },
  },
  expose: ["_show"],
  emits: ["contractpartnerAccountDeleted"],
  components: { ModalVue },
});
</script>
