<template>
  <ModalVue
    :title="
      $t('MonthlySettlement.title.delete', { month: monthName, year: year })
    "
    ref="modalComponent"
  >
    <template #body>
      <DivError :server-errors="serverErrors" />
      <div class="row justify-content-md-center mb-4" v-if="month">
        <div class="col">
          <ShowMonthlySettlementVue :year="year" :month="month" />
        </div>
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-danger"
        @click="deleteMonthlySettlement"
      >
        {{ $t("General.delete") }}
      </button>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from "vue";

import DivError from "../DivError.vue";
import ModalVue from "../Modal.vue";
import ShowMonthlySettlementVue from "./ShowMonthlySettlement.vue";

import { getMonthName } from "@/tools/views/MonthName";
import { handleBackendError } from "@/tools/views/HandleBackendError";

import MonthlySettlementService from "@/service/MonthlySettlementService";

const serverErrors = ref(new Array<string>());

const month = ref(0);
const monthName = ref("");
const year = ref(0);
const modalComponent = useTemplateRef<typeof ModalVue>('modalComponent');
const emit = defineEmits(["monthlySettlementDeleted"]);

const _show = (_year: number, _month: number) => {
  year.value = _year;
  month.value = _month;
  monthName.value = getMonthName(month.value);
  serverErrors.value = new Array<string>();
  modalComponent.value?._show();
};

const deleteMonthlySettlement = () => {
  serverErrors.value = new Array<string>();

  MonthlySettlementService.deleteMonthlySettlement(
    year.value,
    month.value,
  )
    .then(() => {
      modalComponent.value?._hide();
      emit("monthlySettlementDeleted", year.value, month.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
};

defineExpose({ _show });
</script>
