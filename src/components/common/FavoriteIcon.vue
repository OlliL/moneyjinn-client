<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center font-bold select-none transition-colors shadow-md',
      sizeClasses,
    ]"
    :style="{
      backgroundColor: color,
      color: contrastColor,
    }"
  >
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(defineProps<{
    text?: string;
    color?: string;
    size?: string;
}>(), {
  size: "md"
});

const contrastColor = computed(() => {
  const hexColor = props.color;
  if (!hexColor || hexColor.length < 7) return "black";
  const r = Number.parseInt(hexColor.slice(1, 3), 16);
  const g = Number.parseInt(hexColor.slice(3, 5), 16);
  const b = Number.parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
});

const sizeClasses = computed(() => {
  if (props.size === "sm") return "w-8 h-8 text-[10px]";
  if (props.size === "lg") return "w-16 h-16 text-xl";
  return "w-12 h-12 text-base";
});
</script>
