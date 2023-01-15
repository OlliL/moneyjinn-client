<template>
  <tr>
    <td class="text-start">{{ mca.accountNumber }}</td>
    <td class="text-start">{{ mca.bankCode }}</td>
    <td class="text-center">
      <span
        role="button"
        class="link-primary"
        @click="editContractpartnerAccount"
        >bearbeiten</span
      >
    </td>
    <td class="text-center">
      <span
        role="button"
        class="link-primary"
        @click="deleteContractpartnerAccount"
        >l&ouml;schen</span
      >
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import type { PropType } from "vue";

const props = defineProps({
  mca: {
    type: Object as PropType<ContractpartnerAccount>,
    required: true,
  },
});

const emit = defineEmits([
  "deleteContractpartnerAccount",
  "editContractpartnerAccount",
]);

const deleteContractpartnerAccount = () => {
  emit("deleteContractpartnerAccount", props.mca);
};
const editContractpartnerAccount = () => {
  emit("editContractpartnerAccount", props.mca);
};
</script>
