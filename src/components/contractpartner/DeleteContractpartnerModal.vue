<template>
  <ModalVue title="Kapitalquelle l&ouml;schen" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
        </div>
        <div class="text-start col-sm-9">{{ mcp.name }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Stra&szlig;e
        </div>
        <div class="text-start col-sm-9">{{ mcp.street }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Postleitzahl
        </div>
        <div class="text-start col-sm-9">{{ mcp.postcode }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Stadt
        </div>
        <div class="text-start col-sm-9">{{ mcp.town }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Land
        </div>
        <div class="text-start col-sm-9">{{ mcp.country }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          g&uuml;ltig ab
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
          g&uuml;ltig bis
        </div>
        <div class="text-start col-sm-9"><SpanDate :date="mcp.validTil" /></div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Standard Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mcp.moneyflowComment }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Standard Buchungskonto
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
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import ModalVue from "../Modal.vue";
import SpanDate from "../SpanDate.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

import ContractpartnerControllerHandler from "@/handler/ContractpartnerControllerHandler";
import { handleBackendError } from "@/tools/views/ThrowError";
import DivError from "../DivError.vue";

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
