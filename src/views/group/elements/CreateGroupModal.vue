<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    id-suffix="CreateGroup"
    v-model:open="open"
  >
    <template #body
      ><form
        @submit.prevent="createGroup"
        id="createGroupForm"
        class="space-y-6"
      >
        <DivError :server-errors="serverErrors" />

        <div class="form-section space-y-4">
          <InputStandard
            v-model="groupModel.name"
            :validation-schema="schema.name"
            id="name"
            :field-label="$t('General.name')"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon hidden md:flex"
        data-testid="createGroupResetButton"
        @click="resetForm"
      >
        <Undo2 class="icon-medium" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="createGroupForm"
        test-id="createGroupSaveButton"
      >
        <template #icon><Save class="icon-medium" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivError from "@/components/common/DivError.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import { Button } from "@/components/ui/button";
import type { Group } from "@/model/group/Group";
import GroupService from "@/service/GroupService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import useCreateGroupModalStore from "./CreateGroupModal.store";

const { t } = useI18n();

const { open, group, onDone } = storeToRefs(useCreateGroupModalStore());

const serverErrors = ref(new Array<string>());
const groupModel = ref({} as Group);
const origGroup = ref({} as Group | undefined);

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof Group]: ZodType }> = {
  name: string(globErr(t("Group.validation.name"))).min(1),
};

const title = computed(() => {
  return origGroup.value === undefined
    ? t("Group.title.create")
    : t("Group.title.update");
});

const resetForm = () => {
  if (origGroup.value) {
    groupModel.value = structuredClone(toRaw(origGroup.value))!;
  } else {
    groupModel.value = {} as Group;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

watch(
  open,
  (val) => {
    if (val) {
      origGroup.value = group.value;
      resetForm();
    }
  },
  { immediate: true },
);

const createGroup = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const serviceCall =
    groupModel.value.id > 0
      ? GroupService.updateGroup(groupModel.value)
      : GroupService.createGroup(groupModel.value);

  serviceCall
    .then((result) => {
      const isUpdate = groupModel.value.id > 0;
      if (!isUpdate) groupModel.value = result as Group;

      open.value = false;
      onDone.value?.();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});
</script>
