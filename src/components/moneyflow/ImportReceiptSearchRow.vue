<template>
  <tr>
    <td class="">
      <div class="form-check d-flex align-items-center justify-content-center">
        <input
          class="form-check-input"
          type="radio"
          :name="'selectMoneyflow' + receiptId"
          :checked="preselected"
          @change="moneyflowSelected"
        />
      </div>
    </td>
    <td><SpanDate :date="mmf.invoiceDate" /></td>
    <td class="text-end"><SpanAmount :amount="mmf.amount" /></td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="editMoneyflow"><i class="bi bi-pencil-square"></i></span>
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="deleteMoneyflow"><i class="bi bi-trash"></i></span>
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
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "update:modelValue",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
const moneyflowSelected = () => {
  emit("update:modelValue", props.mmf.id);
};
</script>
