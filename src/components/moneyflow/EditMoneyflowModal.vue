<template>
  <ModalVue
    :title="
      mmf.id == 0 ? $t('Moneyflow.title.create') : $t('Moneyflow.title.update')
    "
    ref="modalComponent"
    :max-width="modalWidth"
    v-if="mmf"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <form
        @submit.prevent="mmf.id == 0 ? createMoneyflow() : updateMoneyflow()"
        id="updateMoneyflowForm"
      >
        <div class="w-full">
          <div class="flex gap-4">
            <div
              class="w-1/3 overflow-x-scroll whitespace-nowrap h-[600px] max-w-120"
              v-if="receiptBase64"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receiptBase64}`"
                class="max-w-full"
                alt="receipt"
              />
              <object
                class="h-[75vh] w-full"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receiptBase64}`"
                type="application/pdf"
              >
                receipt
              </object>
            </div>
            <div class="flex-1">
              <EditMoneyflowBase :mmf-to-edit="mmf" ref="editMoneyflowVue" />
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="destructive"
        @click="deleteMoneyflowReceipt"
        v-if="mmf.hasReceipt"
      >
        <Trash2 class="h-4 w-4" />
        {{ $t("Moneyflow.deleteReceipt") }}
      </Button>

      <Button
        type="button"
        variant="secondary"
        class="flex items-center gap-2 px-6"
        @click="resetForm"
      >
        <Undo2 class="h-4 w-4" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="updateMoneyflowForm"
      >
        <template #icon><Save class="h-4 w-4" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import { Button } from "@/components/ui/button";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { Save, Trash2, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const editMoneyflowVue =
  useTemplateRef<typeof EditMoneyflowBase>("editMoneyflowVue");

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);

const emit = defineEmits([
  "moneyflowCreated",
  "moneyflowUpdated",
  "moneyflowReceiptDeleted",
]);

const { handleSubmit, values, setFieldTouched } = useForm();

const modalWidth = computed(() => {
  return receiptBase64.value
    ? "md:max-w-full w-full mx-auto"
    : "md:max-w-2xl lg:max-w-7xl w-full mx-auto";
});
const _show = (_mmf: Moneyflow, receipt?: ImportedMoneyflowReceipt) => {
  mmf.value = _mmf;

  receiptBase64.value = "";
  isJpeg.value = false;
  isPdf.value = false;

  if (mmf.value.hasReceipt) loadReceipt(mmf.value.id);
  else if (receipt) processImportedReceipt(receipt);

  modalComponent.value?._show();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const updateMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value?.updateMoneyflow().then((mmf: Moneyflow) => {
    if (mmf !== undefined) {
      emit("moneyflowUpdated", mmf);
      modalComponent.value?._hide();
    }
  });
});

const createMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value?.createMoneyflow().then((result: boolean) => {
    if (result) {
      emit("moneyflowCreated", mmf);
      modalComponent.value?._hide();
    }
  });
});

const loadReceipt = (id: number) => {
  MoneyflowReceiptService.fetchReceipt(id).then((response) => {
    processReceipt(response.receiptType, response.receipt);
  });
};

const processImportedReceipt = (receipt: ImportedMoneyflowReceipt) => {
  let mediaType = MoneyflowReceiptType.UNKNOWN;
  switch (receipt.mediaType) {
    case "image/jpeg":
      mediaType = MoneyflowReceiptType.JPEG;
      break;
    case "application/pdf":
      mediaType = MoneyflowReceiptType.PDF;
      break;
  }
  processReceipt(mediaType, receipt.receipt);
};

const processReceipt = (receiptType: MoneyflowReceiptType, receipt: string) => {
  receiptBase64.value = receipt;

  if (receiptType === MoneyflowReceiptType.JPEG) {
    isJpeg.value = true;
  } else if (receiptType === MoneyflowReceiptType.PDF) {
    isJpeg.value = false;
  }
  isPdf.value = !isJpeg.value;
};

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(mmf.value.id)
    .then(() => {
      emit("moneyflowReceiptDeleted", mmf.value.id);
      modalComponent.value?._hide();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const resetForm = () => {
  editMoneyflowVue.value?.resetForm();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};
defineExpose({ _show });
</script>
