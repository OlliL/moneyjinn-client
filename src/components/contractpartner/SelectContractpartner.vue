<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModal"
    :id-suffix="idSuffix"
    @contractpartner-created="contractpartnerCreated"
  />

  <div class="input-group">
    <div class="form-floating">
      <SelectStandard
        v-model="contractpartnerId"
        :validation-schema="validationSchema"
        :validation-schema-ref="validationSchemaRef"
        :id="'contractpartner' + idSuffix"
        :field-label="fieldLabel"
        :select-box-values="selectBoxValues"
      >
        <template #icon
          ><span
            class="input-group-text"
            @click="showCreateContractpartnerModal"
            ><i class="bi bi-plus"></i></span
        ></template>
      </SelectStandard>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, type PropType, type Ref } from "vue";
import { any, type ZodType } from "zod";

import CreateContractpartnerModalVue from "./CreateContractpartnerModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

const props = defineProps({
  validityDate: {
    type: Date,
    required: false,
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
  validationSchemaRef: {
    type: Object as PropType<Ref<ZodType>>,
    required: false,
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

const contractpartnerId = ref(0);
const createContractpartnerModal = ref();
const contractpartnerStore = useContractpartnerStore();
const emit = defineEmits(["update:modelValue"]);

const selectBoxValues = computed((): Array<SelectBoxValue> => {
  return [
    firstSelectBoxValue,
    ...contractpartnerStore.getAsSelectBoxValues(props.validityDate),
  ];
});

const showCreateContractpartnerModal = () => {
  createContractpartnerModal.value._show();
};

const contractpartnerCreated = (mcp: Contractpartner) => {
  contractpartnerId.value = mcp.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      contractpartnerId.value = newVal ?? 0;
    }
  },
  { immediate: true },
);

watch(contractpartnerId, (newVal, oldVal) => {
  if (newVal != oldVal) {
    contractpartnerId.value = newVal ?? 0;
    emit("update:modelValue", contractpartnerId.value);
  }
});
</script>
