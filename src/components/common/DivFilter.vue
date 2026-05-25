<template>
  <div class="fixed bottom-6 right-6 z-50 md:hidden">
    <ButtonMobileCreate
      data-testid="div-filter-mobile-create"
      @click="emitCreateClicked"
    />
    <Sheet v-model:open="isMobileSheetOpen">
      <SheetTrigger as-child>
        <Button
          data-testid="div-filter-mobile-trigger"
          class="h-12 w-12 p-0 rounded-full shadow-lg"
        >
          <Filter class="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        data-testid="div-filter-mobile-sheet"
        side="bottom"
        class="h-[70vh] rounded-t-xl p-6 flex flex-col"
      >
        <SheetHeader class="text-left pb-3 border-b shrink-0">
          <SheetTitle>{{ $t("General.displayOptions") }}</SheetTitle>
          <SheetDescription class="sr-only">
            {{ $t("General.displayOptions") }}
          </SheetDescription>
        </SheetHeader>

        <div class="flex-1 overflow-y-auto space-y-4 py-0">
          <div class="space-y-2 pb-1">
            <p class="text-sm font-semibold px-0.5">
              {{ $t("General.filterData") }}
            </p>
            <InputStandard
              :model-value="modelValue"
              @update:model-value="handleInput"
              id="div-filter-mobile-input"
              :placeholder="placeholder"
              enterkeyhint="send"
            >
              <template #button>
                <Button
                  data-testid="div-filter-mobile-all"
                  type="button"
                  variant="outline"
                  size="icon"
                  @click="clearSearch"
                  class="rounded-l-none border-l"
                >
                  <X class="icon-medium" />
                </Button>
              </template>
            </InputStandard>
          </div>

          <div v-if="showValidToggle" class="flex items-center gap-3 pb-1.5">
            <Switch
              data-testid="div-filter-mobile-valid-now"
              id="validInputMobile"
              :modelValue="validNow"
              @update:model-value="handleToggle"
            />
            <Label
              for="validInputMobile"
              class="cursor-pointer text-sm font-medium select-none whitespace-nowrap"
            >
              {{ $t("General.validNow") }}
            </Label>
          </div>

          <slot name="mobile-right"></slot>
        </div>
      </SheetContent>
    </Sheet>
  </div>

  <div class="hidden md:flex justify-center w-full mb-6">
    <div
      class="flex flex-col items-center gap-4 bg-background p-2 w-full max-w-2xl md:flex-row md:justify-center md:items-end"
    >
      <Button
        data-testid="div-filter-create"
        @click="emitCreateClicked"
        class="w-full md:w-auto"
      >
        <Plus class="icon-medium mr-2" />
        {{ $t("General.new") }}
      </Button>

      <div class="flex w-full md:w-80 items-center">
        <Button
          data-testid="div-filter-all"
          variant="secondary"
          class="rounded-r-none!"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Filter, Plus, X } from "lucide-vue-next";
import { onBeforeUnmount, ref, watch } from "vue";
import ButtonMobileCreate from "./ButtonMobileCreate.vue";
import InputStandard from "./InputStandard.vue";

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
const isMobileSheetOpen = ref(false);
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

const emitCreateClicked = () => {
  emit("createClicked");
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
