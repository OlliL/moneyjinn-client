<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :style="modalStyle"
      :class="[
        'sm:max-w-lg',
        'max-h-[90vh]',
        'flex flex-col',
        `!z-[${zIndex}]`,
      ]"
    >
      <DialogHeader>
        <DialogTitle class="text-center w-full">
          <h4 class="text-2xl font-bold">{{ title }}</h4>
        </DialogTitle>
      </DialogHeader>

      <div class="py-2 overflow-y-auto flex-1">
        <slot name="body" />
      </div>

      <DialogFooter class="sm:justify-center gap-2">
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            {{ $t("Modal.cancel") }}
          </Button>
        </DialogClose>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: String,
    default: "",
  },
  zIndex: {
    type: String,
    default: "2000",
  },
});

const isOpen = ref(false);

const modalStyle = computed(() => {
  return props.maxWidth ? { maxWidth: props.maxWidth } : {};
});

const _show = () => {
  isOpen.value = true;
};
const _hide = () => {
  isOpen.value = false;
};

defineExpose({ _show, _hide });
</script>
