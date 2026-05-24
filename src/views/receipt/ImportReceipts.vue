<template>
  <DeleteMoneyflowModalVue ref="deleteModal" />
  <EditMoneyflowModalVue ref="editModal" @show-receipt="showReceipt" />
  <ListMoneyflowModalDesktop
    ref="listModal"
    @show-receipt="showReceipt"
    v-if="isDesktop().value"
  />
  <ListMoneyflowModalMobile
    ref="listModal"
    @show-receipt="showReceipt"
    v-else
  />
  <ReceiptModal ref="receiptModal" />

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
              <template #icon><Upload class="icon-small" /> </template>
            </ButtonSubmit>
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
      @list-moneyflow="listMoneyflow"
      @remove-receipt-from-view="removeReceiptFromView"
      :data-testid="`importReceipts-row-${receipt.id}`"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputFile from "@/components/common/InputFile.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import ListMoneyflowModalDesktop from "@/components/moneyflow/ListMoneyflowModalDesktop.vue";
import ListMoneyflowModalMobile from "@/components/moneyflow/ListMoneyflowModalMobile.vue";
import ReceiptModal from "@/components/reports/ReceiptModal.vue";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import ImportedMoneyflowReceiptService from "@/service/ImportedMoneyflowReceiptService";
import MoneyflowService from "@/service/MoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import { Upload } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { onMounted, ref, useTemplateRef } from "vue";
import ImportReceiptsRowVue from "./elements/ImportReceiptsRow.vue";

const serverErrors = ref(new Array<string>());

const importedMoneyflowReceipts = ref(new Array<ImportedMoneyflowReceipt>());
const files = ref<FileList | null>(null);

const deleteModal =
  useTemplateRef<typeof DeleteMoneyflowModalVue>("deleteModal");
const editModal = useTemplateRef<typeof EditMoneyflowModalVue>("editModal");
const listModal = useTemplateRef<typeof ListMoneyflowModalDesktop>("listModal");
const receiptModal = useTemplateRef<typeof ReceiptModal>("receiptModal");
const uploadReceiptsForm =
  useTemplateRef<HTMLFormElement>("uploadReceiptsForm");

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  loadData();
});

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

const deleteMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    deleteModal.value?._show(mmf);
  });
};

const editMoneyflow = (id: number, receipt: ImportedMoneyflowReceipt) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    editModal.value?._show(mmf, receipt);
  });
};

const listMoneyflow = (id: number, receipt: ImportedMoneyflowReceipt) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    listModal.value?._show(mmf, receipt);
  });
};

const showReceipt = (
  id: number,
  importedReceipt?: ImportedMoneyflowReceipt,
) => {
  receiptModal.value?._show(id, importedReceipt);
};

const removeReceiptFromView = (id: number) => {
  importedMoneyflowReceipts.value = importedMoneyflowReceipts.value.filter(
    (receipt) => {
      return receipt.id !== id;
    },
  );
};

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
