<template>
  <CreateGroupModalVue
    ref="createGroupModalList"
    id-suffix="List"
    @group-created="reloadView"
    @group-updated="reloadView"
  />
  <DeleteGroupModalVue
    ref="deleteModal"
    id-suffix="List"
    @group-deleted="reloadView"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.groups") }}</h4>
    </div>

    <DivFilter
      v-model="searchString"
      :showValidToggle="false"
      :placeholder="$t('Group.searchBy')"
      @createClicked="showCreateGroupModal"
    />

    <DivError :server-errors="serverErrors" />

    <ListGroupsMobile
      :groups="groups"
      @edit-group="editGroup"
      @delete-group="deleteGroup"
    />

    <ListGroupsDesktop
      :groups="groups"
      @edit-group="editGroup"
      @delete-group="deleteGroup"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import DivError from "@/components/common/DivError.vue";
import DivFilter from "@/components/common/DivFilter.vue";
import CreateGroupModalVue from "./elements/CreateGroupModal.vue";
import DeleteGroupModalVue from "./elements/DeleteGroupModal.vue";
import ListGroupsDesktop from "./elements/ListGroupsDesktop.vue";
import ListGroupsMobile from "./elements/ListGroupsMobile.vue";

import type { Group } from "@/model/group/Group";

import GroupService from "@/service/GroupService";

const serverErrors = ref(new Array<string>());

const groups = ref(new Array<Group>());
const allGroups = ref(new Array<Group>());
const searchString = ref("");

const createGroupModalList = useTemplateRef<typeof CreateGroupModalVue>(
  "createGroupModalList",
);
const deleteModal = useTemplateRef<typeof DeleteGroupModalVue>("deleteModal");

const showCreateGroupModal = () => {
  createGroupModalList.value?._show();
};

const deleteGroup = (mcs: Group) => {
  deleteModal.value?._show(mcs);
};

const editGroup = (mcs: Group) => {
  createGroupModalList.value?._show(mcs);
};

watch(searchString, () => {
  searchContent();
});

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
      _groups.sort((a, b) => {
        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });
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
