<template>
  <DeleteMoneyflowModalVue ref="deleteModal" />
  <EditMoneyflowModalVue ref="editModal" />

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
      @delete-moneyflow="deleteMoneyflow"
      @edit-moneyflow="editMoneyflow"
    />
  </div>
</template>

<script lang="ts">
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import ImportReceiptsRowVue from "@/components/moneyflow/ImportReceiptsRow.vue";
import ImportedMoneyflowReceiptControllerHandler from "@/handler/ImportedMoneyflowReceiptControllerHandler";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
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
    async deleteMoneyflow(id: number) {
      const mmf = await MoneyflowControllerHandler.fetchMoneyflow(id);
      (this.$refs.deleteModal as typeof DeleteMoneyflowModalVue)._show(mmf);
    },
    async editMoneyflow(id: number) {
      const mmf = await MoneyflowControllerHandler.fetchMoneyflow(id);
      (this.$refs.editModal as typeof EditMoneyflowModalVue)._show(mmf);
    },
  },
  components: {
    ImportReceiptsRowVue,
    DeleteMoneyflowModalVue,
    EditMoneyflowModalVue,
  },
});
</script>
