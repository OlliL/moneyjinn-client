<template>
  <CreateEtfModalVue
    ref="createEtfModalList"
    id-suffix="List"
    @etf-created="reloadView"
    @etf-updated="reloadView"
  />
  <DeleteEtfModalVue
    ref="deleteModal"
    id-suffix="List"
    @etf-deleted="reloadView"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.etfs") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-xxl-9 col-xs-12">
        <table style="margin: 0 auto">
          <tr>
            <td class="text-right pe-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreateEtfModal"
              >
                {{ $t("General.new") }}
              </button>
            </td>
            <td>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="searchAllContent"
                >
                  {{ $t("General.all") }}
                </button>
                <input
                  class="form-control"
                  type="text"
                  :placeholder="$t('ETF.searchBy')"
                  v-model="searchString"
                  @input="searchContent"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <DivError :server-errors="serverErrors" />
    <div class="row justify-content-md-center">
      <div class="col-xxl-7 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <col style="width: 40%" />
          <col style="width: 15%" />
          <col style="width: 10%" />
          <col style="width: 10%" />
          <col style="width: 5%" />
          <col style="width: 10%" />
          <col style="width: 10%" />
          <thead>
            <tr>
              <th>{{ $t("General.name") }}</th>
              <th>{{ $t("ETF.isin") }}</th>
              <th>{{ $t("ETF.wkn") }}</th>
              <th>{{ $t("ETF.ticker") }}</th>
              <th><i class="bi bi-star-fill text-warning"></i></th>
              <th colspan="2"></th>
            </tr>
          </thead>

          <tbody>
            <ListEtfRowVue
              v-for="met in etfs"
              :key="met.id"
              :etf="met"
              @edit-etf="editEtf"
              @delete-etf="deleteEtf"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import CreateEtfModalVue from "@/components/etf/CreateEtfModal.vue";
import DeleteEtfModalVue from "@/components/etf/DeleteEtfModal.vue";
import ListEtfRowVue from "@/components/etf/ListEtfRow.vue";

import type { Etf } from "@/model/etf/Etf";

import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const etfs = ref(new Array<Etf>());
const allEtfs = ref(new Array<Etf>());
const searchString = ref("");

const createEtfModalList = ref();
const deleteModal = ref();

const showCreateEtfModal = () => {
  createEtfModalList.value._show();
};

const deleteEtf = (mcs: Etf) => {
  deleteModal.value._show(mcs);
};

const editEtf = (mcs: Etf) => {
  createEtfModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  if (searchString.value === "") {
    etfs.value = allEtfs.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  etfs.value = allEtfs.value.filter((entry) =>
    entry.name ? entry.name.toUpperCase().includes(commentUpper) : true,
  );
};

const reloadView = () => {
  serverErrors.value = new Array<string>();

  CrudEtfControllerHandler.fetchAllEtf()
    .then((_etfs) => {
      _etfs.sort((a, b) => {
        if (!a.name && !b.name) return 0;
        else if (!a.name) return -1;
        else if (!b.name) return 1;

        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });
      allEtfs.value = _etfs;
      searchContent();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>