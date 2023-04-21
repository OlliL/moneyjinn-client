<template>
  <CreatePreDefMoneyflowModalVue
    ref="createPreDefMoneyflowModalList"
    id-suffix="List"
    @pre-def-moneyflow-created="reloadView"
    @pre-def-moneyflow-updated="reloadView"
  />
  <DeletePreDefMoneyflowModalVue
    ref="deleteModal"
    id-suffix="List"
    @pre-def-moneyflow-deleted="reloadView"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.preDefMoneyflows") }}</h4>
      </div>
    </div>
    <div class="row justify-content-md-center mb-4">
      <div class="col-md-9 col-xs-12">
        <table style="margin: 0 auto">
          <tr>
            <td class="text-right pe-2">
              <button
                type="button"
                class="btn btn-primary"
                @click="showCreatePreDefMoneyflowModal"
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
                  :placeholder="$t('PreDefMoneyflow.searchBy')"
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
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t("General.amount") }}</th>
              <th>{{ $t("General.contractpartner") }}</th>
              <th>{{ $t("General.comment") }}</th>
              <th>{{ $t("General.postingAccount") }}</th>
              <th>{{ $t("General.capitalsource") }}</th>
              <th>{{ $t("PreDefMoneyflow.onceAMonthShort") }}</th>
              <th>{{ $t("PreDefMoneyflow.createDate") }}</th>
              <th>{{ $t("PreDefMoneyflow.lastUsed") }}</th>
              <th colspan="2"></th>
            </tr>
          </thead>

          <tbody>
            <ListPreDefMoneyflowRowVue
              v-for="mpm in preDefMoneyflows"
              :key="mpm.id"
              :mpm="mpm"
              @edit-pre-def-moneyflow="editPreDefMoneyflow"
              @delete-pre-def-moneyflow="deletePreDefMoneyflow"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

import CreatePreDefMoneyflowModalVue from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import DeletePreDefMoneyflowModalVue from "@/components/predefmoneyflow/DeletePreDefMoneyflowModal.vue";
import ListPreDefMoneyflowRowVue from "@/components/predefmoneyflow/ListPreDefMoneyflowRow.vue";

import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import PreDefMoneyflowControllerHandler from "@/handler/PreDefMoneyflowControllerHandler";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import DivError from "@/components/DivError.vue";

const serverErrors = ref(new Array<string>());

const preDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const allPreDefMoneyflows = ref(new Array<PreDefMoneyflow>());
const searchString = ref("");

const createPreDefMoneyflowModalList = ref();
const deleteModal = ref();

const showCreatePreDefMoneyflowModal = () => {
  createPreDefMoneyflowModalList.value._show();
};

const deletePreDefMoneyflow = (mcs: PreDefMoneyflow) => {
  deleteModal.value._show(mcs);
};

const editPreDefMoneyflow = (mcs: PreDefMoneyflow) => {
  createPreDefMoneyflowModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  if (searchString.value === "") {
    preDefMoneyflows.value = allPreDefMoneyflows.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  preDefMoneyflows.value = allPreDefMoneyflows.value.filter((entry) =>
    entry.contractpartnerName
      ? entry.contractpartnerName.toUpperCase().includes(commentUpper)
      : true
  );
};

const reloadView = () => {
  serverErrors.value = new Array<string>();

  PreDefMoneyflowControllerHandler.fetchAllPreDefMoneyflow()
    .then((_preDefMoneyflows) => {
      _preDefMoneyflows.sort((a, b) => {
        if (!a.contractpartnerName && !b.contractpartnerName) return 0;
        else if (!a.contractpartnerName) return -1;
        else if (!b.contractpartnerName) return 1;

        return a.contractpartnerName
          .toUpperCase()
          .localeCompare(b.contractpartnerName.toUpperCase());
      });
      allPreDefMoneyflows.value = _preDefMoneyflows;
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
