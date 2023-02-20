<template>
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>Geldbewegung hinzuf&uuml;gen</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-4 col-xs-12">
        <select
          class="form-select"
          id="selectmoneyflow"
          v-model="preDefMoneyflowId"
          @change="selectPreDefMoneyflow"
        >
          <option value="0">Neue Buchung</option>
          <option v-for="mcp of preDefMoneyflows" :key="mcp.id" :value="mcp.id">
            {{ mcp.contractpartnerName }} | {{ mcp.amount.toFixed(2) }} &euro; |
            {{ mcp.comment }}
          </option>
        </select>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <div class="card w-100 bg-light">
          <div class="card-body">
            <form @submit.prevent="createMoneyflow" id="createMoneyflowForm">
              <div class="container-fluid">
                <EditMoneyflowBase
                  :selected-pre-def-moneyflow="selectedPreDefMoneyflow"
                  ref="editMoneyflowVue"
                />
                <div class="row no-gutters flex-lg-nowrap">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-secondary mx-2"
                      @click="resetForm"
                    >
                      r&uuml;cksetzen
                    </button>
                    <ButtonSubmit
                      button-label="Speichern"
                      form-id="createMoneyflowForm"
                    />
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

import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import { preDefMoneyflowAlreadyUsedThisMonth } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import { useForm } from "vee-validate";
import DivError from "@/components/DivError.vue";
import { handleBackendError } from "@/tools/views/ThrowError";

const serverErrors = ref(new Array<string>());

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const preDefMoneyflowId = ref(0);
const selectedPreDefMoneyflow = ref({} as PreDefMoneyflow | undefined);
const editMoneyflowVue = ref();

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  PreDefMoneyflowControllerHandler.fetchAllPreDefMoneyflow()
    .then((allPreDefMoneyflows) => {
      // remove those PreDefMoneyflows which where used this month already and have onceMonth set
      const today = new Date();
      preDefMoneyflows.value = allPreDefMoneyflows.filter((mpm) => {
        return (
          !mpm.onceAMonth || !preDefMoneyflowAlreadyUsedThisMonth(today, mpm)
        );
      });
      resetForm();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

const selectPreDefMoneyflow = () => {
  if (preDefMoneyflowId.value <= 0) {
    selectedPreDefMoneyflow.value = undefined;
  } else {
    const preDefMoneyflow = preDefMoneyflows.value.find((mpm) => {
      return mpm.id === +preDefMoneyflowId.value;
    });
    if (preDefMoneyflow) {
      selectedPreDefMoneyflow.value = preDefMoneyflow;
    }
  }
};

const createMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value.createMoneyflow().then((ret: boolean) => {
    if (ret) resetForm();
  });
});

const resetForm = () => {
  preDefMoneyflowId.value = 0;
  selectPreDefMoneyflow();
  editMoneyflowVue.value.resetForm();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};
</script>
