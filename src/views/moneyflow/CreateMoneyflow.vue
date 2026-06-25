<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.create") }}</h4>
    </div>

    <div class="flex justify-center mb-6">
      <div class="w-full max-w-md">
        <Select
          :model-value="String(preDefMoneyflowId)"
          @update:model-value="handleSelectChange"
        >
          <SelectTrigger
            id="selectmoneyflow"
            data-testid="selectmoneyflow"
            class="w-full h-10"
          >
            <SelectValue :placeholder="$t('Moneyflow.newBooking')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              {{ $t("Moneyflow.newBooking") }}
            </SelectItem>
            <SelectItem
              v-for="mcp of preDefMoneyflows"
              :key="mcp.id"
              :value="String(mcp.id)"
              :data-testid="'selectmoneyflowitem-' + mcp.id"
            >
              <div class="flex flex-row gap-2">
                <span class="font-medium">{{ mcp.contractpartnerName }}</span>
                <span class="text-muted-foreground"> | </span>
                <span>{{ mcp.amount.toFixed(2) }} €</span>
                <span class="text-muted-foreground"> | </span>
                <span class="truncate italic opacity-80">{{
                  mcp.comment
                }}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="rounded-sm border shadow card-panel p-4">
      <form
        @submit.prevent="createMoneyflow"
        id="createMoneyflowForm"
        class="w-full"
      >
        <EditMoneyflowBase
          :selected-pre-def-moneyflow="selectedPreDefMoneyflow"
          ref="editMoneyflowVue"
        />

        <div class="flex justify-center gap-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            class="button-with-icon hidden md:flex"
            data-testid="createMoneyflowResetButton"
            @click="resetForm"
          >
            <Undo2 class="icon-medium" />
            {{ $t("General.reset") }}
          </Button>
          <ButtonSubmit
            :button-label="$t('General.save')"
            form-id="createMoneyflowForm"
            test-id="createMoneyflowSaveButton"
            ><template #icon><Save class="icon-medium" /></template
          ></ButtonSubmit>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import { preDefMoneyflowAlreadyUsedThisMonth } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { createFormContext } from "@/tools/views/ValidationUtil";
import { Save, Undo2 } from "@lucide/vue";
import { type AcceptableValue } from "reka-ui";
import { onMounted, ref, useTemplateRef } from "vue";

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const preDefMoneyflowId = ref(0);
const selectedPreDefMoneyflow = ref(undefined as PreDefMoneyflow | undefined);
const editMoneyflowVue =
  useTemplateRef<typeof EditMoneyflowBase>("editMoneyflowVue");

const { handleSubmit, resetAll } = createFormContext();

onMounted(() =>
  PreDefMoneyflowService.fetchAllPreDefMoneyflow()
    .then((allPreDefMoneyflows) => {
      // remove those PreDefMoneyflows which where used this month already and have onceMonth set
      const today = new Date();
      preDefMoneyflows.value = allPreDefMoneyflows.filter(
        (mpm) =>
          !mpm.onceAMonth || !preDefMoneyflowAlreadyUsedThisMonth(today, mpm),
      );
      resetForm();
    })
    .catch(handleBackendError),
);

const handleSelectChange = (val: AcceptableValue) => {
  preDefMoneyflowId.value = Number(val ?? 0);
  selectPreDefMoneyflow();
};

const selectPreDefMoneyflow = () => {
  if (preDefMoneyflowId.value <= 0) {
    selectedPreDefMoneyflow.value = undefined;
  } else {
    const preDefMoneyflow = preDefMoneyflows.value.find(
      (mpm) => mpm.id === +preDefMoneyflowId.value,
    );
    if (preDefMoneyflow) {
      selectedPreDefMoneyflow.value = preDefMoneyflow;
    }
  }
};

const createMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value?.createMoneyflow().then((ret: boolean) => {
    if (ret) {
      if (selectedPreDefMoneyflow.value?.onceAMonth) {
        const idToRemove = selectedPreDefMoneyflow.value.id;
        preDefMoneyflows.value = preDefMoneyflows.value.filter(
          (mpm) => mpm.id !== idToRemove,
        );
      }
      resetForm();
    }
  });
});

const resetForm = () => {
  preDefMoneyflowId.value = 0;
  selectPreDefMoneyflow();
  editMoneyflowVue.value?.resetForm();
  resetAll();
};
</script>
