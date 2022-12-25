<template>
  <ModalVue title="Benutzergruppe l&ouml;schen" ref="modalComponent">
    <template #body>
      <div v-if="serverError">
        <div
          class="alert alert-danger"
          v-for="(error, index) in serverError"
          :key="index"
        >
          {{ error }}
        </div>
      </div>
      <div class="row">
        <div
          class="text-start d-flex align-items-center col-sm-3 col-xs-5"
          style="font-weight: 700; font-size: 10.5px"
        >
          Name
        </div>
        <div class="text-start col-sm-9">{{ group.name }}</div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="deleteGroup">
        L&ouml;schen
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import GroupControllerHandler from "@/handler/GroupControllerHandler";
import type { Group } from "@/model/group/Group";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { getError } from "@/tools/views/ThrowError";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";

export default defineComponent({
  name: "DeleteGroupModal",
  data() {
    return {
      group: {} as Group,
      serverError: new Array<string>(),
    };
  },
  computed: {},
  methods: {
    async _show(group: Group) {
      this.group = group;
      this.serverError = new Array<string>();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    followUpServerCall(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
        return false;
      }
      return true;
    },
    async deleteGroup() {
      const validationResult = await GroupControllerHandler.deleteGroup(
        this.group.id
      );
      if (this.followUpServerCall(validationResult)) {
        (this.$refs.modalComponent as typeof ModalVue)._hide();
        this.$emit("groupDeleted", this.group);
      }
    },
  },
  expose: ["_show"],
  emits: ["groupDeleted"],
  components: { ModalVue },
});
</script>
