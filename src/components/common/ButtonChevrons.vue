<template>
  <Button
    :data-testid="`${testIdPrefix}-previous`"
    v-if="showPreviousChevron"
    type="button"
    variant="outline"
    size="icon"
    class="cursor-pointer fixed left-4 inset-y-0 z-20 my-auto h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
    @click="emit('navigate-to-previous')"
  >
    <ChevronLeft class="h-5 w-5" />
  </Button>

  <Button
    :data-testid="`${testIdPrefix}-next`"
    v-if="showNextChevron"
    type="button"
    variant="outline"
    size="icon"
    class="fixed right-4 inset-y-0 z-20 my-auto h-10 w-10 rounded-full border-border/70 bg-background/85 text-primary/80 shadow-sm backdrop-blur transition-all hover:bg-background hover:text-primary hover:shadow-md"
    @click="emit('navigate-to-next')"
  >
    <ChevronRight class="h-5 w-5" />
  </Button>
</template>
<script lang="ts" setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import Button from "../ui/button/Button.vue";

defineProps<{
  testIdPrefix: string;
  showPreviousChevron: boolean;
  showNextChevron: boolean;
}>();

const emit = defineEmits<{
  (e: "navigate-to-previous"): void;
  (e: "navigate-to-next"): void;
}>();
</script>
