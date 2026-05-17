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

    <DivError :server-errors="serverErrors" />

    <div
      class="rounded-lg border bg-card text-card-foreground shadow bg-muted p-4"
    >
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
            class="flex items-center gap-2 px-6 border-sm"
            @click="resetForm"
          >
            <Undo2 class="h-4 w-4" />
            {{ $t("General.reset") }}
          </Button>
          <ButtonSubmit
            :button-label="$t('General.save')"
            form-id="createMoneyflowForm"
            ><template #icon><Save class="h-4 w-4" /></template
          ></ButtonSubmit>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";
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
import { Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { onMounted, ref, useTemplateRef } from "vue";

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
  preDefMoneyflowId.value = Number(val);
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
