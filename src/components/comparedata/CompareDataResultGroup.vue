<template>
  <tr>
    <td style="vertical-align: middle">
      <a
        class="btn btn-outline-primary"
        data-bs-toggle="collapse"
        :href="'#collapseResults' + compareDataKey"
        aria-expanded="false"
        aria-controls="collapseExample"
        v-if="compareDatasCount > 0"
        ><span class="link-primary"><i :class="collapseIconClass"></i></span
      ></a>
    </td>
    <th
      scope="row"
      style="vertical-align: middle"
      :class="amountClass"
      id="amount"
    >
      {{ compareDatasCount }}
    </th>
    <td class="text-start" style="vertical-align: middle">
      {{ comment }}
    </td>
  </tr>
  <tr v-if="compareData">
    <td colspan="5" style="padding: 0">
      <div class="collapse" :id="'collapseResults' + compareDataKey">
        <table class="table table-bordered table-hover" v-if="showDetails">
          <colgroup>
            <col style="width: 10%" />
            <col style="width: 10%" />
            <col style="width: 10%" />
            <col style="width: 7%" />
            <col style="width: 17%" />
            <col style="width: 25%" />
            <col style="width: 13%" />
            <col style="width: 4%" />
            <col style="width: 4%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">{{ $t("Moneyflow.bookingdate") }}</th>
              <th scope="col">{{ $t("Moneyflow.invoicedate") }}</th>
              <th scope="col">{{ $t("General.amount") }}</th>
              <th scope="col">{{ $t("General.contractpartner") }}</th>
              <th scope="col">{{ $t("General.comment") }}</th>
              <th scope="col">{{ $t("General.capitalsource") }}</th>
              <th scope="colgroup" colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <CompareDataResultRowVue
              v-for="(data, idx) in compareData"
              :key="idx"
              :mmf="data.moneyflow"
              :import-data="data.compareDataDataset"
              :capitalsource-id="capitalsourceId"
              :capitalsource-comment="capitalsourceComment"
              @delete-moneyflow="emitDeleteMoneyflow"
              @edit-moneyflow="emitEditMoneyflow"
              @create-moneyflow="emitCreateMoneyflow"
            />
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, type PropType } from "vue";

import CompareDataResultRowVue from "./CompareDataResultRow.vue";

import type { CompareData } from "@/model/comparedata/CompareData";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";

const props = defineProps({
  compareDataKey: {
    type: String,
    required: true,
  },
  compareData: {
    type: Object as PropType<Array<CompareData>>,
    required: false,
  },
  comment: {
    type: String,
    required: true,
  },
  amountClass: {
    type: String,
    required: true,
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

const collapseIconClass = ref("bi bi-caret-right-fill");
const showDetails = ref(false);
const emit = defineEmits([
  "deleteMoneyflow",
  "editMoneyflow",
  "createMoneyflow",
]);

const toggleButtonShow = () => {
  collapseIconClass.value = "bi bi-caret-down-fill";
  showDetails.value = true;
};
const toggleButtonHide = () => {
  collapseIconClass.value = "bi bi-caret-right-fill";
  showDetails.value = false;
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
};
const emitCreateMoneyflow = (moneyflow: Moneyflow) => {
  emit("createMoneyflow", moneyflow);
};
const compareDatasCount = computed(() => {
  return props.compareData ? props.compareData.length : 0;
});

onMounted(() => {
  document
    .getElementById("collapseResults" + props.compareDataKey)
    ?.addEventListener("show.bs.collapse", () => toggleButtonShow());
  document
    .getElementById("collapseResults" + props.compareDataKey)
    ?.addEventListener("hide.bs.collapse", () => toggleButtonHide());
});
</script>
