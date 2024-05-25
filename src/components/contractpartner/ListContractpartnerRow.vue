<template>
  <tr>
    <td class="text-start">{{ mcp.name }}</td>
    <td><SpanDate :date="mcp.validFrom" /></td>
    <td><SpanDate :date="mcp.validTil" /></td>
    <td class="text-start">{{ mcp.moneyflowComment }}</td>
    <td class="text-start">{{ mcp.postingAccountName }}</td>
    <td class="text-center">
      <span class="link-primary" @click="editContractpartner"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deleteContractpartner"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="listAccounts">{{
        $t("Contractpartner.accounts")
      }}</span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";

import SpanDate from "../SpanDate.vue";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";

const props = defineProps({
  mcp: {
    type: Object as PropType<Contractpartner>,
    required: true,
  },
});
const emit = defineEmits([
  "deleteContractpartner",
  "editContractpartner",
  "listContractpartnerAccounts",
]);

const deleteContractpartner = () => {
  emit("deleteContractpartner", props.mcp);
};
const editContractpartner = () => {
  emit("editContractpartner", props.mcp);
};
const listAccounts = () => {
  emit("listContractpartnerAccounts", props.mcp);
};
</script>
