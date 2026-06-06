<template>
  <CreateGroupModal />
  <DeleteGroupModal />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.groups") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('Group.searchBy')"
      @createClicked="actions.create"
    />

    <DivError :server-errors="serverErrors" />

    <ListGroupsMobile :groups="groups" />

    <ListGroupsDesktop :groups="groups" />
  </div>
</template>

<script lang="ts" setup>
import DivError from "@/components/common/DivError.vue";
import DivFilter from "@/components/common/DivFilter.vue";
import { GroupActionsKey, type CrudActions } from "@/model/CrudActions";
import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { onMounted, provide, ref, watch } from "vue";
import useCreateGroupModalStore from "./elements/CreateGroupModal.store";
import CreateGroupModal from "./elements/CreateGroupModal.vue";
import useDeleteGroupModalStore from "./elements/DeleteGroupModal.store";
import DeleteGroupModal from "./elements/DeleteGroupModal.vue";
import ListGroupsDesktop from "./elements/ListGroupsDesktop.vue";
import ListGroupsMobile from "./elements/ListGroupsMobile.vue";

const serverErrors = ref(new Array<string>());

const groups = ref(new Array<Group>());
const allGroups = ref(new Array<Group>());
const searchString = ref("");
const { openCreateGroup, openEditGroup } = useCreateGroupModalStore();
const { openDeleteGroup } = useDeleteGroupModalStore();

const actions: CrudActions<Group> = {
  create: () => openCreateGroup(reloadView),
  edit: (groupEntry) => openEditGroup(groupEntry, reloadView),
  delete: (groupEntry) => openDeleteGroup(groupEntry, reloadView),
};

provide(GroupActionsKey, actions);

watch(searchString, () => searchContent());

const searchContent = () => {
  if (searchString.value === "") {
    groups.value = allGroups.value;
    return;
  }

  const commentUpper = searchString.value.toUpperCase();
  groups.value = allGroups.value.filter((entry) =>
    entry.name.toUpperCase().includes(commentUpper),
  );
};

const reloadView = () => {
  serverErrors.value = new Array<string>();

  GroupService.fetchAllGroup()
    .then((_groups) => {
      _groups.sort((a, b) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
      );
      allGroups.value = _groups;
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
