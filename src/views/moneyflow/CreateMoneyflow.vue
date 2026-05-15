<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-semibold tracking-tight">
        {{ $t("Moneyflow.title.create") }}
      </h4>
    </div>

    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <select
          data-testid="selectmoneyflow"
          class="hidden"
          :value="String(preDefMoneyflowId)"
          @change="handleSelectChange(($event.target as HTMLSelectElement).value)"
        >
          <option value="0">{{ $t("Moneyflow.newBooking") }}</option>
          <option
            v-for="mcp of preDefMoneyflows"
            :key="'compat-' + mcp.id"
            :value="String(mcp.id)"
          >
            {{ mcp.contractpartnerName }}
          </option>
        </select>

        <Select
          :model-value="String(preDefMoneyflowId)"
          @update:model-value="handleSelectChange"
        >
          <SelectTrigger id="selectmoneyflow" class="w-full h-10">
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

    <DivError :server-errors="serverErrors" />

    <div class="flex border bg-card text-card-foreground shadow p-4">
      <form @submit.prevent="createMoneyflow" id="createMoneyflowForm">
        <EditMoneyflowBase
          :selected-pre-def-moneyflow="selectedPreDefMoneyflow"
          ref="editMoneyflowVue"
        />

        <div class="flex justify-center gap-4">
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
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const handleSelectChange = (val: any) => {
  // 1. Den Wert wieder in eine Zahl umwandeln, damit dein State (preDefMoneyflowId) korrekt bleibt
  preDefMoneyflowId.value = Number(val);

  // 2. Deine ursprüngliche Logik-Funktion aufrufen
  selectPreDefMoneyflow();
};

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
