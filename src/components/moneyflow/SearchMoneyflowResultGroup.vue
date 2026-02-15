<template>
  <tr>
    <td style="vertical-align: middle">
      <a
        class="btn btn-outline-primary"
        data-bs-toggle="collapse"
        :href="'#collapseResults' + moneyflowGroupKey"
        aria-expanded="false"
        aria-controls="collapseExample"
        ><span class="link-primary"><i :class="collapseIconClass"></i></span
      ></a>
    </td>
    <td style="vertical-align: middle" v-if="colBookingMonth">
      <span class="link-primary"
        ><router-link
          class="nav-link button"
          :to="{
            name: Routes.ListReports,
            params: { year: moneyflowGroup.year, month: moneyflowGroup.month },
          }"
          >{{ moneyflowGroup.monthString }}
          {{ moneyflowGroup.year }}</router-link
        ></span
      >
    </td>
    <td style="vertical-align: middle" v-if="colBookingYear">
      <span class="link-primary"
        ><router-link
          class="nav-link button"
          :to="{
            name: Routes.ListReports,
            params: { year: moneyflowGroup.year },
          }"
        >
          {{ moneyflowGroup.year }}</router-link
        ></span
      >
    </td>
    <td style="vertical-align: middle" v-if="colContractpartner">
      {{ moneyflowGroup.contractpartnerName }}
    </td>

    <td class="text-end" style="white-space: nowrap; vertical-align: middle">
      <SpanAmount :amount="moneyflowGroup.amount" />
    </td>
    <td class="text-start" style="vertical-align: middle">
      {{ moneyflowGroup.commentString }}
    </td>
  </tr>
  <tr>
    <td colspan="5" style="padding: 0">
      <div class="collapse" :id="'collapseResults' + moneyflowGroupKey">
        <table
          class="table table-striped table-bordered table-hover"
          v-if="showDetails"
        >
          <thead>
            <tr>
              <th scope="col" class="d-none d-md-table-cell align-top"></th>
              <th scope="col">{{ $t("Moneyflow.bookingdate") }}</th>
              <th scope="col">{{ $t("General.amount") }}</th>
              <th scope="col">{{ $t("General.contractpartner") }}</th>
              <th scope="col">{{ $t("General.comment") }}</th>
              <th scope="col">{{ $t("General.postingAccount") }}</th>
              <th scope="col">{{ $t("General.capitalsource") }}</th>
              <th scope="colgroup" colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <SearchMoneyflowResultRowVue
              v-for="(moneyflow, index) of moneyflowGroup.moneyflows"
              :key="moneyflow.id"
              :mmf="moneyflow"
              :rowspan="rowsPerMoneyflow.get(moneyflow.id) ?? 1"
              :isFirstOfMultipleRowsForSameMoneyflow="
                firstIndexForMoneyflow.get(moneyflow.id) === index
              "
              @delete-moneyflow="emitDeleteMoneyflow"
              @edit-moneyflow="emitEditMoneyflow"
              @list-moneyflow="emitListMoneyflow"
              @show-receipt="emitShowReceipt"
            />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch, type PropType } from "vue";

import { Routes } from "@/router";

import SearchMoneyflowResultRowVue from "./SearchMoneyflowResultRow.vue";
import SpanAmount from "../SpanAmount.vue";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

type MoneyflowGroup = {
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

const props = defineProps({
  moneyflowGroupKey: {
    type: String,
    required: true,
  },
  moneyflowGroup: {
    type: Object as PropType<MoneyflowGroup>,
    required: true,
  },
  colBookingMonth: {
    type: Boolean,
    required: true,
  },
  colBookingYear: {
    type: Boolean,
    required: true,
  },
  colContractpartner: {
    type: Boolean,
    required: true,
  },
});

const collapseIconClass = ref("bi bi-caret-right-fill");
const showDetails = ref(false);
const emit = defineEmits([
  "showReceipt",
  "deleteMoneyflow",
  "editMoneyflow",
  "listMoneyflow",
]);
const rowsPerMoneyflow = ref(new Map<number, number>());
const firstIndexForMoneyflow = ref(new Map<number, number>());

watch(
  () => props.moneyflowGroup.moneyflows,
  (moneyflows) => {
    moneyflows.forEach((mmf) => {
      const curVal = rowsPerMoneyflow.value.get(mmf.id);
      if (curVal === undefined) {
        rowsPerMoneyflow.value.set(mmf.id, 1);
      } else {
        rowsPerMoneyflow.value.set(mmf.id, curVal + 1);
      }
      if (!firstIndexForMoneyflow.value.has(mmf.id)) {
        firstIndexForMoneyflow.value.set(mmf.id, moneyflows.indexOf(mmf));
      }
    });
  },
  { immediate: true },
);

const toggleButtonShow = () => {
  collapseIconClass.value = "bi bi-caret-down-fill";
  showDetails.value = true;
};
const toggleButtonHide = () => {
  collapseIconClass.value = "bi bi-caret-right-fill";
};
const emitShowReceipt = (id: number) => {
  emit("showReceipt", id);
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
};
const emitListMoneyflow = (id: number) => {
  emit("listMoneyflow", id);
};

onMounted(() => {
  document
    .getElementById("collapseResults" + props.moneyflowGroupKey)
    ?.addEventListener("show.bs.collapse", () => toggleButtonShow());
  document
    .getElementById("collapseResults" + props.moneyflowGroupKey)
    ?.addEventListener("hide.bs.collapse", () => toggleButtonHide());
});
</script>
