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
          <EditMoneyflowVue
            :mmf-to-edit="mmf"
            ref="editMoneyflowVue"
            @moneyflow-updated="moneyflowUpdated"
          />
        </div>
      </form>
    </template>
    <template #footer>
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
      if (
        await (
          this.$refs.editMoneyflowVue as typeof EditMoneyflowVue
        ).updateMoneyflow()
      ) {
        (this.$refs.modalComponent as typeof ModalVue)._hide();
      }
    },
    moneyflowUpdated(mmf: Moneyflow) {
      this.$emit("moneyflowUpdated", mmf);
    },
  },
  emits: ["moneyflowUpdated"],
  expose: ["_show"],
  components: { EditMoneyflowVue, ModalVue },
});
</script>
