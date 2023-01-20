<template>
  <tr>
    <td class="">
      <div class="form-check d-flex align-items-center justify-content-center">
        <input
          class="form-check-input"
          type="radio"
          :name="'selectMoneyflow' + receiptId"
          :checked="preselected"
          @change="emitSelection"
        />
      </div>
    </td>
    <td><SpanDate :date="mmf.invoiceDate" /></td>
    <td class="text-end"><SpanAmount :amount="mmf.amount" /></td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="editMoneyflow"
        >bearbeiten</span
      >
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="deleteMoneyflow"
        >l&ouml;schen</span
      >
    </td>
    <td colspan="2" v-if="!isOwnMoneyflow"></td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: true,
  },
  preselected: {
    type: Boolean,
    required: true,
  },
  receiptId: {
    type: Number,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits(["deleteMoneyflow", "editMoneyflow", "emitSelection"]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const emitSelection = () => {
  emit("emitSelection", props.mmf.id);
};
</script>
