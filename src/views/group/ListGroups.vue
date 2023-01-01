<template>
  <CreateGroupModalVue
    ref="createGroupModalList"
    id-suffix="List"
    @group-created="reloadView"
    @group-updated="reloadView"
  />
  <DeleteGroupModalVue
    ref="deleteGroupModalList"
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

<script lang="ts">
import { defineComponent } from "vue";
import type { Group } from "@/model/group/Group";
import GroupControllerHandler from "@/handler/GroupControllerHandler";
import ListGroupRowVue from "@/components/group/ListGroupRow.vue";
import CreateGroupModalVue from "@/components/group/CreateGroupModal.vue";
import DeleteGroupModalVue from "@/components/group/DeleteGroupModal.vue";

export default defineComponent({
  name: "ListGroups",
  data() {
    return {
      groups: {} as Array<Group>,
      allGroups: {} as Array<Group>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchString = "";
    this.reloadView();
  },
  computed: {},
  methods: {
    async reloadView() {
      this.allGroups = await GroupControllerHandler.fetchAllGroup();

      this.allGroups.sort((a, b) => {
        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });

      this.searchContent();
    },
    showCreateGroupModal() {
      (this.$refs.createGroupModalList as typeof CreateGroupModalVue)._show();
    },
    editGroup(group: Group) {
      (this.$refs.createGroupModalList as typeof CreateGroupModalVue)._show(
        group
      );
    },
    deleteGroup(group: Group) {
      (this.$refs.deleteGroupModalList as typeof DeleteGroupModalVue)._show(
        group
      );
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    searchContent() {
      let groups = this.allGroups;
      if (this.searchString === "") {
        this.groups = groups;
      }

      const commentUpper = this.searchString.toUpperCase();
      this.groups = groups.filter((entry) =>
        entry.name.toUpperCase().includes(commentUpper)
      );
    },
  },
  components: {
    ListGroupRowVue,
    CreateGroupModalVue,
    DeleteGroupModalVue,
  },
});
</script>
