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

  const cleanToCopy = props.iban.replaceAll(/\s/g, "");

  // Try to use the modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cleanToCopy).catch((err) => {
      console.error("Failed to copy using Clipboard API:", err);
      // Fallback if Clipboard API fails (e.g., permissions)
      fallbackCopyToClipboard(cleanToCopy);
    });
  } else {
    // Fallback for browsers that don't support Clipboard API or in insecure contexts
    fallbackCopyToClipboard(cleanToCopy);
  }
};

const fallbackCopyToClipboard = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};
</script>
