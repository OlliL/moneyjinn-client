<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Receipt.importReceipts") }}</h4>
    </div>
    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <DivError
          :server-errors="serverErrors"
          test-id-prefix="importReceipts-error"
        />
        <form
          @submit.prevent="uploadReceipts"
          id="uploadReceiptsForm"
          ref="uploadReceiptsForm"
          class="space-y-3"
          data-testid="importReceipts-upload-form"
        >
          <div class="grid items-center gap-2 grid-cols-1 md:grid-cols-12">
            <InputFile
              class="md:col-span-8"
              v-model="files"
              id="fileUpload"
              data-testid="importReceipts-file-input"
            />
            <ButtonSubmit
              class="md:col-span-4"
              :button-label="$t('Receipt.upload')"
              form-id="uploadReceiptsForm"
              data-testid="importReceipts-upload-button"
            >
              <template #icon><Upload class="icon-medium" /> </template>
            </ButtonSubmit>
          </div>
        </form>
      </div>
    </div>
    <ImportReceiptsRowVue
      v-for="receipt in importedMoneyflowReceipts"
      :key="receipt.id"
      :receipt="receipt"
      :data-testid="`importReceipts-row-${receipt.id}`"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputFile from "@/components/common/InputFile.vue";
import useDeleteMoneyflowModalStore from "@/components/moneyflow/DeleteMoneyflowModal.store";
import useEditMoneyflowModalStore from "@/components/moneyflow/EditMoneyflowModal.store";
import useListMoneyflowModalStore from "@/components/moneyflow/ListMoneyflowModal.store";
import useReceiptModalStore from "@/components/reports/ReceiptModal.store";
import {
  ImportReceiptRowActionsKey,
  type ImportReceiptRowActions,
} from "@/model/CrudActions.ts";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import ImportedMoneyflowReceiptService from "@/service/ImportedMoneyflowReceiptService";
import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Upload } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { onMounted, provide, ref, useTemplateRef } from "vue";
import ImportReceiptsRowVue from "./elements/ImportReceiptsRow.vue";

const serverErrors = ref(new Array<string>());

const importedMoneyflowReceipts = ref(new Array<ImportedMoneyflowReceipt>());
const files = ref<FileList | null>(null);

const uploadReceiptsForm =
  useTemplateRef<HTMLFormElement>("uploadReceiptsForm");
const { openDeleteMoneyflow } = useDeleteMoneyflowModalStore();
const { openEditMoneyflow } = useEditMoneyflowModalStore();
const { openListMoneyflow } = useListMoneyflowModalStore();
const { openListReceipt } = useReceiptModalStore();

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => loadData());

const loadData = () => {
  ImportedMoneyflowReceiptService.showImportImportedMoneyflowReceipts()
    .then((imr) => {
      importedMoneyflowReceipts.value = imr;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });

  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const actions: ImportReceiptRowActions = {
  list: (id: number, receipt: ImportedMoneyflowReceipt) =>
    MoneyflowService.fetchMoneyflow(id).then((mmf) =>
      openListMoneyflow(mmf, receipt, openListReceipt),
    ),
  edit: (id: number, receipt: ImportedMoneyflowReceipt) =>
    MoneyflowService.fetchMoneyflow(id).then((mmf) =>
      openEditMoneyflow(mmf, receipt, undefined, openListReceipt),
    ),
  delete: (id: number) =>
    MoneyflowService.fetchMoneyflow(id).then((mmf) => openDeleteMoneyflow(mmf)),
  removeReceipt: (id: number) => {
    importedMoneyflowReceipts.value = importedMoneyflowReceipts.value.filter(
      (receipt) => receipt.id !== id,
    );
  },
};

provide(ImportReceiptRowActionsKey, actions);

const uploadReceipts = handleSubmit(async () => {
  serverErrors.value = new Array<string>();
  const receipts = new Array<ImportedMoneyflowReceipt>();
  if (files.value) {
    for (let file of files.value) {
      const arrayBuffer = new Uint8Array(await file.arrayBuffer());
      let fileContents: string = "";
      for (let i = 0; i < arrayBuffer.byteLength; i++) {
        fileContents += String.fromCharCode(arrayBuffer[i]!);
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
    ImportedMoneyflowReceiptService.createImportedMoneyflowReceipts(receipts)
      .then(() => {
        loadData();
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
    uploadReceiptsForm.value?.reset();
    files.value = null;
  }
});
</script>
