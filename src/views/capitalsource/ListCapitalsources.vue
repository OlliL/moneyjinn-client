<template>
  <DeleteCapitalsourceModal />

  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.capitalsources") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :placeholder="$t('Capitalsource.searchBy')"
      @validNowToggled="validNowToggled"
      @createClicked="actions.create"
    />

    <ListCapitalsourcesMobile
      :capitalsources="capitalsources"
      :user-id="userId"
    />

    <ListCapitalsourcesDesktop
      :capitalsources="capitalsources"
      :user-id="userId"
    />
  </div>
</template>

<script lang="ts" setup>
import { useCreateCapitalsourceModalStore } from "@/components/capitalsource/CreateCapitalsourceModal.store";
import DivFilter from "@/components/common/DivFilter.vue";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { CapitalsourceActionsKey, type CrudActions } from "@/model/CrudActions";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { onMounted, provide, ref, watch } from "vue";
import { useDeleteCapitalsourceModalStore } from "./elements/DeleteCapitalsourceModal.store";
import DeleteCapitalsourceModal from "./elements/DeleteCapitalsourceModal.vue";
import ListCapitalsourcesDesktop from "./elements/ListCapitalsourcesDesktop.vue";
import ListCapitalsourcesMobile from "./elements/ListCapitalsourcesMobile.vue";

const validNow = ref(true);
const capitalsources = ref(new Array<Capitalsource>());
const searchString = ref("");

const userId = useUserSessionStore().getUserId;

const capitalsourceStore = useCapitalsourceStore();
const searchCapitalsources = capitalsourceStore.searchCapitalsources;
const { openDelete: openDeleteCapitalsource } =
  useDeleteCapitalsourceModalStore();
const { openCreate: openCreateCapitalsource, openEdit: openEditCapitalsource } =
  useCreateCapitalsourceModalStore();

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
    (capitalsourceEntries) => {
      capitalsources.value = capitalsourceEntries;
    },
  );
};

const actions: CrudActions<Capitalsource> = {
  create: () => {
    openCreateCapitalsource(searchContent);
  },
  edit: (capitalsourceEntry) => {
    openEditCapitalsource(capitalsourceEntry, searchContent);
  },
  delete: (capitalsourceEntry) =>
    openDeleteCapitalsource(capitalsourceEntry, searchContent),
};

provide(CapitalsourceActionsKey, actions);

onMounted(() => {
  searchAllContent();
});
</script>
