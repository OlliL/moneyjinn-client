<template>
  <tr>
    <td class="text-end"><SpanAmount :amount="mpm.amount" /></td>
    <td class="text-start">{{ mpm.contractpartnerName }}</td>
    <td class="text-start">{{ mpm.comment }}</td>
    <td class="text-start">{{ mpm.postingAccountName }}</td>
    <td class="text-start">{{ mpm.capitalsourceComment }}</td>
    <td class="text-center"><SpanBoolean :value="mpm.onceAMonth" /></td>

    <td class="text-center"><SpanDate :date="mpm.createDate" /></td>
    <td class="text-center"><SpanDate :date="mpm.lastUsed" /></td>
    <td class="text-center">
      <span class="link-primary" @click="editPreDefMoneyflow">{{
        $t("General.edit")
      }}</span>
    </td>
    <td class="text-center">
      <span class="link-primary" @click="deletePreDefMoneyflow">{{
        $t("General.delete")
      }}</span>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import SpanBoolean from "../SpanBoolean.vue";

const props = defineProps({
  mpm: {
    type: Object as PropType<PreDefMoneyflow>,
    required: true,
  },
});
const emit = defineEmits(["deletePreDefMoneyflow", "editPreDefMoneyflow"]);

const deletePreDefMoneyflow = () => {
  emit("deletePreDefMoneyflow", props.mpm);
};

const editPreDefMoneyflow = () => {
  emit("editPreDefMoneyflow", props.mpm);
};
</script>
