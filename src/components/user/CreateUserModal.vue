<template>
  <ModalVue :title="title" :max-width="maxWidth" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createUser" :id="'createUserForm' + idSuffix">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
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
                      id="userName"
                      type="text"
                      @input="validateName"
                      :class="'form-control ' + nameErrorData.inputClass"
                    />
                    <label
                      for="userName"
                      :style="'color: ' + nameErrorData.fieldColor"
                      >{{ nameErrorData.fieldLabel }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <input
                      v-model="password1"
                      id="password1"
                      type="password"
                      @input="validatePassword1"
                      :class="'form-control ' + password1ErrorData.inputClass"
                    />
                    <label
                      :for="password1"
                      :style="'color: ' + password1ErrorData.fieldColor"
                      >{{ password1ErrorData.fieldLabel }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <input
                      v-model="password2"
                      id="password2"
                      type="password"
                      @input="validatePassword2"
                      :class="'form-control ' + password2ErrorData.inputClass"
                    />
                    <label
                      :for="password2"
                      :style="'color: ' + password2ErrorData.fieldColor"
                      >{{ password2ErrorData.fieldLabel }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <select
                      v-model="user.userCanLogin"
                      id="userCanLogin"
                      class="form-select form-control"
                    >
                      <option :value="false">Nein</option>
                      <option :value="true">Ja</option>
                    </select>

                    <label for="groupUse">Anmeldung erlaubt</label>
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <select
                      v-model="user.userIsAdmin"
                      id="userIsAdmin"
                      class="form-select form-control"
                    >
                      <option :value="false">Nein</option>
                      <option :value="true">Ja</option>
                    </select>

                    <label for="userIsAdmin">Administrator</label>
                  </div>
                </div>
              </div>
              <div class="row pt-2" v-if="editMode">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <select
                      v-model="user.userIsNew"
                      id="userIsNew"
                      class="form-select form-control"
                    >
                      <option :value="false">Nein</option>
                      <option :value="true">Ja</option>
                    </select>

                    <label for="userIsNew">neu</label>
                  </div>
                </div>
              </div>

              <div class="row pt-5">
                <div class="col-xs-12">
                  <div class="form-floating">
                    <select
                      v-model="user.groupId"
                      id="groupId"
                      @change="validateGroupId"
                      :class="
                        'form-select form-control ' +
                        groupIdErrorData.inputClass
                      "
                    >
                      <option value="0">&nbsp;</option>
                      <option
                        v-for="group of groups"
                        :key="group.id"
                        :value="group.id"
                      >
                        {{ group.name }}
                      </option>
                    </select>

                    <label
                      for="groupId"
                      :style="'color: ' + groupIdErrorData.fieldColor"
                      >{{ groupIdErrorData.fieldLabel }}</label
                    >
                  </div>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <DatepickerVue
                    id="validFrom"
                    :label="validFromErrorData.fieldLabel"
                    :default-date="validFrom"
                    :input-class="
                      ' form-control ' + validFromErrorData.inputClass
                    "
                    :label-style="'color: ' + validFromErrorData.fieldColor"
                    @date-selected="validFromSelected"
                  />
                </div>
              </div>
            </div>
            <div class="col" v-if="editMode">
              <div class="row justify-content-md-center">
                <div class="col-xs-12 mb-4 text-center">
                  <h5>Gruppenhistorie</h5>
                </div>
              </div>
              <div class="row justify-content-md-center">
                <div class="col-xs-12 mb-4 text-center">
                  <table class="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Gruppe</th>
                        <th>g&uuml;ltig ab</th>
                        <th>g&uuml;ltig bis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="userGroup in userGroups" :key="userGroup.id">
                        <td>{{ userGroup.group?.name }}</td>
                        <td>{{ formatDate(userGroup.validFrom) }}</td>
                        <td>{{ formatDate(userGroup.validTil) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
import type { Group } from "@/model/group/Group";
import GroupControllerHandler from "@/handler/GroupControllerHandler";
import { formatDate } from "@/tools/views/FormatDate";
import DatepickerVue from "@/components/Datepicker.vue";

type UserGroup = AccessRelation & {
  group?: Group;
};
type CreateUserModalData = {
  serverError: Array<String>;
  origUser: User | undefined;
  user: User;
  groups: Array<Group>;
  password1: string;
  password2: string;
  validFrom: Date;
  userGroups: Array<UserGroup>;
  nameIsValid: boolean | null;
  nameErrorMessage: string;
  password1IsValid: boolean | null;
  password1ErrorMessage: string;
  password2IsValid: boolean | null;
  password2ErrorMessage: string;
  groupIdIsValid: boolean | null;
  groupIdErrorMessage: string;
  validFromIsValid: boolean | null;
  validFromErrorMessage: string;
};
export default defineComponent({
  name: "CreateUserModal",
  data(): CreateUserModalData {
    return {
      serverError: {} as Array<String>,
      origUser: undefined,
      user: {} as User,
      groups: {} as Array<Group>,
      password1: "",
      password2: "",
      validFrom: new Date(),
      userGroups: {} as Array<UserGroup>,
      nameIsValid: null,
      nameErrorMessage: "",
      password1IsValid: null,
      password1ErrorMessage: "",
      password2IsValid: null,
      password2ErrorMessage: "",
      groupIdIsValid: null,
      groupIdErrorMessage: "",
      validFromIsValid: null,
      validFromErrorMessage: "",
    };
  },
  props: {
    idSuffix: {
      type: String,
      default: "",
    },
  },
  computed: {
    formForCreationIsValid(): boolean {
      const isValid =
        this.nameIsValid &&
        this.groupIdIsValid &&
        this.password1IsValid &&
        this.password2IsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    formForUpdateIsValid(): boolean {
      const isValid =
        this.nameIsValid && this.groupIdIsValid && this.validFromIsValid;
      if (isValid === null || isValid === undefined || isValid === true) {
        return true;
      }
      return false;
    },
    editMode(): boolean {
      return this.origUser !== undefined;
    },
    title(): string {
      return this.editMode
        ? "Benutzerkonto bearbeiten"
        : "Benutzerkonto hinzufügen";
    },
    maxWidth(): string {
      return this.editMode ? "45%" : "var(--bs-modal-width);";
    },
    nameErrorData(): ErrorData {
      return generateErrorData(this.nameIsValid, "Name", this.nameErrorMessage);
    },
    password1ErrorData(): ErrorData {
      return generateErrorData(
        this.password1IsValid,
        "Passwort",
        this.password1ErrorMessage
      );
    },
    password2ErrorData(): ErrorData {
      return generateErrorData(
        this.password2IsValid,
        "Passwort wiederholen",
        this.password2ErrorMessage
      );
    },
    groupIdErrorData(): ErrorData {
      return generateErrorData(
        this.groupIdIsValid,
        "Gruppe",
        this.groupIdErrorMessage
      );
    },
    validFromErrorData(): ErrorData {
      return generateErrorData(
        this.validFromIsValid,
        "Gültig ab",
        this.validFromErrorMessage
      );
    },
  },
  methods: {
    async _show(user?: User) {
      this.origUser = user ? user : undefined;
      this.resetForm();
      (this.$refs.modalComponent as typeof ModalVue)._show();
    },
    async resetForm() {
      this.groups = await GroupControllerHandler.fetchAllGroup();
      this.userGroups = new Array<UserGroup>();
      this.password1 = "";
      this.password2 = "";

      if (this.editMode) {
        (this.validFrom = new Date()),
          (this.user = JSON.parse(JSON.stringify(this.origUser)));
        if (this.user.id) {
          const groupsById = new Map<number, Group>();
          for (const group of this.groups) {
            groupsById.set(group.id, group);
          }

          const accessRelations =
            await UserControllerHandler.getAllAccessRelations(this.user.id);

          accessRelations.forEach((mar) => {
            this.userGroups.push({
              ...mar,
              group: groupsById.get(mar.refId),
            });
          });
        }
      } else {
        this.user = {} as User;
        this.user.userName = "";
        this.user.userPassword = "";
        this.user.userCanLogin = true;
        this.user.userIsAdmin = false;
        this.user.userIsNew = true;
        this.user.groupId = 0;
        this.validFrom = new Date();
      }
      this.nameIsValid = null;
      this.serverError = {} as Array<String>;
    },
    formatDate(date?: Date) {
      return date ? formatDate(date) : "";
    },
    validateName() {
      [this.nameIsValid, this.nameErrorMessage] = validateInputField(
        this.user.userName,
        "Name angeben!"
      );
    },
    validatePassword1() {
      [this.password1IsValid, this.password1ErrorMessage] = validateInputField(
        this.password1,
        "Passwort angeben!"
      );
    },
    validatePassword2() {
      [this.password2IsValid, this.password2ErrorMessage] = validateInputField(
        this.password2,
        "Passwortwiederholung angeben!"
      );
    },
    validatePasswordsAreEqual() {
      if (this.password1 != this.password2) {
        this.serverError = new Array<string>();
        this.serverError.push("Die Passwörter stimmen nicht überein!");
        return false;
      }
      return true;
    },
    validateGroupId() {
      [this.groupIdIsValid, this.groupIdErrorMessage] = validateInputField(
        this.user.groupId,
        "Gruppe angeben!"
      );
    },
    validateValidFrom() {
      [this.validFromIsValid, this.validFromErrorMessage] = validateInputField(
        this.validFrom,
        "Gültig ab angeben!"
      );
    },
    validFromSelected(date: Date) {
      this.validFrom = date;
      this.validateValidFrom();
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
      this.validateGroupId();

      if (this.user.id > 0) {
        //update
        this.validateValidFrom();
        if (this.formForUpdateIsValid && this.validatePasswordsAreEqual()) {
          if (this.password1) {
            this.user.userPassword = this.password1;
          }

          if (this.user.groupId) {
            const mar: AccessRelation = {
              id: this.user.id,
              refId: this.user.groupId,
              validFrom: this.validFrom,
            };
            const validationResult = await UserControllerHandler.updateUser(
              this.user,
              mar
            );
            if (!this.handleServerError(validationResult)) {
              (this.$refs.modalComponent as typeof ModalVue)._hide();
              this.$emit("userUpdated", this.user);
            }
          }
        }
      } else {
        //create
        this.validatePassword1();
        this.validatePassword2();

        if (this.formForCreationIsValid && this.validatePasswordsAreEqual()) {
          this.user.userPassword = this.password1;
          const userValidation = await UserControllerHandler.createUser(
            this.user
          );
          const validationResult = userValidation.validationResult;

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
    DatepickerVue,
    ModalVue,
  },
});
</script>
