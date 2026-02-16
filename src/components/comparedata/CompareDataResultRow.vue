<template>
  <tr v-if="mmf">
    <th scope="row" class="db" id="thDatabase">
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
    <th scope="row" id="thSource">{{ $t("CompareData.source") }}</th>
    <td>
      <SpanDate :date="importData.bookingDate" />
    </td>
    <td>
      <SpanDate :date="importData.invoiceDate" />
    </td>
    <td class="text-end">
      <SpanAmount :amount="importData.amount" />
    </td>
    <td class="text-start" v-if="importData.partner">
      {{ importData.partner }}
    </td>
    <td class="text-start" v-else>
      <i>{{ importData.contractpartnerName }}</i>
    </td>
    <td class="text-start">{{ importData.comment }}</td>
    <td class="text-start">
      {{ capitalsourceComment }}
    </td>
    <td class="db text-center">
      <span class="link-primary" @click="createMoneyflow" v-if="!mmf"
        ><i class="bi bi-plus-circle"></i
      ></span>
    </td>
    <td></td>
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
  capitalsourceId: {
    type: Number,
    required: true,
  },
  capitalsourceComment: {
    type: String,
    required: true,
  },
});

const userSessionStore = useUserSessionStore();
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "createMoneyflow",
]);

const isOwnMoneyflow = computed(() => {
  return props.mmf ? props.mmf.userId === userSessionStore.getUserId : false;
});

const deleteMoneyflow = () => {
  if (props.mmf) emit("deleteMoneyflow", props.mmf.id);
};
const editMoneyflow = () => {
  if (props.mmf) emit("editMoneyflow", props.mmf.id);
};
const createMoneyflow = () => {
  const moneyflowToCreate: Moneyflow = {
    id: 0,
    bookingDate: props.importData?.bookingDate,
    invoiceDate: props.importData?.invoiceDate,
    amount: props.importData?.amount,
    comment: props.importData?.moneyflowComment
      ? props.importData?.moneyflowComment
      : props.importData?.comment,
    capitalsourceId: props.capitalsourceId,
    contractpartnerId: props.importData?.contractpartnerId,
    contractpartnerName: props.importData?.contractpartnerName,
    postingAccountId: props.importData?.postingAccountId,
    postingAccountName: props.importData?.postingAccountName,
  } as Moneyflow;
  emit("createMoneyflow", moneyflowToCreate);
};
</script>

<style scoped>
th.db,
td.db {
  background-color: #f2f2f2;
}
</style>
