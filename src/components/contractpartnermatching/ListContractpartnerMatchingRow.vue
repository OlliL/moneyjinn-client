<template>
  <tr>
    <td class="text-start">{{ mcm.matchingText }}</td>
    <td class="text-start">{{ mcm.contractpartnerName }}</td>
    <td class="text-start">{{ mcm.moneyflowComment }}</td>
    <td class="text-start">{{ mcm.postingAccountName }}</td>
    <td class="text-center">
      <span class="link-primary" @click="editContractpartnerMatching"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteContractpartnerMatching"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

const props = defineProps({
  mcm: {
    type: Object as PropType<ContractpartnerMatching>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerMatching",
  "editContractpartnerMatching",
]);

const deleteContractpartnerMatching = () => {
  emit("deleteContractpartnerMatching", props.mcm);
};
const editContractpartnerMatching = () => {
  emit("editContractpartnerMatching", props.mcm);
};
</script>
