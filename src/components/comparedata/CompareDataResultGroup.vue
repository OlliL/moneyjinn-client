<template>
  <tr>
    <td style="vertical-align: middle">
      <a
        class="btn btn-outline-primary"
        data-bs-toggle="collapse"
        :href="'#collapseResults' + compareDataKey"
        role="button"
        aria-expanded="false"
        aria-controls="collapseExample"
        v-if="compareDatasCount > 0"
        ><span role="button" class="link-primary"
          ><i :class="collapseIconClass"></i></span
      ></a>
    </td>
    <th style="vertical-align: middle" :class="amountClass">
      {{ compareDatasCount }}
    </th>
    <td class="text-start" style="vertical-align: middle">
      {{ comment }}
    </td>
  </tr>
  <tr v-if="compareData">
    <td colspan="5" style="padding: 0">
      <div class="collapse" :id="'collapseResults' + compareDataKey">
        <table
          class="table table-striped table-bordered table-hover"
          v-if="showDetails"
        >
          <col style="width: 10%" />
          <col style="width: 10%" />
          <col style="width: 10%" />
          <col style="width: 7%" />
          <col style="width: 13%" />
          <col style="width: 25%" />
          <col style="width: 13%" />
          <col style="width: 7%" />
          <col style="width: 5%" />
          <thead>
            <tr>
              <th></th>
              <th>Buchungsdatum</th>
              <th>Rechnungsdatum</th>
              <th>Betrag</th>
              <th>Vertragspartner</th>
              <th>Kommentar</th>
              <th>Kapitalquelle</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <CompareDataResultRowVue
              v-for="(data, idx) in compareData"
              :key="idx"
              :mmf="data.moneyflow"
              :import-data="data.compareDataDataset"
              :capitalsource-comment="capitalsourceComment"
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
import { computed, onMounted, ref, type PropType } from "vue";

import CompareDataResultRowVue from "./CompareDataResultRow.vue";

import type { CompareData } from "@/model/comparedata/CompareData";

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
  capitalsourceComment: {
    type: String,
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
  showDetails.value = false;
};
const emitDeleteMoneyflow = (id: number) => {
  emit("deleteMoneyflow", id);
};
const emitEditMoneyflow = (id: number) => {
  emit("editMoneyflow", id);
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
