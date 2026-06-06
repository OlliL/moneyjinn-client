<template>
  <ModalVue
    :title="
      mmf.id == 0 ? $t('Moneyflow.title.create') : $t('Moneyflow.title.update')
    "
    id-suffix="EditMoneyflow"
    :max-width="modalWidth"
    v-if="mmf"
    v-model:open="open"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <form
        @submit.prevent="mmf.id == 0 ? createMoneyflow() : updateMoneyflow()"
        id="updateMoneyflowForm"
      >
        <div class="w-full">
          <div class="md:flex gap-4">
            <div
              class="w-1/3 overflow-x-scroll whitespace-nowrap h-[600px] max-w-120"
              v-if="receipt.receipt && desktop"
            >
              <SpanReceipt :receipt="receipt" />
            </div>
            <div v-if="receipt.receipt && !desktop">
              <div
                @click="showReceipt"
                class="flex items-center justify-between p-3 rounded-xl border border-dashed border-input bg-muted/40 hover:bg-muted/80 active:bg-muted transition-all cursor-pointer w-full group select-none mb-4"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors"
                  >
                    <ReceiptText class="h-5 w-5" />
                  </div>

                  <div class="flex flex-col text-left">
                    <span
                      class="text-sm font-semibold tracking-tight text-foreground"
                    >
                      {{ $t("Moneyflow.viewReceipt") }}
                    </span>
                    <span class="text-xs text-muted-foreground mt-0.5">
                      {{ $t("Moneyflow.viewReceiptTip") }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center pr-1">
                  <Eye
                    class="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            <div class="flex-1">
              <EditMoneyflowBase
                :mmf-to-edit="mmf"
                ref="editMoneyflowVue"
                :fillContractpartnerDefaults="true"
              />
            </div>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="destructive"
        @click="deleteMoneyflowReceipt"
        v-if="mmf.hasReceipt && desktop"
      >
        <Trash2 class="icon-medium" />
        {{ $t("Moneyflow.deleteReceipt") }}
      </Button>

      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="updateMoneyflowForm"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import EditMoneyflowBase from "@/components/moneyflow/EditMoneyflowBase.vue";
import { Button } from "@/components/ui/button";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { mapImportedMoneyflowReceiptToMoneyflowReceipt } from "@/service/mapper/ImportedToMoneyflowReceiptMapper";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { isDesktop } from "@/tools/views/IsDesktop";
import { Eye, ReceiptText, Save, Trash2, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef, watch } from "vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";
import useEditMoneyflowModalStore from "./EditMoneyflowModal.store";

const serverErrors = ref(new Array<string>());
const desktop = isDesktop();

const mmf = ref({} as Moneyflow);
const editMoneyflowVue =
  useTemplateRef<typeof EditMoneyflowBase>("editMoneyflowVue");
const { open, moneyflow, importedReceipt, onDone, onShowReceipt } = storeToRefs(
  useEditMoneyflowModalStore(),
);

const receipt = ref({} as MoneyflowReceipt);

const { handleSubmit, values, setFieldTouched } = useForm();

const modalWidth = computed(() =>
  receipt.value.receipt
    ? "md:max-w-full w-full mx-auto"
    : "md:max-w-2xl lg:max-w-7xl w-full mx-auto",
);

watch(
  [open, moneyflow, importedReceipt],
  ([isVisible, entry, importedReceipt]) => {
    if (!isVisible || !entry) return;
    mmf.value = structuredClone(toRaw(entry));
    receipt.value = {} as MoneyflowReceipt;
    if (mmf.value.hasReceipt) loadReceipt(mmf.value.id);
    else if (importedReceipt) {
      receipt.value =
        mapImportedMoneyflowReceiptToMoneyflowReceipt(importedReceipt);
    }

    serverErrors.value = new Array<string>();
    Object.keys(values).forEach((field) => setFieldTouched(field, false));
  },
  { immediate: true },
);

const updateMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value?.updateMoneyflow().then((mmf: Moneyflow) => {
    if (mmf !== undefined) {
      open.value = false;
      onDone.value?.();
    }
  });
});

const createMoneyflow = handleSubmit(() => {
  editMoneyflowVue.value?.createMoneyflow().then((result: boolean) => {
    if (result) {
      open.value = false;
      onDone.value?.();
    }
  });
});

const loadReceipt = (id: number) => {
  MoneyflowReceiptService.fetchReceipt(id)
    .then((response) => {
      receipt.value = response;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(mmf.value.id)
    .then(() => {
      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const resetForm = () => {
  editMoneyflowVue.value?.resetForm();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const showReceipt = () => {
  onShowReceipt.value?.(mmf.value.id);
};
</script>
