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
                field-label="Name"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        r&uuml;cksetzen
      </button>
      <ButtonSubmit button-label="Speichern" form-id="createGroupForm" />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";

import { globErr } from "@/tools/views/ZodUtil";
import { handleServerError } from "@/tools/views/ThrowError";

import type { Group } from "@/model/group/Group";

import GroupControllerHandler from "@/handler/GroupControllerHandler";
import InputStandard from "../InputStandard.vue";

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Group]: ZodType }> = {
  name: string(globErr("Bitte Name angeben!")).min(1),
};

const group = ref({} as Group);
const origGroup = ref({} as Group | undefined);
const modalComponent = ref();
const emit = defineEmits(["groupUpdated", "groupCreated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origGroup.value === undefined
    ? "Gruppe hinzufügen"
    : "Gruppe bearbeiten";
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
  origGroup.value = _group ? _group : undefined;
  resetForm();
  modalComponent.value._show();
};

const createGroup = handleSubmit(() => {
  if (group.value.id > 0) {
    //update
    GroupControllerHandler.updateGroup(group.value).then((validationResult) => {
      if (!handleServerError(validationResult, serverErrors)) {
        modalComponent.value._hide();
        emit("groupUpdated", group.value);
      }
    });
  } else {
    //create
    GroupControllerHandler.createGroup(group.value).then((groupValidation) => {
      const validationResult = groupValidation.validationResult;

      if (!handleServerError(validationResult, serverErrors)) {
        group.value = groupValidation.group;
        modalComponent.value._hide();
        emit("groupCreated", group.value);
      }
    });
  }
});
defineExpose({ _show });
</script>
