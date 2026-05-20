<template>
  <ModalVue :title="title" :max-width="maxWidth" ref="modalComponent">
    <template #body>
      <form @submit.prevent="createUser" :id="'createUserForm' + idSuffix">
        <div
          class="grid grid-cols-1"
          :class="{ 'lg:grid-cols-12 gap-6': editMode }"
        >
          <div :class="{ 'lg:col-span-6': editMode }">
            <div class="space-y-4">
              <DivError :server-errors="serverErrors" />

              <div class="form-section space-y-4">
                <div
                  class="flex items-center space-x-2 border-b border-border/40 pb-2"
                >
                  <span class="form-section-title">
                    {{ $t("User.loginData") }}
                  </span>
                </div>

                <div>
                  <InputStandard
                    v-model="user.userName"
                    :validation-schema="schema.userName"
                    :id="'name' + idSuffix"
                    :field-label="$t('General.username')"
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <InputStandard
                      v-model="password1"
                      :validation-schema-ref="schema.password"
                      :id="'password1' + idSuffix"
                      :field-label="$t('General.password')"
                      field-type="password"
                    />
                  </div>

                  <div>
                    <InputStandard
                      v-model="password2"
                      :validation-schema-ref="schema.password"
                      :id="'password2' + idSuffix"
                      :field-label="$t('User.passwordVerify')"
                      field-type="password"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section space-y-4">
                <div
                  class="flex items-center space-x-2 border-b border-border/40 pb-2"
                >
                  <span class="form-section-title">
                    {{ $t("User.permissions") }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <SelectStandard
                      v-model="user.role"
                      :validation-schema="schema.userRole"
                      :id="'role' + idSuffix"
                      :field-label="$t('User.role')"
                      :select-box-values="userRoleValues"
                    />
                  </div>
                  <div>
                    <SelectStandard
                      v-model="user.groupId"
                      :validation-schema="schema.groupId"
                      :id="'groupId' + idSuffix"
                      :field-label="$t('General.group')"
                      :select-box-values="groupValues"
                    />
                  </div>
                  <div>
                    <InputDate
                      v-model="validFrom"
                      :validation-schema="schema.validFrom"
                      :id="'validFrom' + idSuffix"
                      :field-label="$t('General.validFrom')"
                    />
                  </div>
                  <div v-if="editMode">
                    <SelectStandard
                      v-model="user.userIsNew"
                      :validation-schema="schema.userIsNew"
                      :id="'userIsNew' + idSuffix"
                      :field-label="$t('User.new')"
                      :select-box-values="yesNoValues"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class="{ 'lg:col-span-6': editMode }">
            <div class="col" v-if="editMode">
              <div class="flex justify-center">
                <div class="w-full mb-4 text-center">
                  <h5 class="text-xl">{{ $t("User.groupHistory") }}</h5>
                </div>
              </div>
              <div class="flex justify-center">
                <div class="w-full mb-4 text-center">
                  <div class="flex flex-col rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            class="font-bold border text-foreground text-center"
                            >{{ $t("General.group") }}</TableHead
                          >
                          <TableHead
                            class="font-bold border text-foreground text-center"
                            >{{ $t("General.validFrom") }}</TableHead
                          >
                          <TableHead
                            class="font-bold border text-foreground text-center"
                            >{{ $t("General.validTil") }}</TableHead
                          >
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow
                          v-for="userGroup in userGroups"
                          :key="userGroup.id"
                        >
                          <TableCell>{{ userGroup.group?.name }}</TableCell>
                          <TableCell
                            ><SpanDate :date="userGroup.validFrom"
                          /></TableCell>
                          <TableCell
                            ><SpanDate :date="userGroup.validTil"
                          /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon"
        @click="resetForm"
      >
        <Undo2 class="h-4 w-4" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createUserForm' + idSuffix"
      >
        <template #icon><Save class="h-4 w-4" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Group } from "@/model/group/Group";
import type { SelectBoxValue } from "@/model/SelectBoxValue";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";
import { UserRole, userRoleValues } from "@/model/user/UserRole";
import GroupService from "@/service/GroupService";
import UserService from "@/service/UserService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { boolean, date, number, string, type ZodTypeAny } from "zod";
import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivError from "@/components/DivError.vue";
import InputDate from "@/components/InputDate.vue";
import InputStandard from "@/components/InputStandard.vue";
import ModalVue from "@/components/Modal.vue";
import SelectStandard from "@/components/SelectStandard.vue";
import SpanDate from "@/components/SpanDate.vue";

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
  return editMode.value
    ? "max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-4xl w-full mx-auto"
    : "max-w-[calc(100%-2rem)] sm:max-w-md w-full mx-auto";
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
      user.value = structuredClone(toRaw(origUser.value))!;
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

const _show = (_user?: User) => {
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
