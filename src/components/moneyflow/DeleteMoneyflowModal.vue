<template>
  <ModalVue :title="$t('Moneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Moneyflow.bookingdate") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mmf.bookingDate" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Moneyflow.invoicedate") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mmf.invoiceDate" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.contractpartner") }}
        </div>
        <div class="text-start col-sm-9">{{ mmf.contractpartnerName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.capitalsource") }}
        </div>
        <div class="text-start col-sm-9">{{ mmf.capitalsourceComment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.amount") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanAmount :amount="mmf.amount" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.comment") }}
        </div>
        <div class="text-start col-sm-9">{{ mmf.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.postingAccount") }}
        </div>
        <div class="text-start col-sm-9">{{ mmf.postingAccountName }}</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteMoneyflow">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import DivError from "../DivError.vue";
import { handleBackendError } from "@/tools/views/ThrowError";

const serverErrors = ref(new Array<string>());

const mmf = ref({} as Moneyflow);
const modalComponent = ref();
const emit = defineEmits(["moneyflowDeleted"]);

const _show = (_mmf: Moneyflow) => {
  mmf.value = _mmf;
  modalComponent.value._show();
};

const deleteMoneyflow = () => {
  serverErrors.value = new Array<string>();

  MoneyflowControllerHandler.deleteMoneyflow(mmf.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("moneyflowDeleted", mmf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
defineExpose({ _show });
</script>
