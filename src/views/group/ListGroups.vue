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

  <div class="container-fluid text-center">
    <div class="row justify-content-md-center">
      <div class="col-xs-12 mb-4">
        <h4>{{ $t("General.groups") }}</h4>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-md-auto mb-3">
        <div class="row">
          <div class="col-md-auto mb-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateGroupModal"
            >
              {{ $t("General.new") }}
            </button>
          </div>
          <div class="col">
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
                :placeholder="$t('Group.searchBy')"
                v-model="searchString"
                @input="searchContent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <DivError :server-errors="serverErrors" />
    <div class="row justify-content-md-center">
      <div class="col-md-2 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>{{ $t("General.name") }}</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListGroupRowVue
              v-for="group in groups"
              :key="group.id"
              :group="group"
              @edit-group="editGroup"
              @delete-group="deleteGroup"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from "vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";

import CreateGroupModalVue from "@/components/group/CreateGroupModal.vue";
import DeleteGroupModalVue from "@/components/group/DeleteGroupModal.vue";
import DivError from "@/components/DivError.vue";
import ListGroupRowVue from "@/components/group/ListGroupRow.vue";

import type { Group } from "@/model/group/Group";

import GroupService from "@/service/GroupService";

const serverErrors = ref(new Array<string>());

const groups = ref(new Array<Group>());
const allGroups = ref(new Array<Group>());
const searchString = ref("");

const createGroupModalList = useTemplateRef<typeof CreateGroupModalVue>("createGroupModalList");
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

const searchAllContent = () => {
  searchString.value = "";
  searchContent();
};

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
