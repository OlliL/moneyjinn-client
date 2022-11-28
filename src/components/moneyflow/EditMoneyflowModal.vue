<template>
  <ModalVue
    title="Geldbewegung bearbeiten"
    ref="modalComponent"
    max-width="75%"
    v-if="mmf"
  >
    <template #body>
      <form @submit.prevent="updateMoneyflow" id="updateMoneyflowForm">
        <div class="container-fluid">
          <EditMoneyflowVue :mmf-to-edit="mmf" ref="editMoneyflowVue" />
        </div>
      </form>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteMoneyflowReceipt"
        v-if="mmf.hasReceipt"
      >
        Bon l&ouml;schen
      </button>

      <button type="submit" class="btn btn-primary" form="updateMoneyflowForm">
        Speichern
      </button>
    </template>
  </ModalVue>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EditMoneyflowVue from "@/components/moneyflow/EditMoneyflowInternal.vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import ModalVue from "../Modal.vue";
import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";

// FIXME: delete Receipt button!

export default defineComponent({
  name: "EditMoneyflowModal",
  data() {
    return {
      mmf: {} as Moneyflow,
    };
  },
  methods: {
    _show(mmf: Moneyflow) {
      this.mmf = JSON.parse(JSON.stringify(mmf));
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async updateMoneyflow() {
      const mmf: Moneyflow = await (
        this.$refs.editMoneyflowVue as typeof EditMoneyflowVue
      ).updateMoneyflow();

      if (mmf !== undefined) {
        this.$emit("moneyflowUpdated", mmf);
        (this.$refs.modalComponent as typeof ModalVue)._hide();
      }
    },
    async deleteMoneyflowReceipt() {
      MoneyflowReceiptControllerHandler.deleteMoneyflowReceipt(this.mmf.id);
      this.$emit("moneyflowReceiptDeleted", this.mmf.id);
      (this.$refs.modalComponent as typeof ModalVue)._hide();
    },
  },
  emits: ["moneyflowUpdated", "moneyflowReceiptDeleted"],
  expose: ["_show"],
  components: { EditMoneyflowVue, ModalVue },
});
</script>
