<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createUser" :id="'createUserForm' + idSuffix">
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
                  v-model="user.userName"
                  :id="'userName' + idSuffix"
                  type="text"
                  class="form-control"
                />
                <label :for="'userName' + idSuffix">Name</label>
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
        :form="'createUserForm' + idSuffix"
      >
        Speichern
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts">
import type { User } from "@/model/user/User";
import UserControllerHandler from "@/handler/UserControllerHandler";
import { generateErrorData, type ErrorData } from "@/tools/views/ErrorData";
import { getError } from "@/tools/views/ThrowError";
import { validateInputField } from "@/tools/views/ValidateInputField";
import { defineComponent } from "vue";
import ModalVue from "../Modal.vue";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { AccessRelation } from "@/model/user/AccessRelation";

type CreateUserModalData = {
  user: User;
  origUser: User | undefined;
  serverError: Array<String>;
  nameIsValid: boolean | null;
  nameErrorMessage: string;
};
export default defineComponent({
  name: "CreateUserModal",
  data(): CreateUserModalData {
    return {
      user: {} as User,
      origUser: undefined,
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
      return this.origUser === undefined
        ? "Benutzerkonto hinzufügen"
        : "Benutzerkonto bearbeiten";
    },
    nameErrorData(): ErrorData {
      return generateErrorData(this.nameIsValid, "Name", this.nameErrorMessage);
    },
  },
  methods: {
    async _show(user?: User) {
      this.origUser = user ? user : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    resetForm() {
      if (this.origUser) {
        this.user = JSON.parse(JSON.stringify(this.origUser));
      } else {
        this.user = {} as User;
        this.user.userName = "";
      }
      this.nameIsValid = null;
      this.serverError = {} as Array<String>;
    },
    validateName() {
      [this.nameIsValid, this.nameErrorMessage] = validateInputField(
        this.user.userName,
        "Name angeben!"
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
    async createUser() {
      this.validateName();

      if (this.formIsValid) {
        if (this.user.id > 0) {
          //update
          //FIXME AccessRelation
          const validationResult = await UserControllerHandler.updateUser(
            this.user,
            {} as AccessRelation
          );
          if (!this.handleServerError(validationResult)) {
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("userUpdated", this.user);
          }
        } else {
          //create
          //FIXME AccessRelation
          const userValidation = UserControllerHandler.createUser(
            this.user,
            {} as AccessRelation
          );
          const validationResult = await (
            await userValidation
          ).validationResult;

          if (!this.handleServerError(validationResult)) {
            this.user = (await userValidation).user;
            (this.$refs.modalComponent as typeof ModalVue)._hide();
            this.$emit("userCreated", this.user);
          }
        }
      }
    },
  },
  expose: ["_show"],
  emits: ["userCreated", "userUpdated"],
  components: {
    ModalVue,
  },
});
</script>
