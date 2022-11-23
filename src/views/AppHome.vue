<template>
  <button @click="showModal">Show Modal</button>
  <Modal title="Model title goes here" ref="thisModal">
    <template #body>This should be in the body</template>
    <template #footer>
      <button class="btn btn-primary">Extra footer button</button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "@/components/Modal.vue";
export default defineComponent({
  name: "NomeView",
  components: { Modal },

  methods: {
    showModal() {
      (this.$refs.thisModal as typeof Modal)._show();
    },
  },
});

/* TODO
- move Modal show/hide code into ReportTable.vue
- Create a ReceiptModal component
- when pressing the Receipt-Icon in ReportTableRow.vue emit an event
- let the ReportTable.vue display the Receipt with 1 modal.
- otherwise every ReportTableRow with a receipt has its own modal which would be a DOM-overkill.
- work on <object> and displaying PDF receipts!
*/
</script>
