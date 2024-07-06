<template>
  <ModalVue :title="$t('Capitalsource.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>{{ $t("General.name") }}</th>
                <td>{{ mcs.comment }}</td>
              </tr>
              <tr>
                <th>{{ $t("Capitalsource.type") }}</th>
                <td>{{ typeString }}</td>
              </tr>
              <tr>
                <th>{{ $t("Capitalsource.state") }}</th>
                <td>{{ stateString }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.iban") }}</th>
                <td>{{ mcs.accountNumber }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.bic") }}</th>
                <td>{{ mcs.bankCode }}</td>
              </tr>
              <tr>
                <th>{{ $t("General.validFrom") }}</th>
                <td><SpanDate :date="mcs.validFrom" /></td>
              </tr>
              <tr>
                <th>{{ $t("General.validTil") }}</th>
                <td><SpanDate :date="mcs.validTil" /></td>
              </tr>
              <tr>
                <th>{{ $t("Capitalsource.groupUse") }}</th>
                <td><SpanBoolean :value="mcs.groupUse" /></td>
              </tr>
              <tr>
                <th>{{ $t("Capitalsource.importAllowed") }}</th>
                <td>
                  <b :style="'color:' + importAllowedColor">{{
                    importAllowedString
                  }}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteCapitalsource">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import SpanBoolean from "../SpanBoolean.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { capitalsourceImportNames } from "@/model/capitalsource/CapitalsourceImport";
import { capitalsourceStateNames } from "@/model/capitalsource/CapitalsourceState";
import { capitalsourceTypeNames } from "@/model/capitalsource/CapitalsourceType";

import CapitalsourceService from "@/service/CapitalsourceService";

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
  return capitalsourceStateNames[mcs.value.state];
});

const _show = (_mcs: Capitalsource) => {
  mcs.value = _mcs;
  serverErrors.value = new Array<string>();
  modalComponent.value._show();
};

const deleteCapitalsource = () => {
  serverErrors.value = new Array<string>();

  CapitalsourceService.deleteCapitalsource(mcs.value.id)
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

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
