<template>
  <tr v-if="mmf">
    <th class="db" id="thDatabase">
      {{ $t("CompareData.database") }}
    </th>
    <td class="db">
      <SpanDate :date="mmf.bookingDate" />
    </td>
    <td class="db">
      <SpanDate :date="mmf.invoiceDate" />
    </td>
    <td class="db text-end">
      <SpanAmount :amount="mmf.amount" />
    </td>
    <td class="db text-start">
      {{ mmf.contractpartnerName }}
    </td>
    <td class="db text-start">
      {{ mmf.comment }}
    </td>
    <td class="db text-start">
      {{ mmf.capitalsourceComment }}
    </td>
    <td class="db text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="editMoneyflow"
        ><i class="bi bi-pencil-square"></i
      ></span>
    </td>
    <td class="db text-center" v-if="isOwnMoneyflow">
      <span class="link-primary" @click="deleteMoneyflow"
        ><i class="bi bi-trash"></i
      ></span>
    </td>
    <td class="db" colspan="2" v-if="!isOwnMoneyflow"></td>
  </tr>
  <tr v-if="importData">
    <th id="thSource">{{ $t("CompareData.source") }}</th>
    <td>
      <SpanDate :date="importData.bookingDate" />
    </td>
    <td>
      <SpanDate :date="importData.invoiceDate" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="importData.amount" />
    </td>
    <td class="text-start">{{ importData.partner }}</td>
    <td class="text-start">{{ importData.comment }}</td>
    <td class="text-start">
      {{ capitalsourceComment }}
    </td>
    <td colspan="2"></td>
  </tr>
  <tr style="border-bottom: 2px solid #000"></tr>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";

import SpanAmount from "../SpanAmount.vue";
import SpanDate from "../SpanDate.vue";

import { useUserSessionStore } from "@/stores/UserSessionStore";

import type { CompareDataDataset } from "@/model/comparedata/CompareDataDataset";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  mmf: {
    type: Object as PropType<Moneyflow>,
    required: false,
  },
  importData: {
    type: Object as PropType<CompareDataDataset>,
    required: false,
  },
  capitalsourceComment: {
    type: String,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits(["deleteMoneyflow", "editMoneyflow"]);

const isOwnMoneyflow = computed(() => {
  return props.mmf ? props.mmf.userId === userSessionStore.getUserId : false;
});

const deleteMoneyflow = () => {
  if (props.mmf) emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  if (props.mmf) emit("editMoneyflow", props.mmf.id);
};
</script>

<style scoped>
th.db,
td.db {
  background-color: #f2f2f2;
}
</style>
