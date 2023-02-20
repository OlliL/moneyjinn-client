<template>
  <ModalVue
    title="Geldbewegung bearbeiten"
    ref="modalComponent"
    :max-width="modalWidth"
    v-if="mmf"
  >
    <template #body>
      <form @submit.prevent="updateMoneyflow" id="updateMoneyflowForm">
        <div class="container-fluid">
          <div class="row">
            <div
              style="overflow-x: scroll; white-space: nowrap; height: 600px"
              class="col-3"
              v-if="receiptBase64"
            >
              <img
                v-if="isJpeg"
                :src="`data:image/png;base64,${receiptBase64}`"
                style="max-width: 100%"
              />
              <object
                style="height: 75vh; width: 100%"
                v-if="isPdf"
                id="pdf"
                :data="`data:application/pdf;base64,${receiptBase64}`"
                type="application/pdf"
              ></object>
            </div>
            <div class="col">
              <EditMoneyflowBase :mmf-to-edit="mmf" ref="editMoneyflowVue" />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteMoneyflowReceipt"
        v-if="mmf.hasReceipt"
      >
        Bon l&ouml;schen
      </button>

      <ButtonSubmit button-label="Speichern" form-id="updateMoneyflowForm" />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import ModalVue from "../Modal.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";

const mmf = ref({} as Moneyflow);
const modalComponent = ref();
const editMoneyflowVue = ref();

const receiptBase64 = ref("");
const isJpeg = ref(false);
const isPdf = ref(false);

const emit = defineEmits(["moneyflowUpdated", "moneyflowReceiptDeleted"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const modalWidth = computed(() => {
  return receiptBase64.value ? "100%" : "75%";
});
const _show = (_mmf: Moneyflow, receipt?: ImportedMoneyflowReceipt) => {
  mmf.value = _mmf;
  if (mmf.value.hasReceipt) loadReceipt(mmf.value.id);
  else if (receipt) processImportedReceipt(receipt);

  modalComponent.value._show();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const updateMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value.updateMoneyflow().then((mmf: Moneyflow) => {
    if (mmf !== undefined) {
      emit("moneyflowUpdated", mmf);
      modalComponent.value._hide();
    }
  });
});

const loadReceipt = (id: number) => {
  MoneyflowReceiptControllerHandler.fetchReceipt(id).then((response) => {
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
  MoneyflowReceiptControllerHandler.deleteMoneyflowReceipt(mmf.value.id).then(
    () => {
      emit("moneyflowReceiptDeleted", mmf.value.id);
      modalComponent.value._hide();
    }
  );
};

defineExpose({ _show });
</script>
