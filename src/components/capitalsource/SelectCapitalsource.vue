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
      ><span class="input-group-text" @click="showCreateCapitalsourceModal"
        ><i class="bi bi-plus"></i></span
    ></template>
  </SelectStandard>
</template>
<script lang="ts" setup>
import {
  computed,
  ref,
  useTemplateRef,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { any, type ZodType } from "zod";

import CreateCapitalsourceModalVue from "./CreateCapitalsourceModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";

const props = defineProps({
  validityDate: {
    type: Date,
    required: true,
  },
  modelValue: {
    type: Number,
    required: false,
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

const capitalsourceId: Ref<number | undefined> = ref(undefined);
const createCapitalsourceModal = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModal");
const capitalsourceStore = useCapitalsourceStore();
const emit = defineEmits(["update:modelValue"]);

const selectBoxValues = computed(() =>
  capitalsourceStore.getAsSelectBoxValues(props.validityDate),
);

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModal.value?._show();
};

const capitalsourceCreated = (mcs: Capitalsource) => {
  capitalsourceId.value = mcs.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      capitalsourceId.value = newVal;
    }
  },
  { immediate: true },
);

watch(capitalsourceId, (newVal, oldVal) => {
  if (newVal != oldVal) {
    capitalsourceId.value = newVal;
    emit("update:modelValue", capitalsourceId.value);
  }
});
</script>
