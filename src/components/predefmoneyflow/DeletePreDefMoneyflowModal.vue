<template>
  <ModalVue :title="$t('PreDefMoneyflow.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.amount") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanAmount :amount="mpm.amount" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.contractpartner") }}
        </div>
        <div class="text-start col-sm-9">{{ mpm.contractpartnerName }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.comment") }}
        </div>
        <div class="text-start col-sm-9">{{ mpm.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.postingAccount") }}
        </div>
        <div class="text-start col-sm-9">
          {{ mpm.postingAccountName }}&nbsp;
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.capitalsource") }}
        </div>
        <div class="text-start col-sm-9">
          {{ mpm.capitalsourceComment }}&nbsp;
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("PreDefMoneyflow.onceAMonth") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanBoolean :value="mpm.onceAMonth" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("PreDefMoneyflow.createDate") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mpm.createDate" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("PreDefMoneyflow.lastUsed") }}
        </div>
        <div class="text-start col-sm-9"><SpanDate :date="mpm.lastUsed" /></div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deletePreDefMoneyflow"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanAmount from "../SpanAmount.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";

const serverErrors = ref(new Array<string>());

const mpm = ref({} as PreDefMoneyflow);
const modalComponent = ref();
const emit = defineEmits(["preDefMoneyflowDeleted"]);

const _show = (_mpm: PreDefMoneyflow) => {
  mpm.value = _mpm;
  modalComponent.value._show();
};

const deletePreDefMoneyflow = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowControllerHandler.deletePreDefMoneyflow(mpm.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("preDefMoneyflowDeleted", mpm.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
