<template>
  <CreateEtfPreliminaryLumpSumModalVue
    ref="createModal"
    @etf-preliminary-lump-sum-created="reloadView"
    @etf-preliminary-lump-sum-updated="reloadView"
  />
  <DeleteEtfPreliminaryLumpSumModalVue
    @etf-flow-deleted="reloadView"
    ref="deleteModal"
  />
  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.preliminaryLumpSums") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-xxl-9 col-xs-12">
        <form action="#">
          <table style="margin: 0 auto">
            <tr>
              <td v-if="etfsLoaded">
                <SelectStandard
                  v-model="selectedEtf"
                  id="etf"
                  :field-label="$t('General.selectEtf')"
                  :select-box-values="etfsSelectValues"
                />
              </td>
              <td class="text-right pe-2" v-if="selectedEtf">
                <select class="form-select" v-model="selectedYear">
                  <option v-for="year in years" :key="year">
                    {{ year }}
                  </option>
                </select>
              </td>
              <td class="text-right pe-2" v-if="selectedEtf">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="showCreateEtfPreliminaryLumpSumModal(selectedEtf)"
                >
                  {{ $t("General.new") }}
                </button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="row justify-content-md-center mb-4" v-if="selectedYear">
      <div class="col-xl-4 col-md-6 col-xs-12">
        <div class="card">
          <div class="card-header text-center p-3">
            <h5>
              {{
                $t("EtfPreliminaryLumpSum.headline", {
                  year: year,
                })
              }}
            </h5>
          </div>
          <div class="card-body">
            <ShowEtfPreliminaryLumpSum
              :etfId="selectedEtf"
              :year="selectedYear"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4" v-if="selectedYear">
      <div class="col-md-4 col-xs-12">
        <button
          type="button"
          class="btn btn-primary mx-2"
          @click="
            showCreateEtfPreliminaryLumpSumModal(selectedEtf, selectedYear)
          "
        >
          {{ $t("General.edit") }}
        </button>
        <button
          type="button"
          class="btn btn-danger mx-2"
          @click="showDeleteEtfPreliminaryLumpSumModal"
        >
          {{ $t("General.delete") }}
        </button>
      </div>
    </div>
    <!---->
  </div>
</template>

<script lang="ts" setup>
import DeleteEtfPreliminaryLumpSumModalVue from "@/components/etf/DeleteEtfPreliminaryLumpSumModal.vue";
import DivError from "@/components/DivError.vue";
import CreateEtfPreliminaryLumpSumModalVue from "@/components/etf/CreateEtfPreliminaryLumpSumModal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import CrudEtfPreliminaryLumpSumControllerHandler from "@/handler/CrudEtfPreliminaryLumpSumControllerHandler";
import ShowEtfPreliminaryLumpSum from "@/components/etf/ShowEtfPreliminaryLumpSum.vue";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";
import SelectStandard from "@/components/SelectStandard.vue";
import type { Etf } from "@/model/etf/Etf";
import { ref } from "vue";
import { onMounted } from "vue";
import { watch } from "vue";

const serverErrors = ref(new Array<string>());

const etfsLoaded = ref(false);
const dataLoaded = ref(false);
const years = ref([] as number[]);
const selectedYear = ref(0);
const selectedEtf = ref(0);
const etfsSelectValues = ref({} as Array<SelectBoxValue>);
const etfs = ref({} as Array<Etf>);

const createModal = ref();
const deleteModal = ref();

const props = defineProps({
  etfId: {
    type: String,
    default: undefined,
  },
  year: {
    type: String,
    default: undefined,
  },
});

onMounted(() => {
  const etfId: number | undefined = props.etfId ? +props.etfId : undefined;
  const year: number | undefined = props.year ? +props.year : undefined;
  loadEtfs();
  if (etfId !== undefined) {
    loadYear(etfId, year);
  }
});

const loadEtfs = () => {
  etfsLoaded.value = false;
  etfsSelectValues.value = new Array<SelectBoxValue>();

  CrudEtfControllerHandler.fetchAllEtf()
    .then((response) => {
      etfs.value = response;
      for (let etf of response) {
        etfsSelectValues.value.push({ id: etf.id, value: etf.name });
      }
      etfsLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};
const loadYear = (etfId: number, year?: number) => {
  console.log("load Year" + etfId + "-" + year);
  serverErrors.value = new Array<string>();

  CrudEtfPreliminaryLumpSumControllerHandler.fetchEtfPreliminaryLumpSumYears(
    etfId,
  )
    .then((response) => {
      years.value = response;

      selectedEtf.value = etfId;
      if (year === undefined) {
        selectedYear.value = response.slice(-1)[0];
      } else {
        selectedYear.value = year;
      }

      dataLoaded.value = true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

const showCreateEtfPreliminaryLumpSumModal = (
  etfId?: number,
  year?: number,
) => {
  (createModal.value as typeof CreateEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    etfId,
    year,
  );
};

const showDeleteEtfPreliminaryLumpSumModal = () => {
  (deleteModal.value as typeof DeleteEtfPreliminaryLumpSumModalVue)._show(
    etfs.value,
    selectedEtf.value,
    selectedYear.value,
  );
};

watch(selectedEtf, (newVal, oldVal) => {
  if (newVal != oldVal) {
    loadYear(newVal);
  }
});

const reloadView = () => {};
</script>
