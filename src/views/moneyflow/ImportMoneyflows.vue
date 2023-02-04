<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Importierte Geldbewegungen</h4>
      </div>
    </div>

    <div
      class="row justify-content-md-center mb-5"
      v-for="importedMoneyflow in importMoneyflows"
      :key="importedMoneyflow.externalid"
    >
      <div class="col-md-9 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="importImportedMoneyflow(importedMoneyflow)">
              <div class="container-fluid">
                <div class="row mb-2">
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    IBAN:
                  </div>
                  <div class="col-md-2 col-xs-6 text-start">
                    {{ importedMoneyflow.accountNumber }}
                  </div>
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    BIC:
                  </div>
                  <div class="col-md-2 col-xs-6 text-start">
                    {{ importedMoneyflow.bankCode }}
                  </div>
                  <div
                    class="col-md-2 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    Transaktionspartner:
                  </div>
                  <div class="col-md-4 col-xs-6 text-start">
                    {{ importedMoneyflow.name }}
                  </div>
                </div>
                <div class="row mb-3">
                  <div
                    class="col-md-1 col-xs-6 d-flex justify-content-end align-items-center"
                    style="font-weight: 700; font-size: 10.5px"
                  >
                    Verwendungszweck:
                  </div>
                  <div class="col-md-11 col-xs-6 text-start">
                    {{ importedMoneyflow.usage }}
                  </div>
                </div>
                <EditMoneyflowBase
                  :ref="(el) => editMoneyflowRefs.set(importedMoneyflow.id, el)"
                  :mmf-to-edit="importedMoneyflow"
                  :id-suffix="importedMoneyflow.id + ''"
                  :fill-contractpartner-defaults="true"
                />
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <ButtonSubmit button-label="Übernehmen" />
                    <button
                      type="button"
                      class="btn btn-danger mx-2"
                      @click="deleteImportedMoneyflow(importedMoneyflow)"
                    >
                      l&ouml;schen
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";

import ImportedMoneyflowControllerHandler from "@/handler/ImportedMoneyflowControllerHandler";

const importMoneyflows = ref({} as Array<ImportedMoneyflow>);
const editMoneyflowRefs = new Map<number, any>();

onMounted(() => {
  ImportedMoneyflowControllerHandler.showAddImportedMoneyflows().then((imf) => {
    importMoneyflows.value = imf;
  });
});

const deleteImportedMoneyflow = (mim: ImportedMoneyflow) => {
  editMoneyflowRefs
    .get(mim.id)
    .deleteImportedMoneyflow(mim.id)
    .then(() => {
      importMoneyflows.value = importMoneyflows.value.filter(
        (entry) => entry.id !== mim.id
      );
    });
};
const importImportedMoneyflow = (mim: ImportedMoneyflow) => {
  editMoneyflowRefs
    .get(mim.id)
    .importImportedMoneyflow(mim)
    .then((res: boolean) => {
      if (res) {
        importMoneyflows.value = importMoneyflows.value.filter(
          (entry) => entry.id !== mim.id
        );
      }
    });
};
</script>
