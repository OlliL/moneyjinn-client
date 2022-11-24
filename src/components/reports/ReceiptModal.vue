<template>
  <ModalVue title="Beleg" ref="modalComponent">
    <template #body>
      <img
        v-if="isJpeg"
        :src="`data:image/png;base64,${receiptBase64}`"
        style="max-width: 100%; max-height: 100%"
      />
      <object
        style="height: 75vh; width: 100%"
        v-if="isPdf"
        id="pdf"
        :data="`data:application/pdf;base64,${receiptBase64}`"
        type="application/pdf"
      ></object>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";
import ModalVue from "../Modal.vue";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

export default defineComponent({
  name: "ReceiptModal",
  data() {
    return {
      receiptBase64: "",
      isJpeg: false,
      isPdf: false,
    };
  },
  methods: {
    async _show(moneyflowId: number) {
      let response = await MoneyflowReceiptControllerHandler.fetchReceipt(
        moneyflowId
      );
      this.receiptBase64 = response.receipt;

      this.isJpeg = false;
      this.isPdf = false;
      if (response.receiptType === MoneyflowReceiptType.JPEG) {
        this.isJpeg = true;
      } else if (response.receiptType === MoneyflowReceiptType.PDF) {
        this.isPdf = true;
      }

      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
  },
  expose: ["_show"],
  components: { ModalVue },
});
</script>
