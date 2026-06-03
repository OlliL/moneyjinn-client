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
      ><SquarePlus @click="showCreateContractpartnerModal" class="icon-medium"
    /></template>
  </SelectStandard>
</template>
<script lang="ts" setup>
import { SquarePlus } from "lucide-vue-next";
import { computed, useTemplateRef, type PropType, type Ref } from "vue";
import { any, type ZodType } from "zod";

import SelectStandard from "../common/SelectStandard.vue";
import CreateContractpartnerModalVue from "./CreateContractpartnerModal.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const contractpartnerId = defineModel({ type: Number });

const props = withDefaults(defineProps<{
    validityDate?: Date;
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    fieldLabel: string;
    idSuffix?: string;
}>(), {
  validationSchema: () => any().optional(),
  idSuffix: ""
});

const createContractpartnerModal = useTemplateRef<
  typeof CreateContractpartnerModalVue
>("createContractpartnerModal");
const contractpartnerStore = useContractpartnerStore();

const selectBoxValues = computed(() =>
  contractpartnerStore.getAsSelectBoxValues(props.validityDate),
);

const showCreateContractpartnerModal = () => {
  createContractpartnerModal.value?._show();
};

const contractpartnerCreated = (mcp: Contractpartner) => {
  contractpartnerId.value = mcp.id;
};
</script>
