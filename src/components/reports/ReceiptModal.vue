<template>
  <ModalVue :title="$t('Receipt.receipt')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="w-full md:max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
        <SpanReceipt :receipt="receipt" />
      </div>
    </template>
    <template #footer>
      <Button
        v-if="receipt.moneyflowId"
        type="button"
        :variant="isConfirming ? 'destructive' : 'secondary'"
        @click="handleDeleteClick"
        class="w-full md:w-auto transition-all duration-300 relative overflow-hidden"
        :class="
          isConfirming
            ? 'bg-destructive text-destructive-foreground font-semibold shadow-inner'
            : 'text-muted-foreground hover:text-destructive'
        "
      >
        <template v-if="!isConfirming">
          <Trash2 class="w-4 h-4 mr-2" />
          <span>{{ $t("Moneyflow.deleteReceipt") }}</span>
        </template>

        <template v-else>
          <AlertTriangle class="w-4 h-4 mr-2 animate-pulse" />
          <span class="animate-in fade-in zoom-in-95 duration-200">
            Wirklich löschen? (Nochmal tippen)
          </span>

          <div
            @click="cancelDelete"
            class="ml-3 p-0.5 rounded-full hover:bg-black/20 text-white/70 hover:text-white transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </div>
        </template>
      </Button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { AlertTriangle, Trash2, X } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import DivError from "../common/DivError.vue";
import ModalVue from "../common/Modal.vue";
import SpanReceipt from "../common/SpanReceipt.vue";
import Button from "../ui/button/Button.vue";

const serverErrors = ref(new Array<string>());

const receipt = ref({} as MoneyflowReceipt);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const _show = (moneyflowId: number) => {
  serverErrors.value = new Array<string>();

  MoneyflowReceiptService.fetchReceipt(moneyflowId)
    .then((response) => {
      receipt.value = response;
      modalComponent.value?._show();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      modalComponent.value?._show();
    });
};
defineExpose({ _show });

const deleteMoneyflowReceipt = () => {
  MoneyflowReceiptService.deleteMoneyflowReceipt(receipt.value.moneyflowId)
    .then(() => {
      modalComponent.value?._hide();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const isConfirming = ref(false);
let confirmationTimeout: ReturnType<typeof setTimeout> | null = null;

const handleDeleteClick = () => {
  if (!isConfirming.value) {
    // Phase 1: Erste Aktivierung -> Schalte um auf "Sicher?"
    isConfirming.value = true;

    // Automatischer Reset nach 4 Sekunden, falls nichts passiert
    confirmationTimeout = setTimeout(() => {
      isConfirming.value = false;
    }, 4000);
  } else {
    // Phase 2: Zweiter Klick -> Aktion ausführen
    if (confirmationTimeout) clearTimeout(confirmationTimeout);
    isConfirming.value = false;
    deleteMoneyflowReceipt();
  }
};

// Hilfsfunktion zum Abbrechen der Bestätigung (optional)
const cancelDelete = (e: Event) => {
  e.stopPropagation(); // Verhindert, dass der Button-Klick ausgelöst wird
  if (confirmationTimeout) clearTimeout(confirmationTimeout);
  isConfirming.value = false;
};
</script>
