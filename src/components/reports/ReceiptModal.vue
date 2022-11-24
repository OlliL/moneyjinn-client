<template>
  <ModalVue title="Beleg" ref="modalComponent">
    <template #body>
      <img
        :src="`data:image/png;base64,${imageBase64}`"
        style="max-width: 100%; max-height: 100%"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "ReceiptModal",
  data() {
    return {
      imageBase64: "",
    };
  },
  methods: {
    async _show(moneyflowId: number) {
      let response = await MoneyflowReceiptControllerHandler.fetchReceipt(
        moneyflowId
      );
      this.imageBase64 = response;

      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
  },
  expose: ["_show"],
  components: { ModalVue },
});
</script>
