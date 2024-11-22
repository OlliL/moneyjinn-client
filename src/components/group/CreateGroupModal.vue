<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createGroup" id="createGroupForm">
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="group.name"
                :validation-schema="schema.name"
                id="name"
                :field-label="$t('General.name')"
              />
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
        form-id="createGroupForm"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import type { Group } from "@/model/group/Group";

import GroupService from "@/service/GroupService";
import InputStandard from "../InputStandard.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Group]: ZodType }> = {
  name: string(globErr(t("Group.validation.name"))).min(1),
};

const group = ref({} as Group);
const origGroup = ref({} as Group | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');
const emit = defineEmits(["groupUpdated", "groupCreated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origGroup.value === undefined
    ? t("Group.title.create")
    : t("Group.title.update");
});

const resetForm = () => {
  if (origGroup.value) {
    Object.assign(group.value, origGroup.value);
  } else {
    group.value = {} as Group;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_group?: Group) => {
  origGroup.value = _group ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createGroup = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (group.value.id > 0) {
    //update
    GroupService.updateGroup(group.value)
      .then(() => {
        modalComponent.value?._hide();
        emit("groupUpdated", group.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    GroupService.createGroup(group.value)
      .then((_group) => {
        group.value = _group;
        modalComponent.value?._hide();
        emit("groupCreated", group.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
