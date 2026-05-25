<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component
      :is="Modal.Content"
      data-testid="app-modal"
      :class="[
        props.maxWidth
          ? props.maxWidth
          : 'w-full max-w-full md:max-w-[calc(100%-2rem)]',
        'max-h-[95dvh] md:max-h-[90vh]',
        'flex flex-col gap-4 p-3 md:p-6 overflow-hidden',
      ]"
      :style="{ zIndex: props.zIndex }"
    >
      <component :is="Modal.Header" class="space-y-1.5 text-left p-0!">
        <component
          :is="Modal.Title"
          class="text-lg font-semibold leading-none tracking-tight"
        >
          {{ title }}
        </component>
        <component :is="Modal.Description" class="sr-only">{{
          title
        }}</component>
      </component>

      <div class="overflow-y-auto flex-1 pr-1">
        <slot name="body" />
      </div>

      <component
        :is="Modal.Footer"
        class="flex flex-col-reverse md:flex-row md:justify-end gap-2 md:pt-4 border-t border-border/40 p-0!"
      >
        <component :is="Modal.Close" as-child>
          <Button
            type="button"
            variant="outline"
            class="button-with-icon w-full md:w-auto px-4"
            ref="cancelButton"
          >
            <X class="icon-medium" />
            {{ $t("Modal.cancel") }}
          </Button>
        </component>
        <slot name="footer" />
      </component>
    </component>
  </component>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { isDesktop } from "@/tools/views/IsDesktop";
import { X } from "lucide-vue-next";
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";

const props = defineProps({
  title: { type: String, default: "" },
  maxWidth: { type: String, default: "" },
  zIndex: { type: String, default: "2000" },
});

const isDesktopConst = isDesktop();

const Modal = computed(() => ({
  Root: isDesktopConst.value ? Dialog : Drawer,
  Trigger: isDesktopConst.value ? DialogTrigger : DrawerTrigger,
  Content: isDesktopConst.value ? DialogContent : DrawerContent,
  Header: isDesktopConst.value ? DialogHeader : DrawerHeader,
  Title: isDesktopConst.value ? DialogTitle : DrawerTitle,
  Description: isDesktopConst.value ? DialogDescription : DrawerDescription,
  Footer: isDesktopConst.value ? DialogFooter : DrawerFooter,
  Close: isDesktopConst.value ? DialogClose : DrawerClose,
}));

const isOpen = ref(false);
const cancelButton = useTemplateRef<typeof Button>("cancelButton");

const _show = () => {
  isOpen.value = true;
};

const _hide = () => {
  isOpen.value = false;
};

watch(isOpen, (newValue) => {
  if (newValue === true)
    nextTick(() => {
      const el = cancelButton.value?.$el || cancelButton.value;
      if (el && typeof el.focus === "function") {
        el.focus();
      }
    });
});

defineExpose({
  _show,
  _hide,
});
</script>
