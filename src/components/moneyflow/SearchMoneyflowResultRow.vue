<template>
  <tr>
    <td><SpanDate :date="mmf.bookingDate" /></td>
    <td class="text-end"><SpanAmount :amount="mmf.amount" /></td>
    <td class="text-start">{{ mmf.contractpartnerName }}</td>
    <td class="text-start">{{ mmf.comment }}</td>
    <td class="text-start">{{ mmf.postingAccountName }}</td>
    <td class="text-start">
      {{ mmf.capitalsourceComment }}
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="editMoneyflow">{{
        $t("General.edit")
      }}</span>
    </td>
    <td class="text-center" v-if="isOwnMoneyflow">
      <span role="button" class="link-primary" @click="deleteMoneyflow">{{
        $t("General.delete")
      }}</span>
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
});
const userSessionStore = useUserSessionStore();
const emit = defineEmits(["deleteMoneyflow", "editMoneyflow"]);

const isOwnMoneyflow = computed(() => {
  return props.mmf.userId === userSessionStore.getUserId;
});

const deleteMoneyflow = () => {
  emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  emit("editMoneyflow", props.mmf.id);
};
</script>
