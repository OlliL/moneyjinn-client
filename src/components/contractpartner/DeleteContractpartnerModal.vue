<template>
  <ModalVue :title="$t('Contractpartner.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.name") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.name }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Contractpartner.street") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.street }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Contractpartner.postcode") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.postcode }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Contractpartner.town") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.town }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Contractpartner.country") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.country }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.validFrom") }}
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mcp.validFrom" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.validTil") }}
        </div>
        <div class="text-start col-sm-9"><SpanDate :date="mcp.validTil" /></div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("Contractpartner.moneyflowComment") }}
        </div>
        <div class="text-start col-sm-9">{{ mcp.moneyflowComment }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          {{ $t("General.postingAccount") }}
        </div>
        <div class="text-start col-sm-9">
          {{ mcp.postingAccountName }}&nbsp;
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteContractpartner"
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
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/ThrowError";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";

const serverErrors = ref(new Array<string>());

const mcp = ref({} as Contractpartner);
const modalComponent = ref();
const emit = defineEmits(["contractpartnerDeleted"]);

const _show = (_mcp: Contractpartner) => {
  mcp.value = _mcp;
  modalComponent.value._show();
};

const deleteContractpartner = () => {
  serverErrors.value = new Array<string>();

  ContractpartnerControllerHandler.deleteContractpartner(mcp.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("contractpartnerDeleted", mcp.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
