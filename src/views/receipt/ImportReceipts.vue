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
        <DivError :server-errors="serverErrors" />
        <form
          @submit.prevent="uploadReceipts"
          id="uploadReceiptsForm"
          ref="uploadReceiptsForm"
        >
          <div class="input-group">
            <ButtonSubmit button-label="Hochladen" form-id="uploadReceiptsForm">
              <template #icon><i class="bi bi-upload"></i>&nbsp; </template>
            </ButtonSubmit>
            <InputFile v-model="files" id="fileUpload" />
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

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import DivError from "@/components/DivError.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import ImportReceiptsRowVue from "@/components/moneyflow/ImportReceiptsRow.vue";
import InputFile from "@/components/InputFile.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";

import ImportedMoneyflowReceiptControllerHandler from "@/handler/ImportedMoneyflowReceiptControllerHandler";
import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import { useForm } from "vee-validate";
import ButtonSubmit from "@/components/ButtonSubmit.vue";

const importedMoneyflowReceipts = ref(new Array<ImportedMoneyflowReceipt>());
const serverErrors = ref(new Array<string>());
const files = ref({} as FileList);

const deleteModal = ref();
const editModal = ref();
const uploadReceiptsForm = ref();

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

const loadData = () => {
  ImportedMoneyflowReceiptControllerHandler.showImportImportedMoneyflowReceipts()
    .then((imr) => {
      importedMoneyflowReceipts.value = imr;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const deleteMoneyflow = (id: number) => {
  MoneyflowControllerHandler.fetchMoneyflow(id).then((mmf) => {
    (deleteModal.value as typeof DeleteMoneyflowModalVue)._show(mmf);
  });
};

const editMoneyflow = (id: number, receipt: ImportedMoneyflowReceipt) => {
  MoneyflowControllerHandler.fetchMoneyflow(id).then((mmf) => {
    (editModal.value as typeof EditMoneyflowModalVue)._show(mmf, receipt);
  });
};

const removeReceiptFromView = (id: number) => {
  importedMoneyflowReceipts.value = importedMoneyflowReceipts.value.filter(
    (receipt) => {
      return receipt.id !== id;
    }
  );
};

const uploadReceipts = handleSubmit(async () => {
  serverErrors.value = new Array<string>();
  const receipts = new Array<ImportedMoneyflowReceipt>();
  if (files.value != null) {
    for (let file of files.value) {
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
    ImportedMoneyflowReceiptControllerHandler.createImportedMoneyflowReceipts(
      receipts
    )
      .then(() => {
        loadData();
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
    uploadReceiptsForm.value.reset();
    files.value = {} as FileList;
  }
});
</script>
