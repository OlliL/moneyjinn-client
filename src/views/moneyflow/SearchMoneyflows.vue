<template>
  <ReceiptModal ref="receiptModal" />
  <DeleteMoneyflowModalVue
    ref="deleteModal"
    @moneyflow-deleted="searchMoneyflows"
  />
  <EditMoneyflowModalVue
    ref="editModal"
    @moneyflow-updated="searchMoneyflows"
  />
  <ListMoneyflowModal ref="listModal" />

  <div class="container mx-auto py-6 space-y-6 text-center">
    <div>
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.search") }}</h4>
    </div>
    <div class="flex justify-center">
      <div
        class="w-full max-w-7xl rounded-lg border bg-card text-card-foreground shadow-sm p-4"
      >
        <form @submit.prevent="searchMoneyflows" id="searchMoneyflowsForm">
          <div class="space-y-4">
            <DivError :server-errors="serverErrors" />
            <div class="grid gap-3 md:grid-cols-12">
              <div class="md:col-span-2">
                <InputDate
                  v-model="startDate"
                  :validation-schema="schema.startDate"
                  id="startDate"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="md:col-span-2">
                <InputDate
                  v-model="endDate"
                  :validation-schema="schema.endDate"
                  id="endDate"
                  :field-label="$t('General.endDate')"
                />
              </div>
              <div class="md:col-span-4">
                <SelectContractpartner
                  v-model="contractpartnerId"
                  :validation-schema-ref="schema.searchCriteria"
                  id-suffix="SearchMoneyflows"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="md:col-span-4">
                <SelectPostingAccount
                  v-model="postingAccountId"
                  :validation-schema-ref="schema.searchCriteria"
                  id-suffix="SearchMoneyflows"
                  :field-label="$t('General.postingAccount')"
                />
              </div>
            </div>
            <div class="grid gap-3 md:grid-cols-12 items-center">
              <div class="md:col-span-4">
                <InputStandard
                  v-model="comment"
                  :validation-schema-ref="schema.searchCriteria"
                  id="comment"
                  :field-label="$t('General.comment')"
                />
              </div>
              <div class="md:col-span-2 flex items-center gap-2 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  v-model="featureEqual"
                  id="featureEqual"
                />
                <label for="featureEqual">
                  {{ $t("Moneyflow.equal") }}
                </label>
              </div>
              <div class="md:col-span-3 flex items-center gap-2 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  v-model="featureCaseSensitive"
                  id="featureCaseSensitive"
                />
                <label for="featureCaseSensitive">
                  {{ $t("Moneyflow.caseSensitivity") }}
                </label>
              </div>
              <div class="md:col-span-1 flex items-center gap-2 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  v-model="featureRegexp"
                  id="featureRegexp"
                />
                <label for="featureRegexp">{{ $t("Moneyflow.regexp") }}</label>
              </div>
              <div class="md:col-span-2 flex items-center gap-2 text-left">
                <input
                  class="h-4 w-4"
                  type="checkbox"
                  v-model="featureOnlyMinusAmounts"
                  id="featureOnlyMinusAmounts"
                />
                <label for="featureOnlyMinusAmounts">
                  {{ $t("Moneyflow.onlyNegative") }}
                </label>
              </div>
            </div>
            <div class="grid gap-3 md:grid-cols-12 items-end">
              <div
                class="md:col-span-3 mx-auto flex items-center justify-center gap-2"
              >
                <ButtonSubmit
                  :button-label="$t('Moneyflow.search')"
                  form-id="searchMoneyflowsForm"
                />
                <Button type="button" variant="secondary" @click="resetForm">
                  {{ $t("General.reset") }}
                </Button>
              </div>
              <div class="md:col-span-3">
                <SelectStandard
                  v-model="groupByFirst"
                  id="groupByFirst"
                  :field-label="$t('Moneyflow.1stGroupingCriteria')"
                  :select-box-values="groupValues"
                />
              </div>
              <div class="md:col-span-3">
                <SelectStandard
                  v-model="groupBySecond"
                  id="groupBySecond"
                  :field-label="$t('Moneyflow.2ndGroupingCriteria')"
                  :select-box-values="groupValues"
                />
              </div>
              <div class="md:col-span-3">
                <SelectStandard
                  v-model="orderBy"
                  id="orderBy"
                  :field-label="$t('Moneyflow.orderBy')"
                  :select-box-values="orderValues"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex justify-center" v-if="dataLoaded">
      <DivContentTable>
        <TableHeader>
          <TableRow>
            <TableHead
              class="font-bold border text-foreground text-center"
            ></TableHead>
            <TableHead
              class="font-bold border text-foreground"
              v-if="colBookingMonth"
            >
              {{ $t("Moneyflow.bookingMonth") }}
            </TableHead>
            <TableHead
              class="font-bold border text-foreground"
              v-if="colBookingYear"
            >
              {{ $t("Moneyflow.bookingYear") }}
            </TableHead>
            <TableHead
              class="font-bold border text-foreground"
              v-if="colContractpartner"
            >
              {{ $t("General.contractpartner") }}
            </TableHead>
            <TableHead class="font-bold border text-foreground text-center">{{
              $t("General.amount")
            }}</TableHead>
            <TableHead class="font-bold border text-foreground text-center">{{
              $t("General.comment")
            }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SearchMoneyflowResultGroupVue
            v-for="[index, moneyflowGroup] in moneyflowGroups"
            :key="index.toString()"
            :moneyflow-group="moneyflowGroup"
            :moneyflow-group-key="index.toString()"
            :col-booking-month="colBookingMonth"
            :col-booking-year="colBookingYear"
            :col-contractpartner="colContractpartner"
            @delete-moneyflow="deleteMoneyflow"
            @edit-moneyflow="editMoneyflow"
            @list-moneyflow="listMoneyflow"
            @show-receipt="showReceipt"
          />
        </TableBody>
      </DivContentTable>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useForm } from "vee-validate";
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { any, date, type ZodTypeAny } from "zod";

import ButtonSubmit from "@/components/ButtonSubmit.vue";
import DivContentTable from "@/components/DivContentTable.vue";
import DeleteMoneyflowModalVue from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import DivError from "@/components/DivError.vue";
import EditMoneyflowModalVue from "@/components/moneyflow/EditMoneyflowModal.vue";
import InputDate from "@/components/InputDate.vue";
import InputStandard from "@/components/InputStandard.vue";
import SearchMoneyflowResultGroupVue from "@/components/moneyflow/SearchMoneyflowResultGroup.vue";
import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import SelectStandard from "@/components/SelectStandard.vue";

import { toFixed } from "@/tools/math";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { globErr } from "@/tools/views/ZodUtil";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import MoneyflowService from "@/service/MoneyflowService";
import ListMoneyflowModal from "@/components/moneyflow/ListMoneyflowModal.vue";
import ReceiptModal from "@/components/reports/ReceiptModal.vue";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const GROUP_NONE: number = 0;
const GROUP_YEAR: number = 1;
const GROUP_MONTH: number = 2;
const GROUP_CONTRACTPARTNER: number = 3;
const ORDER_NONE: number = 0;
const ORDER_GROUP: number = 1;
const ORDER_AMOUNT: number = 2;
const ORDER_COMMENT: number = 3;

const groupValues = [
  { id: GROUP_NONE, value: "" },
  { id: GROUP_YEAR, value: t("General.year") },
  { id: GROUP_MONTH, value: t("General.month") },
  { id: GROUP_CONTRACTPARTNER, value: t("General.contractpartner") },
] as Array<SelectBoxValue>;

const orderValues = [
  { id: ORDER_NONE, value: "" },
  { id: ORDER_GROUP, value: t("Moneyflow.grouping") },
  { id: ORDER_AMOUNT, value: t("General.amount") },
  { id: ORDER_COMMENT, value: t("General.comment") },
] as Array<SelectBoxValue>;

const startDate = ref(new Date());
const endDate = ref(new Date());
const contractpartnerId = ref(0);
const postingAccountId = ref(0);
const comment = ref("");
const featureEqual = ref(false);
const featureCaseSensitive = ref(false);
const featureRegexp = ref(false);
const featureOnlyMinusAmounts = ref(false);
const groupByFirst = ref(0);
const groupBySecond = ref(0);
const orderBy = ref(0);
const moneyflowGroups = ref(new Map<string, MoneyflowGroup>());
const colBookingMonth = ref(false);
const colBookingYear = ref(false);
const colContractpartner = ref(false);
const dataLoaded = ref(false);

const receiptModal = useTemplateRef<typeof ReceiptModal>("receiptModal");
const deleteModal =
  useTemplateRef<typeof DeleteMoneyflowModalVue>("deleteModal");
const editModal = useTemplateRef<typeof EditMoneyflowModalVue>("editModal");
const listModal = useTemplateRef<typeof ListMoneyflowModal>("listModal");

const schema = {
  startDate: date(globErr(t("General.validation.startDate"))),
  endDate: date(globErr(t("General.validation.endDate"))),
  searchCriteria: ref(any() as ZodTypeAny),
};

watch(
  () => [contractpartnerId.value, postingAccountId.value, comment.value],
  () => {
    schema.searchCriteria.value = any().refine(
      () => contractpartnerId.value || postingAccountId.value || comment.value,
      t("Moneyflow.validation.oneSearchCriteria"),
    );
  },
);

type MoneyflowGroup = {
  sortString: string;
  month: number;
  monthString: string;
  year: number;
  contractpartnerName: string;
  amount: number;
  comment: Set<string>;
  commentString: string;
  moneyflows: Array<Moneyflow>;
};

const { handleSubmit, values, setFieldTouched } = useForm();

onMounted(() => {
  resetForm();
});

const resetForm = () => {
  const today = new Date();
  const beginOfYear = new Date();
  beginOfYear.setMonth(0);
  beginOfYear.setDate(1);

  startDate.value = beginOfYear;
  endDate.value = today;
  contractpartnerId.value = 0;
  postingAccountId.value = 0;
  comment.value = "";
  featureCaseSensitive.value = false;
  featureEqual.value = false;
  featureOnlyMinusAmounts.value = false;
  featureRegexp.value = false;
  groupByFirst.value = GROUP_YEAR;
  groupBySecond.value = GROUP_MONTH;
  orderBy.value = ORDER_GROUP;
  colBookingMonth.value = false;
  colBookingYear.value = false;
  colContractpartner.value = true;
  dataLoaded.value = false;
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const searchMoneyflows = handleSubmit(() => {
  dataLoaded.value = false;
  serverErrors.value = new Array<string>();
  if (startDate.value && endDate.value) {
    const searchParams: MoneyflowSearchParams = {
      startDate: startDate.value,
      endDate: endDate.value,
      searchString: comment.value.length > 0 ? comment.value : undefined,
      featureEqual: featureEqual.value,
      featureRegexp: featureRegexp.value,
      featureCaseSensitive: featureCaseSensitive.value,
      featureOnlyMinusAmounts: featureOnlyMinusAmounts.value,
      contractpartnerId:
        contractpartnerId.value > 0 ? contractpartnerId.value : undefined,
      postingAccountId:
        postingAccountId.value > 0 ? postingAccountId.value : undefined,
    };

    colBookingMonth.value =
      groupByFirst.value == GROUP_MONTH || groupBySecond.value == GROUP_MONTH;
    colBookingYear.value =
      !colBookingMonth.value &&
      (groupByFirst.value == GROUP_YEAR || groupBySecond.value == GROUP_YEAR);
    colContractpartner.value =
      groupByFirst.value == GROUP_CONTRACTPARTNER ||
      groupBySecond.value == GROUP_CONTRACTPARTNER;
    MoneyflowService.searchMoneyflows(searchParams)
      .then((moneyflows) => {
        if (moneyflows) {
          groupBy(moneyflows);
          makeCommentString();
          switch (orderBy.value) {
            case ORDER_GROUP: {
              moneyflowGroups.value = new Map(
                [...moneyflowGroups.value.entries()].sort((a, b) =>
                  a[1].sortString.localeCompare(b[1].sortString),
                ),
              );
              break;
            }
            case ORDER_COMMENT: {
              moneyflowGroups.value = new Map(
                [...moneyflowGroups.value.entries()].sort((a, b) =>
                  a[1].commentString.localeCompare(b[1].commentString),
                ),
              );
              break;
            }
            case ORDER_AMOUNT: {
              moneyflowGroups.value = new Map(
                [...moneyflowGroups.value.entries()].sort(
                  (a, b) => a[1].amount - b[1].amount,
                ),
              );
              break;
            }
          }

          dataLoaded.value = true;
        }
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});

const makeCommentString = () => {
  moneyflowGroups.value.forEach(
    (value) => (value.commentString = Array.from(value.comment).join(", ")),
  );
};

const groupBy = (moneyflows: Array<Moneyflow>) => {
  moneyflowGroups.value.clear();
  for (const moneyflow of moneyflows) {
    const groupByKey = getGroupByKey(moneyflow);
    let moneyflowGroup = moneyflowGroups.value.get(groupByKey);
    if (moneyflowGroup === undefined) {
      moneyflowGroup = initializeMoneyflowGroup(groupByKey, moneyflow);
    }
    moneyflowGroup.amount = toFixed(
      moneyflowGroup.amount + moneyflow.amount,
      2,
    );
    moneyflowGroup.comment.add(moneyflow.comment);
    moneyflowGroup.moneyflows.push(moneyflow);
  }
};

const initializeMoneyflowGroup = (
  groupByKey: string,
  moneyflow: Moneyflow,
): MoneyflowGroup => {
  const moneyflowGroup = {
    sortString: getSortString(moneyflow),
    amount: 0,
    comment: new Set<string>(),
    moneyflows: new Array<Moneyflow>(),
  } as MoneyflowGroup;

  for (let groupBy of [groupByFirst.value, groupBySecond.value]) {
    switch (groupBy) {
      case GROUP_CONTRACTPARTNER: {
        moneyflowGroup.contractpartnerName = String(
          moneyflow["contractpartnerName"],
        );
        break;
      }
      case GROUP_MONTH: {
        moneyflowGroup.month = moneyflow["bookingDate"].getMonth() + 1;
        moneyflowGroup.monthString = getMonthName(
          moneyflow["bookingDate"].getMonth() + 1,
        );
        break;
      }
      case GROUP_YEAR: {
        moneyflowGroup.year = moneyflow["bookingDate"].getFullYear();
        break;
      }
    }
  }
  moneyflowGroups.value.set(groupByKey, moneyflowGroup);
  return moneyflowGroup;
};

const getSortString = (moneyflow: Moneyflow): string => {
  let groupByKey = "";
  for (let groupBy of [groupByFirst.value, groupBySecond.value]) {
    switch (groupBy) {
      case GROUP_CONTRACTPARTNER: {
        groupByKey += String(moneyflow["contractpartnerName"]).toUpperCase();
        break;
      }
      case GROUP_MONTH: {
        let month = String(moneyflow["bookingDate"].getMonth() + 1);
        if (month.length === 1) groupByKey += "0";
        groupByKey += month;
        break;
      }
      case GROUP_YEAR: {
        groupByKey += String(moneyflow["bookingDate"].getFullYear());
        break;
      }
      default: {
        groupByKey += "";
        break;
      }
    }
    groupByKey += "-";
  }
  return groupByKey;
};

const getGroupByKey = (moneyflow: Moneyflow): string => {
  let groupByKey = "";
  for (let groupBy of [groupByFirst.value, groupBySecond.value]) {
    switch (groupBy) {
      case GROUP_CONTRACTPARTNER: {
        groupByKey += String(moneyflow["contractpartnerId"]);
        break;
      }
      case GROUP_MONTH: {
        let month = String(moneyflow["bookingDate"].getMonth() + 1);
        if (month.length === 1) groupByKey += "0";
        groupByKey += month;
        break;
      }
      case GROUP_YEAR: {
        groupByKey += String(moneyflow["bookingDate"].getFullYear());
        break;
      }
      default: {
        groupByKey += "";
        break;
      }
    }
    groupByKey += "-";
  }
  return groupByKey;
};
const showReceipt = (moneyflowId: number) => {
  receiptModal.value?._show(moneyflowId);
};
const deleteMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    deleteModal.value?._show(mmf);
  });
};

const editMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    editModal.value?._show(mmf);
  });
};
const listMoneyflow = (id: number) => {
  MoneyflowService.fetchMoneyflow(id).then((mmf) => {
    listModal.value?._show(mmf);
  });
};
</script>
