<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createGroup" :id="'createGroupForm' + idSuffix">
        <div class="container-fluid">
          <div v-if="serverError">
            <div
              class="alert alert-danger"
              v-for="(error, index) in serverError"
              :key="index"
            >
              {{ error }}
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <div class="form-floating">
                <input
                  v-model="group.name"
                  :id="'groupName' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'groupName' + idSuffix">Name</label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :form="'createGroupForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { Group } from "@/model/group/Group";
import GroupControllerHandler from "@/handler/GroupControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import type { ValidationResult } from "@/model/validation/ValidationResult";

type CreateGroupModalData = {
  group: Group;
  origGroup: Group | undefined;
  serverError: Array<String>;
  nameIsValid: boolean | null;
  nameErrorMessage: string;
};
export default defineComponent({
  name: "CreateGroupModal",
  data(): CreateGroupModalData {
    return {
      group: {} as Group,
      origGroup: undefined,
      serverError: {} as Array<String>,
      nameIsValid: null,
      nameErrorMessage: "",
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
  },
  computed: {
    formIsValid(): boolean {
      const isValid = this.nameIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    title(): string {
      return this.origGroup === undefined
        ? "Benutzergruppe hinzufügen"
        : "Benutzergruppe bearbeiten";
    },
    nameErrorData(): ErrorData {
      return generateErrorData(
        this.nameIsValid,
        "Kommentar",
        this.nameErrorMessage
      );
    },
  },
  methods: {
    async _show(group?: Group) {
      this.origGroup = group ? group : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      if (this.origGroup) {
        this.group = JSON.parse(JSON.stringify(this.origGroup));
      } else {
        this.group = {} as Group;
        this.group.name = "";
      }
      this.nameIsValid = null;
      this.serverError = {} as Array<String>;
    },
    validateName() {
      [this.nameIsValid, this.nameErrorMessage] = validateInputField(
        this.group.name,
        "Kommentar angeben!"
      );
    },
    handleServerError(validationResult: ValidationResult): boolean {
      if (!validationResult.result) {
        this.serverError = new Array<string>();
        for (let resultItem of validationResult.validationResultItems) {
          this.serverError.push(getError(resultItem.error));
        }
      }
      return !validationResult.result;
    },
    async createGroup() {
      this.validateName();

      if (this.formIsValid) {
        if (this.group.id > 0) {
          //update
          const validationResult = await GroupControllerHandler.updateGroup(
            this.group
          );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("groupUpdated", this.group);
          }
        } else {
          //create
          const groupValidation = GroupControllerHandler.createGroup(
            this.group
          );
          const validationResult = await (
            await groupValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.group = (await groupValidation).group;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("groupCreated", this.group);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["groupCreated", "groupUpdated"],
  components: {
    ModalVue,
  },
});
</script>
