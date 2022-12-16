<template>
  <DeleteMoneyflowModalVue ref="deleteModal" />
  <EditMoneyflowModalVue ref="editModal" />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Bons importieren</h4>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-sm-3 mb-5">
        <div v-if="serverError">
          <div
            class="alert alert-danger"
            v-for="(error, index) in serverError"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
        <form @submit.prevent="uploadReceipts">
          <div class="input-group">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-upload"></i> Hochladen
            </button>

            <input
              type="file"
              class="form-control"
              id="input"
              multiple
              ref="fileUpload"
            />
          </div>
        </form>
      </div>
    </div>
    <ImportReceiptsRowVue
      v-for="receipt in importedMoneyflowReceipts"
      :key="receipt.id"
      :receipt="receipt"
      @delete-moneyflow="deleteMoneyflow"
      @edit-moneyflow="editMoneyflow"
      @remove-receipt-from-view="removeReceiptFromView"
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
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { getError } from "@/tools/views/ThrowError";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ImportReceipts",
  data() {
    return {
      importedMoneyflowReceipts: new Array<ImportedMoneyflowReceipt>(),
      serverError: new Array<string>(),
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
    removeReceiptFromView(id: number) {
      this.importedMoneyflowReceipts = this.importedMoneyflowReceipts.filter(
        (receipt) => {
          return receipt.id !== id;
        }
      );
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
        return false;
      }
      return true;
    },
    async uploadReceipts() {
      this.serverError = new Array<string>();
      const filesElement = this.$refs.fileUpload as HTMLInputElement;
      const files = filesElement.files;
      const receipts = new Array<ImportedMoneyflowReceipt>();
      if (files != null) {
        for (let file of files) {
          const arrayBuffer = new Uint8Array(await file.arrayBuffer());
          let fileContents: string = "";
          for (var i = 0; i < arrayBuffer.byteLength; i++) {
            fileContents += String.fromCharCode(arrayBuffer[i]);
          }
          const base64Encoded = btoa(fileContents);

          const receipt: ImportedMoneyflowReceipt = {
            filename: file.name,
            id: 0,
            mediaType: file.type,
            receipt: base64Encoded,
          };
          receipts.push(receipt);
        }
      }
      if (receipts.length > 0) {
        const validationResult: ValidationResult =
          await ImportedMoneyflowReceiptControllerHandler.createImportedMoneyflowReceipts(
            receipts
          );
        if (this.followUpServerCall(validationResult)) {
          filesElement.value = "";
          this.loadData();
        }
      }
    },
  },
  components: {
    ImportReceiptsRowVue,
    DeleteMoneyflowModalVue,
    EditMoneyflowModalVue,
  },
});
</script>
