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
                    :field-label="$t('General.username')"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <InputStandard
                    v-model="password1"
                    :validation-schema-ref="schema.password"
                    :id="'password1' + idSuffix"
                    :field-label="$t('General.password')"
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
                    :field-label="$t('User.passwordVerify')"
                    field-type="password"
                  />
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.role"
                    :validation-schema="schema.userRole"
                    :id="'groupUse' + idSuffix"
                    :field-label="$t('User.role')"
                    :select-box-values="userRoleValues"
                  />
                </div>
              </div>
              <div class="row pt-2" v-if="editMode">
                <div class="col-xs-12">
                  <SelectStandard
                    v-model="user.userIsNew"
                    :validation-schema="schema.userIsNew"
                    :id="'userIsNew' + idSuffix"
                    :field-label="$t('User.new')"
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
                    :field-label="$t('General.group')"
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
                    :field-label="$t('General.validFrom')"
                  />
                </div>
              </div>
            </div>
            <div class="col" v-if="editMode">
              <div class="row justify-content-md-center">
                <div class="col-xs-12 mb-4 text-center">
                  <h5>{{ $t("User.groupHistory") }}</h5>
                </div>
              </div>
              <div class="row justify-content-md-center">
                <div class="col-xs-12 mb-4 text-center">
                  <table class="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th scope="col">{{ $t("General.group") }}</th>
                        <th scope="col">{{ $t("General.validFrom") }}</th>
                        <th scope="col">{{ $t("General.validTil") }}</th>
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
        {{ $t("General.reset") }}
      </button>
      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createUserForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, date, number, string, type ZodTypeAny } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectStandard from "../SelectStandard.vue";
import SpanDate from "../SpanDate.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { AccessRelation } from "@/model/user/AccessRelation";
import type { Group } from "@/model/group/Group";
import type { User } from "@/model/user/User";
import { UserRole, userRoleValues } from "@/model/user/UserRole";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import GroupService from "@/service/GroupService";
import UserService from "@/service/UserService";

const { t } = useI18n();

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
  userName: string(globErr(t("User.validation.userName")))
    .min(1)
    .max(20, t("User.validation.length.userName")),
  groupId: number(globErr(t("User.validation.groupId"))).gt(0),
  validFrom: date(globErr(t("General.validation.validFrom"))),
  userIsNew: boolean(globErr(t("User.validation.userIsNew"))),
  userRole: number(globErr(t("User.validation.userRole"))),
  password: ref(string() as ZodTypeAny),
};

const origUser = ref({} as User | undefined);
const user = ref({} as User);
const groupValues = ref(new Array<SelectBoxValue>());
const password1 = ref("");
const password2 = ref("");
const userGroups = ref(new Array<UserGroup>());
const validFrom = ref(new Date());
const yesNoValues = [
  { id: false, value: t("General.no") },
  { id: true, value: t("General.yes") },
] as Array<SelectBoxValue>;
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["userCreated", "userUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const editMode = computed(() => {
  return origUser.value !== undefined;
});

watch(
  () => [password1.value, password2.value, editMode.value],
  () => {
    schema.password.value = string()
      .refine(
        () => password1.value == password2.value,
        t("User.validation.passwordNotEqual"),
      )
      .refine((data) => editMode.value || data, t("User.validation.password"));
  },
);

const title = computed(() => {
  return origUser.value === undefined
    ? t("User.title.create")
    : t("User.title.update");
});

const maxWidth = computed(() => {
  return editMode.value ? "45%" : "var(--bs-modal-width);";
});

const resetForm = () => {
  GroupService.fetchAllGroup().then((_groups) => {
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

        UserService.getAllAccessRelations(user.value.id).then(
          (accessRelations) => {
            accessRelations.forEach((mar) => {
              userGroups.value.push({
                ...mar,
                group: groupsById.get(mar.refId),
              });
            });
          },
        );
      }
    } else {
      user.value = {
        role: UserRole.STANDARD,
        userIsNew: true,
      } as User;
    }
  });
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_user?: User) => {
  origUser.value = _user ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createUser = handleSubmit(() => {
  if (user.value.id > 0) {
    //update
    if (password1.value) {
      user.value.userPassword = password1.value;
    }

    if (user.value.groupId) {
      const mar: AccessRelation = {
        id: user.value.id,
        refId: user.value.groupId,
        validFrom: validFrom.value,
      };
      UserService.updateUser(user.value, mar)
        .then(() => {
          modalComponent.value?._hide();
          emit("userUpdated", user.value);
        })
        .catch((backendError) => {
          handleBackendError(backendError, serverErrors);
        });
    }
  } else {
    //create
    user.value.userPassword = password1.value;

    UserService.createUser(user.value)
      .then((_user) => {
        user.value = _user;
        modalComponent.value?._hide();
        emit("userCreated", user.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

defineExpose({ _show });
</script>
