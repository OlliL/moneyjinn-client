<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Bons zuweisen</h4>
      </div>
    </div>
    <ImportReceiptsRowVue
      v-for="receipt in importedMoneyflowReceipts"
      :key="receipt.id"
      :receipt="receipt"
    />
  </div>
</template>

<script lang="ts">
import ImportReceiptsRowVue from "@/components/moneyflow/ImportReceiptsRow.vue";
import ImportedMoneyflowReceiptControllerHandler from "@/handler/ImportedMoneyflowReceiptControllerHandler";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ImportReceipts",
  data() {
    return {
      importedMoneyflowReceipts: new Array<ImportedMoneyflowReceipt>(),
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {},
  methods: {
    async loadData() {
      this.importedMoneyflowReceipts =
        await ImportedMoneyflowReceiptControllerHandler.showImportImportedMoneyflowReceipts();
    },
  },
  components: { ImportReceiptsRowVue },
});
</script>
