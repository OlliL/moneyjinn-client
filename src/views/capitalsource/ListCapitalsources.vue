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
        <h4>Kapitalquellen</h4>
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
                @click="showCreateCapitalsourceModal"
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
                  placeholder="Suchen nach Kommentar..."
                  v-model="searchString"
                  @input="searchContent"
                />
                <div class="form-check form-switch align-self-center ms-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="capitalsourcesValid"
                    v-model="validNow"
                    @change="searchContent"
                  />
                  <label class="form-check-label" for="capitalsourcesValid"
                    >Jetzt g&uuml;ltig</label
                  >
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-9 col-xs-12">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Kommentar</th>
              <th>Typ</th>
              <th>Status</th>
              <th>IBAN</th>
              <th>BIC</th>
              <th>g&uuml;ltig ab</th>
              <th>g&uuml;ltig bis</th>
              <th>Gruppe</th>
              <th>Datenimport</th>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <ListCapitalsourceRowVue
              v-for="mcs in capitalsources"
              :key="mcs.id"
              :mcs="mcs"
              :owner="mcs.userId === getUserId"
              @delete-capitalsource="deleteCapitalsource"
              @edit-capitalsource="editCapitalsource"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CreateCapitalsourceModalVue from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import ListCapitalsourceRowVue from "@/components/capitalsource/ListCapitalsourceRow.vue";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import DeleteCapitalsourceModalVue from "@/components/capitalsource/DeleteCapitalsourceModal.vue";
export default defineComponent({
  name: "ListCapitalsources",
  data() {
    return {
      validNow: true,
      capitalsources: {} as Array<Capitalsource>,
      searchString: "",
    };
  },
  async mounted() {
    this.searchAllContent();
  },
  computed: {
    ...mapState(useUserSessionStore, ["getUserId"]),
  },
  methods: {
    ...mapActions(useCapitalsourceStore, ["searchCapitalsources"]),
    showCreateCapitalsourceModal() {
      (
        this.$refs
          .createCapitalsourceModalList as typeof CreateCapitalsourceModalVue
      )._show();
    },
    deleteCapitalsource(mcs: Capitalsource) {
      (this.$refs.deleteModal as typeof DeleteCapitalsourceModalVue)._show(mcs);
    },
    editCapitalsource(mcs: Capitalsource) {
      (
        this.$refs
          .createCapitalsourceModalList as typeof CreateCapitalsourceModalVue
      )._show(mcs);
    },
    searchAllContent() {
      this.searchString = "";
      this.searchContent();
    },
    async searchContent() {
      this.capitalsources = await this.searchCapitalsources(
        this.searchString,
        this.validNow
      );
    },
  },
  components: {
    CreateCapitalsourceModalVue,
    ListCapitalsourceRowVue,
    DeleteCapitalsourceModalVue,
  },
});
</script>
