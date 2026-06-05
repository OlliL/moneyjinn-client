<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    :z-index="zIndex"
    v-model:open="isOpen"
    :id-suffix="idSuffix"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <slot name="body">
        <div
          class="icon-mediumflex flex-col rounded-xl border bg-card overflow-hidden"
        >
          <Table>
            <TableBody>
              <slot name="details" />
            </TableBody>
          </Table>
        </div>
      </slot>
    </template>
    <template #footer>
      <ButtonDeleteTwoTap
        :button-label="t('General.delete')"
        @execute-delete="handleDelete"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useI18n } from "vue-i18n";

import { Table, TableBody } from "@/components/ui/table";
import ButtonDeleteTwoTap from "./ButtonDeleteTwoTap.vue";
import DivError from "./DivError.vue";
import ModalVue from "./Modal.vue";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    title: string;
    maxWidth?: string;
    zIndex?: string;
    idSuffix: string;
  }>(),
  {
    maxWidth: "",
    zIndex: "2000",
  },
);

const emit = defineEmits<{
  confirm: [];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const serverErrors = defineModel<string[]>("serverErrors", { default: [] });

watch(isOpen, (newVal) => {
  if (newVal) {
    serverErrors.value = [];
  }
});

const handleDelete = () => {
  serverErrors.value = [];
  emit("confirm");
};
</script>
