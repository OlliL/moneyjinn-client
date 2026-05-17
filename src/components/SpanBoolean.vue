<template>
  <span
    ><b :class="colorClass" data-testid="booleanSpan">{{ text }}</b></span
  >
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  value: {
    type: Boolean,
    required: false,
  },
});

const colorClass = computed(() => {
  return props.value ? "text-green-600" : "text-red-600";
});

const text = computed(() => {
  return props.value ? t("General.yes") : t("General.no");
});
</script>
