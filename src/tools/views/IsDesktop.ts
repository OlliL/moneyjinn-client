import { useMediaQuery } from "@vueuse/core";
import type { ComputedRef } from "vue";

export function isDesktop(): ComputedRef<boolean> {
  return useMediaQuery("(min-width: 640px)");
}
