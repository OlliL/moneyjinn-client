<template>
  <CreateCapitalsourceModalVue
    ref="createCapitalsourceModalList"
    id-suffix="List"
    @capitalsource-created="searchContent"
    @capitalsource-updated="searchContent"
  />
  <DeleteCapitalsourceModalVue
    ref="deleteModal"
    @capitalsource-deleted="searchContent"
  />

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.capitalsources") }}</h4>
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
                @click="showCreateCapitalsourceModal"
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
                  :placeholder="$t('Capitalsource.searchBy')"
                  v-model="searchString"
                  @input="searchContent"
                />
                <div class="form-check form-switch align-self-center ms-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="capitalsourcesValid"
                    v-model="validNow"
                    @change="searchContent"
                  />
                  <label class="form-check-label" for="capitalsourcesValid">{{
                    $t("General.validNow")
                  }}</label>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t("Capitalsource.name") }}</th>
              <th>{{ $t("Capitalsource.type") }}</th>
              <th>{{ $t("Capitalsource.state") }}</th>
              <th>{{ $t("General.iban") }}</th>
              <th>{{ $t("General.bic") }}</th>
              <th>{{ $t("General.validFrom") }}</th>
              <th>{{ $t("General.validTil") }}</th>
              <th>{{ $t("Capitalsource.groupUse") }}</th>
              <th>{{ $t("Capitalsource.importAllowed") }}</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListCapitalsourceRowVue
              v-for="mcs in capitalsources"
              :key="mcs.id"
              :mcs="mcs"
              :owner="mcs.userId === userId"
              @delete-capitalsource="deleteCapitalsource"
              @edit-capitalsource="editCapitalsource"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";

import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import DeleteCapitalsourceModalVue from "@/components/capitalsource/DeleteCapitalsourceModal.vue";
import ListCapitalsourceRowVue from "@/components/capitalsource/ListCapitalsourceRow.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { storeToRefs } from "pinia";

const validNow = ref(true);
const capitalsources = ref(new Array<Capitalsource>());
const searchString = ref("");

const createCapitalsourceModalList = ref();
const deleteModal = ref();

const userId = useUserSessionStore().getUserId;

const capitalsourceStore = useCapitalsourceStore();
const searchCapitalsources = capitalsourceStore.searchCapitalsources;
const { capitalsource } = storeToRefs(capitalsourceStore);

watch(capitalsource, () => {
  searchAllContent();
});

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModalList.value._show();
};

const deleteCapitalsource = (mcs: Capitalsource) => {
  deleteModal.value._show(mcs);
};

const editCapitalsource = (mcs: Capitalsource) => {
  createCapitalsourceModalList.value._show(mcs);
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchCapitalsources(searchString.value, validNow.value).then(
    (_capitalsources) => {
      capitalsources.value = _capitalsources;
    }
  );
};

onMounted(() => {
  searchAllContent();
});
</script>
