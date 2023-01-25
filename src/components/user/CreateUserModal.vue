<template>
  <ModalVue :title="title" :max-width="maxWidth" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createUser" :id="'createUserForm' + idSuffix">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <DivError :server-errors="serverErrors" />
              <div class="row pt-2">
                <div class="col-xs-12">
                  <InputStandard
                    v-model="user.userName"
                    :validation-schema="schema.userName"
                    :id="'name' + idSuffix"
                    field-label="Name"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <InputStandard
                    v-model="password1"
                    :validation-schema-ref="schema.password"
                    :id="'password1' + idSuffix"
                    field-label="Passwort"
                    field-type="password"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <InputStandard
                    v-model="password2"
                    :validation-schema-ref="schema.password"
                    :id="'password2' + idSuffix"
                    field-label="Passwort wiederholen"
                    field-type="password"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.userCanLogin"
                    :validation-schema="schema.userCanLogin"
                    :id="'userCanLogin' + idSuffix"
                    field-label="Anmeldung erlaubt"
                    :select-box-values="yesNoValues"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.userIsAdmin"
                    :validation-schema="schema.userIsAdmin"
                    :id="'userIsAdmin' + idSuffix"
                    field-label="Administrator"
                    :select-box-values="yesNoValues"
                  />
                </div>
              </div>
              <div class="row pt-2" v-if="editMode">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.userIsNew"
                    :validation-schema="schema.userIsNew"
                    :id="'userIsNew' + idSuffix"
                    field-label="neu"
                    :select-box-values="yesNoValues"
                  />
                </div>
              </div>

              <div class="row pt-5">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.groupId"
                    :validation-schema="schema.groupId"
                    :id="'groupId' + idSuffix"
                    field-label="Gruppe"
                    :select-box-values="groupValues"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <InputDate
                    v-model="validFrom"
                    :validation-schema="schema.validFrom"
                    :id="'validFrom' + idSuffix"
                    field-label="Gültig ab"
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
                        <td><SpanDate :date="userGroup.validFrom" /></td>
                        <td><SpanDate :date="userGroup.validTil" /></td>
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
      <ButtonSubmit
        button-label="Speichern"
        :form-id="'createUserForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { boolean, date, number, string } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";
import SpanDate from "../SpanDate.vue";

import { handleServerError } from "@/tools/views/ThrowError";
import { globErr } from "@/tools/views/ZodUtil";

import type { AccessRelation } from "@/model/user/AccessRelation";
import type { Group } from "@/model/group/Group";
import type { User } from "@/model/user/User";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import GroupControllerHandler from "@/handler/GroupControllerHandler";
import UserControllerHandler from "@/handler/UserControllerHandler";

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

type UserGroup = AccessRelation & {
  group?: Group;
};

const serverErrors = ref(new Array<string>());

const schema = {
  userName: string(globErr("Bitte Name angeben!")).min(1),
  groupId: number(globErr("Bitte Gruppe angeben!")).gt(0),
  validFrom: date(globErr("Bitte Gültig ab angeben!")),
  userIsAdmin: boolean(globErr("Bitte Gruppennutzung auswählen!")),
  userIsNew: boolean(globErr("Bitte Gruppennutzung auswählen!")),
  userCanLogin: boolean(globErr("Bitte Gruppennutzung auswählen!")),
  password: computed(() => {
    if (!editMode.value) {
      return string(globErr("Bitte Passwort angeben!")).min(1);
    } else {
      return string().optional();
    }
  }),
};

const origUser = ref({} as User | undefined);
const user = ref({} as User);
const groupValues = ref(new Array<SelectBoxValue>());
const password1 = ref("");
const password2 = ref("");
const userGroups = ref(new Array<UserGroup>());
const validFrom = ref(new Date());
const yesNoValues = [
  { id: false, value: "Nein" },
  { id: true, value: "Ja" },
] as Array<SelectBoxValue>;
const modalComponent = ref();
const emit = defineEmits(["userCreated", "userUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const editMode = computed(() => {
  return origUser.value !== undefined;
});

const title = computed(() => {
  return origUser.value === undefined
    ? "Benutzerkonto hinzufügen"
    : "Benutzerkonto bearbeiten";
});

const maxWidth = computed(() => {
  return editMode.value ? "45%" : "var(--bs-modal-width);";
});

const resetForm = () => {
  GroupControllerHandler.fetchAllGroup().then((_groups) => {
    userGroups.value = new Array<UserGroup>();
    password1.value = "";
    password2.value = "";
    validFrom.value = new Date();

    groupValues.value = new Array<SelectBoxValue>();
    for (const group of _groups) {
      groupValues.value.push({ id: group.id, value: group.name });
    }

    if (origUser.value) {
      Object.assign(user.value, origUser.value);
      if (user.value.id) {
        const groupsById = new Map<number, Group>();
        for (const group of _groups) {
          groupsById.set(group.id, group);
        }

        UserControllerHandler.getAllAccessRelations(user.value.id).then(
          (accessRelations) => {
            accessRelations.forEach((mar) => {
              userGroups.value.push({
                ...mar,
                group: groupsById.get(mar.refId),
              });
            });
          }
        );
      }
    } else {
      user.value = {
        userCanLogin: true,
        userIsAdmin: false,
        userIsNew: true,
      } as User;
    }
  });
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_user?: User) => {
  origUser.value = _user ? _user : undefined;
  resetForm();
  modalComponent.value._show();
};

const validatePasswordsAreEqual = () => {
  if (password1.value != password2.value) {
    serverErrors.value = new Array<string>();
    serverErrors.value.push("Die Passwörter stimmen nicht überein!");
    return false;
  }
  return true;
};

const createUser = handleSubmit(() => {
  if (user.value.id > 0) {
    //update
    if (validatePasswordsAreEqual()) {
      if (password1.value) {
        user.value.userPassword = password1.value;
      }

      if (user.value.groupId) {
        const mar: AccessRelation = {
          id: user.value.id,
          refId: user.value.groupId,
          validFrom: validFrom.value,
        };
        UserControllerHandler.updateUser(user.value, mar).then(
          (validationResult) => {
            if (!handleServerError(validationResult, serverErrors)) {
              modalComponent.value._hide();
              emit("userUpdated", user.value);
            }
          }
        );
      }
    }
  } else {
    //create
    if (validatePasswordsAreEqual()) {
      user.value.userPassword = password1.value;
      //create
      UserControllerHandler.createUser(user.value).then((userValidation) => {
        const validationResult = userValidation.validationResult;

        if (!handleServerError(validationResult, serverErrors)) {
          user.value = userValidation.user;
          modalComponent.value._hide();
          emit("userCreated", user.value);
        }
      });
    }
  }
});

defineExpose({ _show });
</script>
