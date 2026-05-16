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

    <DivContentTable class="max-w-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="font-bold border text-foreground text-center">{{
            $t("General.name")
          }}</TableHead>
          <TableHead class="border" colspan="2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ListGroupRowVue
          v-for="group in groups"
          :key="group.id"
          :group="group"
          @edit-group="editGroup"
          @delete-group="deleteGroup"
        />
      </TableBody>
    </DivContentTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, useTemplateRef } from "vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import DivContentTable from "@/components/DivContentTable.vue";
import DivError from "@/components/DivError.vue";
import DivFilter from "@/components/DivFilter.vue";
import CreateGroupModalVue from "@/components/group/CreateGroupModal.vue";
import DeleteGroupModalVue from "@/components/group/DeleteGroupModal.vue";
import ListGroupRowVue from "@/components/group/ListGroupRow.vue";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
