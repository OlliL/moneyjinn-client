<template>
  <ModalVue title="Kapitalquelle l&ouml;schen" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Kommentar
        </div>
        <div class="text-start col-sm-9">{{ mcs.comment }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Typ
        </div>
        <div class="text-start col-sm-9">{{ typeString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Status
        </div>
        <div class="text-start col-sm-9">{{ stateString }}</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          IBAN
        </div>
        <div class="text-start col-sm-9">{{ mcs.accountNumber }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          BIC
        </div>
        <div class="text-start col-sm-9">{{ mcs.bankCode }}&nbsp;</div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          g&uuml;ltig ab
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mcs.validFrom" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          g&uuml;ltig bis
        </div>
        <div class="text-start col-sm-9">
          <SpanDate :date="mcs.validTil" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Gruppe
        </div>
        <div class="text-start col-sm-9">
          <SpanBoolean :value="mcs.groupUse" />
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Datenimport
        </div>
        <div class="text-start col-sm-9">
          <b :style="'color:' + importAllowedColor">{{
            importAllowedString
          }}</b>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteCapitalsource">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import ModalVue from "../Modal.vue";
import SpanDate from "../SpanDate.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";

import CapitalsourceControllerHandler from "@/handler/CapitalsourceControllerHandler";
import SpanBoolean from "../SpanBoolean.vue";
import { handleBackendError } from "@/tools/views/ThrowError";
import DivError from "../DivError.vue";

const serverErrors = ref(new Array<string>());

const mcs = ref({} as Capitalsource);
const modalComponent = ref();
const emit = defineEmits(["capitalsourceDeleted"]);

const importAllowedColor = computed(() => {
  return mcs.value.importAllowed > 0 ? "green" : "red";
});

const importAllowedString = computed(() => {
  return capitalsourceImportNames[mcs.value.importAllowed];
});

const typeString = computed(() => {
  return capitalsourceTypeNames[mcs.value.type];
});

const stateString = computed(() => {
  return capitalsourceStateNames[mcs.value.type];
});

const _show = (_mcs: Capitalsource) => {
  mcs.value = _mcs;
  modalComponent.value._show();
};

const deleteCapitalsource = () => {
  serverErrors.value = new Array<string>();

  CapitalsourceControllerHandler.deleteCapitalsource(mcs.value.id)
    .then(() => {
      modalComponent.value._hide();
      emit("capitalsourceDeleted", mcs.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
