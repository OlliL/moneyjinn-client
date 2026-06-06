<template>
  <ModalVue
    :title="
      editMode
        ? $t('MonthlySettlement.title.update')
        : $t('MonthlySettlement.title.create')
    "
    max-width="max-w-md"
    id-suffix="EditMonthlySettlement"
    v-model:open="open"
  >
    <template #body>
      <form
        @submit.prevent="upsertMonthlySettlement"
        id="upsertMonthlySettlementForm"
      >
        <div class="flex justify-center mb-4">
          <div class="w-1/3">
            <InputDate
              v-model="selectedMonth"
              :validation-schema="schema.month"
              id="selectedMonth"
              :field-label="$t('General.month')"
              pick-mode="month"
              picker-align="center"
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
                    <TableHead class="table-head-cell w-7/12">{{
                      $t("General.capitalsource")
                    }}</TableHead>
                    <TableHead class="table-head-cell w-5/12">{{
                      $t("General.amount")
                    }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(mms, idx) in monthlySettlementsNoCredit"
                    :key="mms.id"
                  >
                    <TableCell class="text-left border-r">
                      {{ mms.capitalsourceComment }}
                    </TableCell>
                    <TableCell>
                      <InputStandard
                        v-model="mms.amount"
                        :validation-schema="schema.amount"
                        :disabled="mms.imported"
                        :id="'amountNoCredit' + idx"
                        field-type="number"
                        step="0.01"
                      >
                        <template #icon><Euro class="icon-medium" /></template>
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
                    <TableHead class="table-head-cell w-7/12">{{
                      $t("General.capitalsource")
                    }}</TableHead>
                    <TableHead class="table-head-cell w-5/12">{{
                      $t("General.amount")
                    }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(mms, idx) in monthlySettlementsCredit"
                    :key="mms.id"
                  >
                    <TableCell class="text-left border-r">
                      {{ mms.capitalsourceComment }}
                    </TableCell>
                    <TableCell>
                      <InputStandard
                        v-model="mms.amount"
                        :validation-schema="schema.amount"
                        :disabled="mms.imported"
                        :id="'amountCredit' + idx"
                        field-type="number"
                        step="0.01"
                      >
                        <template #icon><Euro class="icon-medium" /></template>
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
        test-id="editMonthlySettlementSaveButton"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { date, ZodType } from "zod";
import { useEditMonthlySettlementModalStore } from "./EditMonthlySettlementModal.store";

import ButtonSubmit from "../common/ButtonSubmit.vue";
import InputDate from "../common/InputDate.vue";
import InputStandard from "../common/InputStandard.vue";
import ModalVue from "../common/Modal.vue";

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

const editMode = ref(false);
const selectedMonth = ref(undefined as Date | undefined);
const loadedMonth = ref(undefined as Date | undefined);
const monthlySettlementsNoCredit = ref(new Array<MonthlySettlementFormData>());
const monthlySettlementsCredit = ref(new Array<MonthlySettlementFormData>());
const { open, year, month, onDone } = storeToRefs(
  useEditMonthlySettlementModalStore(),
);

const { handleSubmit, values, setFieldTouched } = useForm();

const schema: Partial<{ [key in keyof MonthlySettlement]: ZodType }> = {
  month: date(globErr(t("MonthlySettlement.validation.month"))),
  amount: amountSchema(t("MonthlySettlement.validation.amount")),
};

const loadMonthlySettlements = async (_year?: number, _month?: number) => {
  monthlySettlementsCredit.value = new Array<MonthlySettlementFormData>();
  monthlySettlementsNoCredit.value = new Array<MonthlySettlementFormData>();

  return MonthlySettlementService.getMonthlySettlementForEdit(_year, _month)
    .then((transporter: MonthlySettlementEditTransporter) => {
      const monthlySettlements = new Array<MonthlySettlementFormData>();

      for (const mms of transporter.monthlySettlements) {
        monthlySettlements.push({
          ...mms,
          imported: false,
        });
      }
      if (transporter.importedMonthlySettlements) {
        for (const mms of transporter.importedMonthlySettlements) {
          monthlySettlements.push({
            ...mms,
            imported: true,
          });
        }
      }

      for (const mms of monthlySettlements) {
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
      handleBackendError(backendError);
      return undefined;
    });
};

const upsertMonthlySettlement = handleSubmit(() => {
  const monthlySettlements = monthlySettlementsCredit.value.concat(
    monthlySettlementsNoCredit.value,
  );

  MonthlySettlementService.upsertMonthlySettlement(monthlySettlements)
    .then(() => {
      open.value = false;
      if (year.value !== undefined && month.value !== undefined) {
        onDone.value?.(year.value, month.value);
      }
    })
    .catch(handleBackendError);
});

watch(
  [open, year, month],
  ([isVisible, targetYear, targetMonth]) => {
    if (!isVisible) {
      selectedMonth.value = undefined;
      loadedMonth.value = undefined;
      monthlySettlementsNoCredit.value = [];
      monthlySettlementsCredit.value = [];
      return;
    }

    loadMonthlySettlements(targetYear, targetMonth).then((loaded) => {
      selectedMonth.value = loaded;
    });
  },
  { immediate: true },
);

watch(
  () => selectedMonth.value,
  (newVal) => {
    if (
      newVal !== undefined &&
      !Number.isNaN(newVal.getTime()) &&
      (loadedMonth.value === undefined ||
        newVal.toISOString() !== loadedMonth.value.toISOString())
    ) {
      const _year = newVal.getFullYear();
      const _month = newVal?.getMonth() + 1;
      loadMonthlySettlements(_year, _month);
    }
  },
  { immediate: true },
);
</script>
