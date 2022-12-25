<template>
  <CreateGroupModalVue
    ref="createGroupModalList"
    id-suffix="List"
    @group-created="groupCreated"
    @group-updated="groupUpdated"
  />
  <DeleteGroupModalVue
    ref="deleteGroupModalList"
    id-suffix="List"
    @group-deleted="groupDeleted"
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
              <nav aria-label="Start letter navigation" v-if="dataLoaded">
                <ul class="pagination month-selection">
                  <li class="page-item">
                    <a
                      :class="
                        $props.letter === '' ? 'page-link active' : 'page-link'
                      "
                      href="#"
                      @click="selectLetter('')"
                      >Alle</a
                    >
                  </li>
                  <li class="page-item" v-for="letter in letters" :key="letter">
                    <a
                      :class="
                        $props.letter === letter
                          ? 'page-link active'
                          : 'page-link'
                      "
                      href="#"
                      @click="selectLetter(letter)"
                      >{{ letter }}</a
                    >
                  </li>
                </ul>
              </nav>
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
            <ListGroupRowVue
              v-for="group in groups"
              :key="group.id"
              :group="group"
              @edit-group="editGroup"
              @delete-group="deleteGroup"
            />
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router, { Routes } from "@/router";
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
      dataLoaded: false,
      letters: {} as Array<string>,
      groups: {} as Array<Group>,
      allGroups: {} as Array<Group>,
    };
  },
  props: {
    letter: {
      type: String,
      default: "",
    },
  },
  async mounted() {
    this.reloadView();
  },
  computed: {},
  methods: {
    async reloadView() {
      this.allGroups = await GroupControllerHandler.fetchAllGroup();

      this.allGroups.sort((a, b) => {
        return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
      });

      const letters = this.allGroups.map((entry) =>
        entry.name.substring(0, 1).toUpperCase()
      );
      const uniqueLetters = letters
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      this.letters = uniqueLetters;

      this.loadData(this.$props.letter);
    },
    async loadData(letter: string) {
      this.dataLoaded = false;
      if (letter === "") {
        this.groups = this.allGroups;
      } else {
        this.groups = this.allGroups.filter(
          (entry) => entry.name.substring(0, 1).toUpperCase() === letter
        );
      }

      this.dataLoaded = true;
    },
    selectLetter(letter: string) {
      router.push({
        name: Routes.ListGroups,
        params: { letter: letter },
      });
      this.loadData(letter);
    },
    showCreateGroupModal() {
      (this.$refs.createGroupModalList as typeof CreateGroupModalVue)._show();
    },
    groupCreated() {
      this.reloadView();
    },
    editGroup(group: Group) {
      (this.$refs.createGroupModalList as typeof CreateGroupModalVue)._show(
        group
      );
    },
    groupUpdated() {
      this.reloadView();
    },
    deleteGroup(group: Group) {
      (this.$refs.deleteGroupModalList as typeof DeleteGroupModalVue)._show(
        group
      );
    },
    groupDeleted() {
      this.reloadView();
    },
  },
  components: {
    ListGroupRowVue,
    CreateGroupModalVue,
    DeleteGroupModalVue,
  },
});
</script>
