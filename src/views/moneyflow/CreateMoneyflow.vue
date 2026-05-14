<template>
  <div class="container mx-auto py-6 space-y-8">
    <div class="text-center">
      <h4 class="text-2xl font-semibold tracking-tight">
        {{ $t("Moneyflow.title.create") }}
      </h4>
    </div>

    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <select
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          id="selectmoneyflow"
          v-model="preDefMoneyflowId"
          @change="selectPreDefMoneyflow"
        >
          <option value="0">{{ $t("Moneyflow.newBooking") }}</option>
          <option v-for="mcp of preDefMoneyflows" :key="mcp.id" :value="mcp.id">
            {{ mcp.contractpartnerName }} | {{ mcp.amount.toFixed(2) }} € |
            {{ mcp.comment }}
          </option>
        </select>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div class="w-full">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="p-6">
            <form
              @submit.prevent="createMoneyflow"
              id="createMoneyflowForm"
              class="space-y-6"
            >
              <EditMoneyflowBase
                :selected-pre-def-moneyflow="selectedPreDefMoneyflow"
                ref="editMoneyflowVue"
              />

              <div class="flex justify-center gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  @click="resetForm"
                  class="!rounded-md"
                >
                  {{ $t("General.reset") }}
                </Button>
                <ButtonSubmit
                  :button-label="$t('General.save')"
                  form-id="createMoneyflowForm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { onMounted, ref, useTemplateRef } from "vue";

import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import { preDefMoneyflowAlreadyUsedThisMonth } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { useForm } from "vee-validate";
import DivError from "@/components/DivError.vue";
import { handleBackendError } from "@/tools/views/HandleBackendError";

const serverErrors = ref(new Array<string>());

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const preDefMoneyflowId = ref(0);
const selectedPreDefMoneyflow = ref(undefined as PreDefMoneyflow | undefined);
const editMoneyflowVue =
  useTemplateRef<typeof EditMoneyflowBase>("editMoneyflowVue");

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  PreDefMoneyflowService.fetchAllPreDefMoneyflow()
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
  editMoneyflowVue.value?.createMoneyflow().then((ret: boolean) => {
    if (ret) resetForm();
  });
});

const resetForm = () => {
  preDefMoneyflowId.value = 0;
  selectPreDefMoneyflow();
  editMoneyflowVue.value?.resetForm();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};
</script>
