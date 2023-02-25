<template>
  <span
    ><b :style="'color:' + color">{{ text }}</b></span
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

const color = computed(() => {
  return props.value ? "green" : "red";
});

const text = computed(() => {
  return props.value ? t("General.yes") : t("General.no");
});
</script>
