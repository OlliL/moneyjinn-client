<template>
  <tr>
    <td class="text-start">{{ mca.accountNumber }}</td>
    <td class="text-start">{{ mca.bankCode }}</td>
    <td class="text-center">
      <span
        role="button"
        class="link-primary"
        @click="editContractpartnerAccount"
        >{{ $t("General.edit") }}</span
      >
    </td>
    <td class="text-center">
      <span
        role="button"
        class="link-primary"
        @click="deleteContractpartnerAccount"
        >{{ $t("General.delete") }}</span
      >
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";

import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

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
