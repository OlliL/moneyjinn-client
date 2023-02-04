<template>
  <ModalVue
    title="Geldbewegung bearbeiten"
    ref="modalComponent"
    max-width="75%"
    v-if="mmf"
  >
    <template #body>
      <form @submit.prevent="updateMoneyflow" id="updateMoneyflowForm">
        <div class="container-fluid">
          <EditMoneyflowBase :mmf-to-edit="mmf" ref="editMoneyflowVue" />
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

      <button-submit button-label="Speichern" form-id="updateMoneyflowForm" />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import ModalVue from "../Modal.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowReceiptControllerHandler from "@/handler/MoneyflowReceiptControllerHandler";

const mmf = ref({} as Moneyflow);
const modalComponent = ref();
const editMoneyflowVue = ref();
const emit = defineEmits(["moneyflowUpdated", "moneyflowReceiptDeleted"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const _show = (_mmf: Moneyflow) => {
  mmf.value = JSON.parse(JSON.stringify(_mmf));
  mmf.value.bookingDate = new Date(mmf.value.bookingDate);
  mmf.value.invoiceDate = mmf.value.invoiceDate
    ? new Date(mmf.value.invoiceDate)
    : undefined;
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
