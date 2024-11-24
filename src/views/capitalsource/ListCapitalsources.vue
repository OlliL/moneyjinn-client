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

    <DivFilter
      v-model="searchString"
      :placeholder="$t('Capitalsource.searchBy')"
      @validNowToggled="validNowToggled"
      @createClicked="showCreateCapitalsourceModal"
    />

    <DivContentTable>
      <thead>
        <tr>
          <th>{{ $t("General.name") }}</th>
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
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";

import DivContentTable from "@/components/DivContentTable.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import DeleteCapitalsourceModalVue from "@/components/capitalsource/DeleteCapitalsourceModal.vue";
import ListCapitalsourceRowVue from "@/components/capitalsource/ListCapitalsourceRow.vue";

import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { storeToRefs } from "pinia";

const validNow = ref(true);
const capitalsources = ref(new Array<Capitalsource>());
const searchString = ref("");

const createCapitalsourceModalList = useTemplateRef<
  typeof CreateCapitalsourceModalVue
>("createCapitalsourceModalList");
const deleteModal =
  useTemplateRef<typeof DeleteCapitalsourceModalVue>("deleteModal");

const userId = useUserSessionStore().getUserId;

const capitalsourceStore = useCapitalsourceStore();
const searchCapitalsources = capitalsourceStore.searchCapitalsources;
const { capitalsource } = storeToRefs(capitalsourceStore);

const showCreateCapitalsourceModal = () => {
  createCapitalsourceModalList.value?._show();
};

const deleteCapitalsource = (mcs: Capitalsource) => {
  deleteModal.value?._show(mcs);
};

const editCapitalsource = (mcs: Capitalsource) => {
  createCapitalsourceModalList.value?._show(mcs);
};

watch(capitalsource, () => {
  searchContent();
  if (capitalsource.value.length == 0) searchAllContent();
});

watch(searchString, () => {
  searchContent();
});

const validNowToggled = (myValidNow: boolean) => {
  validNow.value = myValidNow;
  searchContent();
};

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

const searchContent = () => {
  searchCapitalsources(searchString.value, validNow.value).then(
    (_capitalsources) => {
      capitalsources.value = _capitalsources;
    },
  );
};

onMounted(() => {
  searchAllContent();
});
</script>
