<template>
  <ModalVue
    title="Geldbewegung bearbeiten"
    ref="modalComponent"
    max-width="75%"
    :hide-footer="true"
  >
    <template #body>
      <EditMoneyflowVue :mmf-to-edit="mmf" />
    </template>
    <template #footer></template>
  </ModalVue>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EditMoneyflowVue from "@/views/moneyflow/EditMoneyflow.vue";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "EditMoneyflowModal",
  data() {
    return {
      mmf: {} as Moneyflow,
    };
  },
  methods: {
    async _show(mmf: Moneyflow) {
      this.mmf = mmf;
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
  },
  expose: ["_show"],
  components: { EditMoneyflowVue, ModalVue },
});
</script>