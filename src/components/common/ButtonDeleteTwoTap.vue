<template>
  <Button
    type="button"
    :variant="isConfirming ? 'destructive' : 'secondary'"
    @click="handleDeleteClick"
    class="button-with-icon w-full md:w-auto transition-all duration-300 relative overflow-hidden"
    :class="
      isConfirming
        ? 'bg-destructive text-destructive-foreground font-semibold shadow-inner'
        : 'text-muted-foreground hover:text-destructive'
    "
  >
    <template v-if="!isConfirming">
      <Trash2 class="w-4 h-4 mr-2" />
      <span>{{ buttonLabel }}</span>
    </template>

    <template v-else>
      <AlertTriangle class="w-4 h-4 mr-2 animate-pulse" />
      <span class="animate-in fade-in zoom-in-95 duration-200">
        {{ $t("Moneyflow.areYouSureDelete") }}
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
<script setup lang="ts">
import { AlertTriangle, Trash2, X } from "lucide-vue-next";
import { ref } from "vue";
import Button from "../ui/button/Button.vue";

defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["executeDelete"]);
const isConfirming = ref(false);
let confirmationTimeout: ReturnType<typeof setTimeout> | null = null;

const handleDeleteClick = () => {
  if (isConfirming.value) {
    // Phase 2: Second click - execute delete
    if (confirmationTimeout) clearTimeout(confirmationTimeout);
    isConfirming.value = false;
    emit("executeDelete");
  } else {
    // Phase 1: First activation - switch to "are you sure?"
    isConfirming.value = true;

    // Automatic Reset after 4 seconds in case nothing happens
    confirmationTimeout = setTimeout(() => {
      isConfirming.value = false;
    }, 4000);
  }
};

const cancelDelete = (e: Event) => {
  e.stopPropagation();
  if (confirmationTimeout) clearTimeout(confirmationTimeout);
  isConfirming.value = false;
};
</script>
