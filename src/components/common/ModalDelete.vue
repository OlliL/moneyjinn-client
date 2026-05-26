<template>
  <ModalVue
    :title="title"
    max-width="max-w-md"
    :z-index="zIndex"
    ref="modalComponent"
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
import { useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

import { Table, TableBody } from "@/components/ui/table";
import ButtonDeleteTwoTap from "./ButtonDeleteTwoTap.vue";
import DivError from "./DivError.vue";
import ModalVue from "./Modal.vue";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    title: string;
    serverErrors: Array<string>;
    maxWidth?: string;
    zIndex?: string;
  }>(),
  {
    maxWidth: "",
    zIndex: "2000",
  },
);

const emit = defineEmits(["confirm"]);

const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");

const handleDelete = () => {
  emit("confirm");
};

const _show = () => {
  modalComponent.value?._show();
};

const _hide = () => {
  modalComponent.value?._hide();
};

defineExpose({
  _show,
  _hide,
});
</script>
