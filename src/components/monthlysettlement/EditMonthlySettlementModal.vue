<template>
  <ModalVue
    :title="
      editMode
        ? $t('MonthlySettlement.title.update')
        : $t('MonthlySettlement.title.create')
    "
    ref="modalComponent"
  >
    <template #body>
      <form
        @submit.prevent="upsertMonthlySettlement"
        id="upsertMonthlySettlementForm"
      >
        <DivError :server-errors="serverErrors" />
        <div class="flex justify-center mb-4">
          <div class="w-1/3">
            <InputDate
              v-model="selectedMonth"
              :validation-schema="schema.month"
              id="selectedMonth"
              :field-label="$t('General.month')"
              pick-mode="month"
            />
          </div>
        </div>
        <div class="flex justify-center mb-4">
          <div class="w-full">
            <div
              class="flex flex-col rounded-md border mb-4"
              v-if="monthlySettlementsNoCredit"
            >
              <Table class="[&_td]:py-0.5! [&_th]:py-1!">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      class="w-2/3 font-bold border text-foreground text-center"
                      >{{ $t("General.capitalsource") }}</TableHead
                    >
                    <TableHead
                      class="w-1/3 font-bold border text-foreground text-center"
                      >{{ $t("General.amount") }}</TableHead
                    >
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(mms, idx) in monthlySettlementsNoCredit"
                    :key="mms.id"
                  >
                    <TableCell class="text-left border">
                      {{ mms.capitalsourceComment }}
                    </TableCell>
                    <TableCell class="border">
                      <InputStandard
                        v-model="mms.amount"
                        :validation-schema="schema.amount"
                        :disabled="mms.imported"
                        :id="'amountNoCredit' + idx"
                        field-type="number"
                        step="0.01"
                      >
                        <template #icon><Euro class="h-4 w-4" /></template>
                      </InputStandard>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div
              class="flex flex-col rounded-md border"
              v-if="monthlySettlementsCredit"
            >
              <Table>
                <TableHeader v-if="monthlySettlementsNoCredit.length">
                  <TableRow>
                    <TableHead
                      class="w-2/3 font-bold border text-foreground text-center"
                      >{{ $t("General.capitalsource") }}</TableHead
                    >
                    <TableHead
                      class="w-1/3 font-bold border text-foreground text-center"
                      >{{ $t("General.amount") }}</TableHead
                    >
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(mms, idx) in monthlySettlementsCredit"
                    :key="mms.id"
                  >
                    <TableCell class="text-left border">
                      {{ mms.capitalsourceComment }}
                    </TableCell>
                    <TableCell class="border">
                      <InputStandard
                        v-model="mms.amount"
                        :validation-schema="schema.amount"
                        :disabled="mms.imported"
                        :id="'amountCredit' + idx"
                        field-type="number"
                        step="0.01"
                      >
                        <template #icon><Euro class="h-4 w-4" /></template>
                      </InputStandard>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <ButtonSubmit
        :button-label="$t('General.save')"
        form-id="upsertMonthlySettlementForm"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref, watch, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { date, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";

import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";

import MonthlySettlementService from "@/service/MonthlySettlementService";
import { Euro } from "lucide-vue-next";

const { t } = useI18n();

type MonthlySettlementFormData = MonthlySettlement & {
  imported: boolean;
};

const serverErrors = ref(new Array<string>());
const editMode = ref(false);
const year = ref(0);
const month = ref(0);
const selectedMonth = ref(undefined as Date | undefined);
const loadedMonth = ref(undefined as Date | undefined);
const monthlySettlementsNoCredit = ref(new Array<MonthlySettlementFormData>());
const monthlySettlementsCredit = ref(new Array<MonthlySettlementFormData>());
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["monthlySettlementUpserted"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof MonthlySettlement]: ZodType }> = {
  month: date(globErr(t("MonthlySettlement.validation.month"))),
  amount: amountSchema(t("MonthlySettlement.validation.amount")),
};

const _show = (_year?: number, _month?: number) => {
  loadMonthlySettlements(_year, _month).then((_selectedMonth) => {
    selectedMonth.value = _selectedMonth;
  });
  modalComponent.value?._show();
};

const loadMonthlySettlements = async (_year?: number, _month?: number) => {
  serverErrors.value = new Array<string>();

  monthlySettlementsCredit.value = new Array<MonthlySettlementFormData>();
  monthlySettlementsNoCredit.value = new Array<MonthlySettlementFormData>();

  serverErrors.value = new Array<string>();

  return MonthlySettlementService.getMonthlySettlementForEdit(_year, _month)
    .then((transporter: MonthlySettlementEditTransporter) => {
      const monthlySettlements = new Array<MonthlySettlementFormData>();

      for (let mms of transporter.monthlySettlements) {
        monthlySettlements.push({
          ...mms,
          imported: false,
        });
      }
      if (transporter.importedMonthlySettlements) {
        for (let mms of transporter.importedMonthlySettlements) {
          monthlySettlements.push({
            ...mms,
            imported: true,
          });
        }
      }

      for (let mms of monthlySettlements) {
        if (mms.capitalsourceType === CapitalsourceType.CREDIT) {
          monthlySettlementsCredit.value.push(mms);
        } else {
          monthlySettlementsNoCredit.value.push(mms);
        }
      }

      year.value = transporter.year;
      month.value = transporter.month;
      const monthDate = new Date();
      monthDate.setFullYear(transporter.year);
      monthDate.setDate(1);
      monthDate.setMonth(transporter.month - 1);
      monthDate.setHours(0, 0, 0, 0);

      editMode.value = transporter.editMode;

      Object.keys(values).forEach((field) => setFieldTouched(field, false));

      loadedMonth.value = monthDate;

      return monthDate;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      return undefined;
    });
};

const upsertMonthlySettlement = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  let monthlySettlements = monthlySettlementsCredit.value.concat(
    monthlySettlementsNoCredit.value,
  );

  MonthlySettlementService.upsertMonthlySettlement(monthlySettlements)
    .then(() => {
      modalComponent.value?._hide();
      emit("monthlySettlementUpserted", year.value, month.value);
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

watch(
  () => selectedMonth.value,
  (newVal) => {
    if (
      newVal !== undefined &&
      (loadedMonth.value === undefined ||
        newVal.toISOString() !== loadedMonth.value?.toISOString())
    ) {
      const _year = newVal.getFullYear();
      const _month = newVal?.getMonth() + 1;
      loadMonthlySettlements(_year, _month);
    }
  },
  { immediate: true },
);

defineExpose({ _show });
</script>
