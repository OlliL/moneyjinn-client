<template>
  <div class="h-full w-full min-h-[320px] overflow-y-auto border rounded-sm">
    <VuePdfEmbed :source="pdfSource" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

const props = defineProps<{
  receiptBase64: string;
}>();

const pdfSource = computed(() => ({
  data: atob(props.receiptBase64),
}));
</script>
