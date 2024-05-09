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
              <th>{{ $t("Moneyflow.bookingdate") }}</th>
              <th>{{ $t("General.amount") }}</th>
              <th>{{ $t("General.contractpartner") }}</th>
              <th>{{ $t("General.comment") }}</th>
              <th>{{ $t("General.postingAccount") }}</th>
              <th>{{ $t("General.capitalsource") }}</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <SearchMoneyflowResultRowVue
              v-for="moneyflow of moneyflowGroup.moneyflows"
              :key="moneyflow.id"
              :mmf="moneyflow"
              @delete-moneyflow="emitDeleteMoneyflow"
              @edit-moneyflow="emitEditMoneyflow"
            />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { onMounted, ref, type PropType } from "vue";

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
const emit = defineEmits(["deleteMoneyflow", "editMoneyflow"]);

const toggleButtonShow = () => {
  collapseIconClass.value = "bi bi-caret-down-fill";
  showDetails.value = true;
};
const toggleButtonHide = () => {
  collapseIconClass.value = "bi bi-caret-right-fill";
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
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
