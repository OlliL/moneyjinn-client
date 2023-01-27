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
        <h4>Benutzergruppen</h4>
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
                @click="showCreateGroupModal"
              >
                Neu
              </button>
            </td>
            <td>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="searchAllContent"
                >
                  Alle
                </button>
                <input
                  class="form-control"
                  type="text"
                  placeholder="Suchen nach Name..."
                  v-model="searchString"
                  @input="searchContent"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-3 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
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
import { onMounted, ref } from "vue";

import CreateGroupModalVue from "@/components/group/CreateGroupModal.vue";
import DeleteGroupModalVue from "@/components/group/DeleteGroupModal.vue";
import ListGroupRowVue from "@/components/group/ListGroupRow.vue";

import type { Group } from "@/model/group/Group";

import GroupControllerHandler from "@/handler/GroupControllerHandler";

const groups = ref(new Array<Group>());
const allGroups = ref(new Array<Group>());
const searchString = ref("");

const createGroupModalList = ref();
const deleteModal = ref();

const showCreateGroupModal = () => {
  createGroupModalList.value._show();
};

const deleteGroup = (mcs: Group) => {
  deleteModal.value._show(mcs);
};

const editGroup = (mcs: Group) => {
  createGroupModalList.value._show(mcs);
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
    entry.name.toUpperCase().includes(commentUpper)
  );
};

const reloadView = () => {
  GroupControllerHandler.fetchAllGroup().then((_groups) => {
    _groups.sort((a, b) => {
      return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
    });
    allGroups.value = _groups;
    searchContent();
  });
};

onMounted(() => {
  searchString.value = "";
  reloadView();
});
</script>
