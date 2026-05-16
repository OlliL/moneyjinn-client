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

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.capitalsources") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :placeholder="$t('Capitalsource.searchBy')"
      @validNowToggled="validNowToggled"
      @createClicked="showCreateCapitalsourceModal"
    />

    <DivContentTable>
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("Capitalsource.type")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("Capitalsource.state")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.iban")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.bic")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.validFrom")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.validTil")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("Capitalsource.groupUse")
          }}</TableHead>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("Capitalsource.importAllowed")
          }}</TableHead>
          <TableHead class="border" colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListCapitalsourceRowVue
          v-for="mcs in capitalsources"
          :key="mcs.id"
          :mcs="mcs"
          :owner="mcs.userId === userId"
          @delete-capitalsource="deleteCapitalsource"
          @edit-capitalsource="editCapitalsource"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
