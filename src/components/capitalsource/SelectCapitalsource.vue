<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModal"
    :id-suffix="idSuffix"
    @capitalsource-created="capitalsourceCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <SelectStandard
        v-model="capitalsourceId"
        :validation-schema="validationSchema"
        :id="'capitalsource' + idSuffix"
        :field-label="fieldLabel"
        :select-box-values="selectBoxValues"
      >
        <template #icon
          ><span
            class="input-group-text"
            role="button"
            @click="showCreateCapitalsourceModal"
            ><i class="bi bi-plus"></i></span
        ></template>
      </SelectStandard>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, type PropType } from "vue";
import { any, type ZodType } from "zod";

import CreateCapitalsourceModalVue from "./CreateCapitalsourceModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

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

const firstSelectBoxValue = { id: 0, value: "" } as SelectBoxValue;

const capitalsourceId = ref(0);
const createCapitalsourceModal = ref();
const capitalsourceStore = useCapitalsourceStore();
const emit = defineEmits(["update:modelValue"]);

const selectBoxValues = computed((): Array<SelectBoxValue> => {
  return [
    firstSelectBoxValue,
    ...capitalsourceStore.getAsSelectBoxValues(props.validityDate),
  ];
});

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModal.value._show();
};

const capitalsourceCreated = (mcs: Capitalsource) => {
  capitalsourceId.value = mcs.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      capitalsourceId.value = newVal ? newVal : 0;
    }
  },
  { immediate: true }
);

watch(capitalsourceId, (newVal, oldVal) => {
  if (newVal != oldVal) {
    capitalsourceId.value = newVal ? newVal : 0;
    emit("update:modelValue", capitalsourceId.value);
  }
});
</script>
