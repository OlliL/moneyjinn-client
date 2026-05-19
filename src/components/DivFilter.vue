<template>
  <div class="flex justify-center w-full mb-6">
    <div
      class="flex flex-col items-center gap-4 bg-background p-2 w-full max-w-2xl md:flex-row md:justify-center md:items-end"
    >
      <Button
        data-testid="div-filter-create"
        @click="$emit('createClicked')"
        class="w-full md:w-auto"
      >
        <Plus class="mr-2 h-4 w-4" />
        {{ $t("General.new") }}
      </Button>

      <div class="flex w-full md:w-80 items-center">
        <Button
          data-testid="div-filter-all"
          variant="secondary"
          class="!rounded-r-none"
          @click="clearSearch"
        >
          {{ $t("General.all") }}
        </Button>
        <Input
          data-testid="div-filter-input"
          type="text"
          :placeholder="placeholder"
          :model-value="modelValue"
          class="rounded-l-none focus-visible:ring-1 w-full"
          @update:model-value="handleInput"
        />
      </div>

      <div v-if="showValidToggle" class="flex items-center gap-3 pb-1.5">
        <Switch
          data-testid="div-filter-valid-now"
          id="validInput"
          :modelValue="validNow"
          @update:model-value="handleToggle"
        />
        <Label
          for="validInput"
          class="cursor-pointer text-sm font-medium select-none whitespace-nowrap"
        >
          {{ $t("General.validNow") }}
        </Label>
      </div>

      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-vue-next";
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  placeholder: { type: String, default: "" },
  modelValue: { type: String, required: true },
  showValidToggle: { type: Boolean, default: true },
  validNow: { type: Boolean, default: true },
});

const emit = defineEmits([
  "update:modelValue",
  "update:validNow",
  "validNowToggled",
  "createClicked",
]);

const validNow = ref(props.validNow);
let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.validNow,
  (newVal) => {
    validNow.value = newVal;
  },
);

const handleInput = (val: string | number) => {
  globalThis.clearTimeout(debounceTimeout);
  debounceTimeout = globalThis.setTimeout(() => {
    emit("update:modelValue", String(val));
  }, 300);
};

const clearSearch = () => {
  globalThis.clearTimeout(debounceTimeout);
  emit("update:modelValue", "");
};

const handleToggle = (val: boolean) => {
  validNow.value = val;
  emit("update:validNow", val);
  emit("validNowToggled", val);
};

onBeforeUnmount(() => {
  globalThis.clearTimeout(debounceTimeout);
});
</script>
