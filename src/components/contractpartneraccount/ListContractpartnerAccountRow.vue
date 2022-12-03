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
<script lang="ts">
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ReportTableRow",
  props: {
    mca: {
      type: Object as PropType<ContractpartnerAccount>,
      required: true,
    },
  },
  emits: ["deleteContractpartnerAccount", "editContractpartnerAccount"],

  methods: {
    deleteContractpartnerAccount() {
      this.$emit("deleteContractpartnerAccount", this.mca);
    },
    editContractpartnerAccount() {
      this.$emit("editContractpartnerAccount", this.mca);
    },
  },
});
</script>
