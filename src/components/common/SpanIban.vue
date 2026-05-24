<template>
  <span class="inline-flex items-center gap-1.5 group">
    <span class="whitespace-nowrap">{{ ibanFormatted }}</span>

    <button
      v-if="iban"
      type="button"
      class="text-muted-foreground/40 group-hover:text-muted-foreground hover:text-foreground! transition-colors p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      :title="$t('General.copy') || 'Kopieren'"
      @click="copyToClipboard"
    >
      <Copy class="icon-medium" />
    </button>
  </span>
</template>

<script lang="ts" setup>
import { Copy } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  iban: {
    type: String,
    required: false,
  },
});

const ibanFormatted = computed(() => {
  if (!props.iban) return "";

  const cleanIban = props.iban.replaceAll(/\s/g, "");

  const isIban =
    /^[A-Za-z]{2}\d+$/.test(cleanIban) &&
    cleanIban.length >= 15 &&
    cleanIban.length <= 34;

  return isIban
    ? cleanIban.replaceAll(/(.{4})/g, "$1\u00A0").trim()
    : props.iban;
});

const copyToClipboard = () => {
  if (!props.iban) return;
  if (!navigator.clipboard?.writeText) return;

  const cleanToCopy = props.iban.replaceAll(/\s/g, "");

  navigator.clipboard.writeText(cleanToCopy).catch((err) => {
    console.error(err);
  });
};
</script>
