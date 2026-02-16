<template>
  <ModalVue :title="$t('ETF.title.delete')" ref="modalComponent">
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row d-flex justify-content-center mt-3">
        <div class="col-11">
          <table class="table table-bordered table-hover">
            <tbody>
              <tr>
                <th scope="row" colspan="2" id="name">
                  {{ $t("General.name") }}
                </th>
                <td>{{ etf.name }}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2" id="isin">{{ $t("ETF.isin") }}</th>
                <td>{{ etf.isin }}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2" id="wkn">{{ $t("ETF.wkn") }}</th>
                <td>{{ etf.wkn }}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2" id="ticker">
                  {{ $t("ETF.ticker") }}
                </th>
                <td>{{ etf.ticker }}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2" id="chartUrl">
                  {{ $t("ETF.chartUrl") }}
                </th>
                <td><a :href="etf.chartUrl">Link</a></td>
              </tr>
              <tr>
                <th scope="rowgroup" rowspan="3" id="transactionCosts">
                  {{ $t("ETFFlow.transactionCosts") }}
                </th>
                <th scope="row" id="abs">
                  {{ $t("ETFFlow.transactionCostsAbsolute") }}
                </th>
                <td><SpanAmount :amount="etf.transactionCostsAbsolute" /></td>
              </tr>
              <tr>
                <th scope="row" id="rel">
                  {{ $t("ETFFlow.transactionCostsRelative") }}
                </th>
                <td>{{ trabsactionCostsRelativeString }}</td>
              </tr>
              <tr>
                <th scope="row" id="max">
                  {{ $t("ETFFlow.transactionCostsMaximum") }}
                </th>
                <td><SpanAmount :amount="etf.transactionCostsMaximum" /></td>
              </tr>
              <tr>
                <th scope="row" colspan="2" id="taxExemption">
                  {{ $t("ETF.partialTaxExemption") }}
                </th>
                <td>{{ partialTaxExemptionString }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteEtf">
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfService from "@/service/CrudEtfService";
import SpanAmount from "../SpanAmount.vue";
import { formatNumber } from "@/tools/views/FormatNumber";

const serverErrors = ref(new Array<string>());

const etf = ref({} as Etf);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["etfDeleted"]);

const trabsactionCostsRelativeString = computed(() => {
  return etf.value.transactionCostsRelative === undefined
    ? ""
    : formatNumber(etf.value.transactionCostsRelative, 2) + " %";
});

const partialTaxExemptionString = computed(() => {
  return etf.value.partialTaxExemption === undefined
    ? ""
    : formatNumber(etf.value.partialTaxExemption, 2) + " %";
});

const _show = (_etf: Etf) => {
  etf.value = _etf;
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteEtf = () => {
  serverErrors.value = new Array<string>();

  CrudEtfService.deleteEtf(etf.value.id)
    .then(() => {
      modalComponent.value?._hide();
      emit("etfDeleted", etf.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>

<style scoped>
th {
  background-color: #f2f2f2;
}
</style>
