<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModal"
    :id-suffix="idSuffix"
    @capitalsource-created="capitalsourceCreated"
  />

  <SelectStandard
    v-model="capitalsourceId"
    :validation-schema="validationSchema"
    :id="'capitalsource' + idSuffix"
    :field-label="fieldLabel"
    :select-box-values="selectBoxValues"
  >
    <template #icon
      ><SquarePlus
        @click="showCreateCapitalsourceModal"
        class="h-4 w-4 cursor-pointer"
    /></template>
  </SelectStandard>
</template>

<script lang="ts" setup>
import { SquarePlus } from "lucide-vue-next";
import { computed, useTemplateRef, type PropType } from "vue";
import { any, type ZodType } from "zod";

import CreateCapitalsourceModalVue from "./CreateCapitalsourceModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";

const capitalsourceId = defineModel({ type: Number });

const props = defineProps({
  validityDate: {
    type: Date,
    required: true,
  },
  validationSchema: {
    type: Object as PropType<ZodType>,
    required: false,
    default: any().optional(),
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  idSuffix: {
    type: String,
    default: "",
  },
});

const createCapitalsourceModal = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModal");
const capitalsourceStore = useCapitalsourceStore();

const selectBoxValues = computed(() =>
  capitalsourceStore.getAsSelectBoxValues(props.validityDate),
);

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModal.value?._show();
};

const capitalsourceCreated = (mcs: Capitalsource) => {
  capitalsourceId.value = mcs.id;
};
</script>
