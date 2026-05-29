<script lang="ts" setup>
import { computed } from "vue";
import type { ToasterProps } from "vue-sonner";

import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-vue-next";
import { Toaster as Sonner } from "vue-sonner";

const props = defineProps<ToasterProps>();

const mergedToastOptions = computed(() => ({
  ...props.toastOptions,
  classes: {
    ...props.toastOptions?.classes,
    toast: cn(
      "rounded-2xl !text-foreground !py-2",
      props.toastOptions?.classes?.toast,
    ),
    title: cn("!font-bold", props.toastOptions?.classes?.title),
    description: cn("!font-bold", props.toastOptions?.classes?.description),
    success: cn("!text-foreground", props.toastOptions?.classes?.success),
    error: cn("!text-foreground", props.toastOptions?.classes?.error),
    info: cn("!text-foreground", props.toastOptions?.classes?.info),
    warning: cn("!text-foreground", props.toastOptions?.classes?.warning),
  },
}));
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--gray2': 'hsl(var(--popover) / 0.9)',
      '--gray3': 'var(--border)',
      '--gray4': 'var(--border)',
      '--gray5': 'var(--border)',
      '--gray12': 'var(--popover-foreground)',
    }"
    v-bind="props"
    :toast-options="mergedToastOptions"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
