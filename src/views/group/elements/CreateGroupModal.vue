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
        <div class="form-section space-y-4">
          <InputStandard
            v-model="mData.name"
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
        @click="resetForm(resetAll)"
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
import InputStandard from "@/components/common/InputStandard.vue";
import ModalVue from "@/components/common/Modal.vue";
import { Button } from "@/components/ui/button";
import type { Group } from "@/model/group/Group";
import { createFormContext } from "@/tools/views/ValidationUtil";
import { globErr } from "@/tools/views/ZodUtil";
import { Save, Undo2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";
import { useCreateGroupModalStore } from "./CreateGroupModal.store";

const { t } = useI18n();
const store = useCreateGroupModalStore();
const { open, mData, title } = storeToRefs(store);
const { resetForm, save } = store;

const { handleSubmit, resetAll } = createFormContext();

const schema: Partial<{ [key in keyof Group]: ZodType }> = {
  name: string(globErr(t("Group.validation.name"))).min(1),
};
const createGroup = save(handleSubmit);
</script>
