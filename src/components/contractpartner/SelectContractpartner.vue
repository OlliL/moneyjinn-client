<template>
  <CreateContractpartnerModalVue
    ref="createContractpartnerModal"
    :id-suffix="idSuffix"
    @contractpartner-created="contractpartnerCreated"
  />

  <SelectStandard
    v-model="contractpartnerId"
    :validation-schema="validationSchema"
    :validation-schema-ref="validationSchemaRef"
    :id="'contractpartner' + idSuffix"
    :field-label="fieldLabel"
    :select-box-values="selectBoxValues"
  >
    <template #icon
      ><span class="input-group-text" @click="showCreateContractpartnerModal"
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

import CreateContractpartnerModalVue from "./CreateContractpartnerModal.vue";
import SelectStandard from "../SelectStandard.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

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

const contractpartnerId: Ref<number | undefined> = ref(undefined);
const createContractpartnerModal = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModal");
const contractpartnerStore = useContractpartnerStore();
const emit = defineEmits(["update:modelValue"]);

const selectBoxValues = computed(() =>
  contractpartnerStore.getAsSelectBoxValues(props.validityDate),
);

const showCreateContractpartnerModal = () => {
  createContractpartnerModal.value?._show();
};

const contractpartnerCreated = (mcp: Contractpartner) => {
  contractpartnerId.value = mcp.id;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      contractpartnerId.value = newVal;
    }
  },
  { immediate: true },
);

watch(contractpartnerId, (newVal, oldVal) => {
  if (newVal != oldVal) {
    contractpartnerId.value = newVal;
    emit("update:modelValue", contractpartnerId.value);
  }
});
</script>
