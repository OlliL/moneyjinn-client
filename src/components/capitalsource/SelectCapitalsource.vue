<template>
  <SelectStandard
    v-model="capitalsourceId"
    :validation-schema="validationSchema"
    :id="'capitalsource' + idSuffix"
    :field-label="fieldLabel"
    :select-box-values="selectBoxValues"
  >
    <template #icon
      ><SquarePlus @click="showCreateCapitalsourceModal" class="icon-medium"
    /></template>
  </SelectStandard>
</template>

<script lang="ts" setup>
import { SquarePlus } from "lucide-vue-next";
import { computed } from "vue";
import { any, type ZodType } from "zod";

import SelectStandard from "../common/SelectStandard.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useCreateCapitalsourceModalStore } from "./CreateCapitalsourceModal.store";

const capitalsourceId = defineModel({ type: Number });

const props = withDefaults(
  defineProps<{
    validityDate: Date;
    validationSchema?: ZodType;
    fieldLabel: string;
    idSuffix?: string;
  }>(),
  {
    validationSchema: () => any().optional(),
    idSuffix: "",
  },
);

const { openCreate: openCreateCapitalsource } =
  useCreateCapitalsourceModalStore();
const { getAsSelectBoxValues } = useCapitalsourceStore();

const selectBoxValues = computed(() =>
  getAsSelectBoxValues(props.validityDate),
);

const showCreateCapitalsourceModal = () =>
  openCreateCapitalsource(
    (capitalsourceEntry) => (capitalsourceId.value = capitalsourceEntry.id),
  );
</script>
