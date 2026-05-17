<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      :class="[
        props.maxWidth ? props.maxWidth : 'max-w-[calc(100%-2rem)] sm:max-w-lg',
        'max-h-[90vh]',
        'flex flex-col gap-6 p-6 overflow-visible',
        `!z-[${zIndex}]`,
      ]"
    >
      <DialogHeader class="space-y-1.5 text-left">
        <DialogTitle>
          <h4 class="text-lg font-semibold leading-none tracking-tight">
            {{ title }}
          </h4>
        </DialogTitle>
      </DialogHeader>

      <div class="overflow-y-auto flex-1 pr-1">
        <slot name="body" />
      </div>

      <DialogFooter
        class="flex flex-row justify-end gap-2 pt-4 border-t border-border/40"
      >
        <DialogClose as-child>
          <Button
            type="button"
            variant="ghost"
            class="flex items-center gap-2 px-4"
          >
            <X class="h-4 w-4" />
            {{ $t("Modal.cancel") }}
          </Button>
        </DialogClose>
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-vue-next";
import { ref } from "vue";

const props = defineProps({
  title: { type: String, default: "" },
  maxWidth: { type: String, default: "" },
  zIndex: { type: String, default: "2000" },
});

const isOpen = ref(false);

const _show = () => {
  isOpen.value = true;
};

const _hide = () => {
  isOpen.value = false;
};

defineExpose({
  _show,
  _hide,
});
</script>
