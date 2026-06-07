<template>
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
import { computed, type Ref } from "vue";
import { any, type ZodType } from "zod";

import SelectStandard from "../common/SelectStandard.vue";

import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { useCreateContractpartnerModalStore } from "./CreateContractpartnerModal.store";

const contractpartnerId = defineModel({ type: Number });

const props = withDefaults(
  defineProps<{
    validityDate?: Date;
    validationSchema?: ZodType;
    validationSchemaRef?: Ref<ZodType>;
    fieldLabel: string;
    idSuffix?: string;
  }>(),
  {
    validationSchema: () => any().optional(),
    idSuffix: "",
  },
);

const { getAsSelectBoxValues } = useContractpartnerStore();
const { openCreate: openCreateContractpartner } =
  useCreateContractpartnerModalStore();

const selectBoxValues = computed(() =>
  getAsSelectBoxValues(props.validityDate),
);

const showCreateContractpartnerModal = () =>
  openCreateContractpartner(
    (contractpartnerEntry) =>
      (contractpartnerId.value = contractpartnerEntry.id),
  );
</script>
