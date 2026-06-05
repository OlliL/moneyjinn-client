<template>
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("Moneyflow.title.search") }}</h4>
    </div>
    <div class="flex justify-center">
      <div class="w-full max-w-7xl card-panel p-4">
        <form @submit.prevent="searchMoneyflows" id="searchMoneyflowsForm">
          <div class="space-y-4">
            <DivError :server-errors="serverErrors" />

            <div
              class="grid grid-cols-2 gap-3 md:grid-cols-24 items-start text-left"
            >
              <div class="col-span-1 md:col-span-3">
                <InputDate
                  v-model="startDate"
                  :validation-schema="schema.startDate"
                  id="startDate"
                  :field-label="$t('General.startDate')"
                />
              </div>
              <div class="col-span-1 md:col-span-3">
                <InputDate
                  v-model="endDate"
                  :validation-schema="schema.endDate"
                  id="endDate"
                  :field-label="$t('General.endDate')"
                  picker-align="end"
                />
              </div>
              <div class="col-span-2 md:col-span-6">
                <InputStandard
                  v-model="comment"
                  :validation-schema-ref="schema.searchCriteria"
                  id="comment"
                  :field-label="$t('General.comment')"
                  :focus="true"
                />
              </div>
              <div class="col-span-2 md:col-span-6">
                <SelectContractpartner
                  v-model="contractpartnerId"
                  :validation-schema-ref="schema.searchCriteria"
                  id-suffix="SearchMoneyflows"
                  :field-label="$t('General.contractpartner')"
                />
              </div>
              <div class="col-span-2 md:col-span-6">
                <SelectPostingAccount
                  v-model="postingAccountId"
                  :validation-schema-ref="schema.searchCriteria"
                  id-suffix="SearchMoneyflows"
                  :field-label="$t('General.postingAccount')"
                />
              </div>
            </div>

            <div
              @click="mobileOptionsOpen = !mobileOptionsOpen"
              class="flex items-center justify-between p-3 cursor-pointer text-xs font-semibold text-muted-foreground md:hidden select-none border border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div class="flex items-center gap-2">
                <SlidersHorizontal class="icon-medium" />
                <span>{{ $t("General.displayOptions") }}</span>
              </div>
              <ChevronDown
                class="icon-medium transition-transform duration-200"
                :class="{ 'rotate-180': mobileOptionsOpen }"
              />
            </div>

            <div
              :class="{ block: mobileOptionsOpen, hidden: !mobileOptionsOpen }"
              class="md:block text-left"
            >
              <div
                class="grid grid-cols-1 gap-4 md:grid-cols-24 items-end border border-border rounded-xl p-3 md:border-none md:p-0 bg-muted/10 md:bg-transparent"
              >
                <div class="hidden md:block md:col-span-6 space-y-3 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    class="flex items-center justify-center gap-2 w-full"
                    @click="resetForm"
                  >
                    <Undo2 class="icon-medium" />
                    {{ $t("General.reset") }}
                  </Button>
                  <ButtonSubmit
                    :button-label="$t('Moneyflow.search')"
                    form-id="searchMoneyflowsForm"
                    test-id="search-moneyflows-submit"
                    class="flex w-full md:!w-full"
                  >
                    <template #icon><Search class="icon-medium" /></template>
                  </ButtonSubmit>
                </div>

                <div class="md:col-span-4">
                  <SelectStandard
                    v-model="groupByFirst"
                    id="groupByFirst"
                    :field-label="$t('Moneyflow.1stGroupingCriteria')"
                    :select-box-values="groupValues"
                  />
                </div>

                <div class="md:col-span-4">
                  <SelectStandard
                    v-model="groupBySecond"
                    id="groupBySecond"
                    :field-label="$t('Moneyflow.2ndGroupingCriteria')"
                    :select-box-values="groupValues"
                  />
                </div>

                <div class="md:col-span-4">
                  <SelectStandard
                    v-model="orderBy"
                    id="orderBy"
                    :field-label="$t('Moneyflow.orderBy')"
                    :select-box-values="orderValues"
                  />
                </div>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 md:col-span-6 md:pb-1 text-xs"
                >
                  <div class="space-y-2.5">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="featureEqual"
                        class="bg-background"
                        v-model:checked="featureEqual"
                      />
                      <Label for="featureEqual" class="cursor-pointer">
                        {{ $t("Moneyflow.equal") }}
                      </Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="featureCaseSensitive"
                        class="bg-background"
                        v-model:checked="featureCaseSensitive"
                      />
                      <Label for="featureCaseSensitive" class="cursor-pointer">
                        {{ $t("Moneyflow.caseSensitivity") }}
                      </Label>
                    </div>
                  </div>

                  <div class="space-y-2.5">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="featureRegexp"
                        class="bg-background"
                        v-model:checked="featureRegexp"
                      />
                      <Label for="featureRegexp" class="cursor-pointer">
                        {{ $t("Moneyflow.regexp") }}
                      </Label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="featureOnlyMinusAmounts"
                        class="bg-background"
                        v-model:checked="featureOnlyMinusAmounts"
                      />
                      <Label
                        for="featureOnlyMinusAmounts"
                        class="cursor-pointer"
                      >
                        {{ $t("Moneyflow.onlyNegative") }}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 md:hidden pt-2">
              <ButtonSubmit
                :button-label="$t('Moneyflow.search')"
                form-id="searchMoneyflowsForm"
                test-id="search-moneyflows-mobile-submit"
                class="flex w-full"
              >
                <template #icon><Search class="icon-medium" /></template>
              </ButtonSubmit>
              <Button
                type="button"
                variant="secondary"
                class="flex items-center justify-center gap-2 w-full"
                @click="resetForm"
              >
                <Undo2 class="icon-medium" />
                {{ $t("General.reset") }}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="flex justify-center w-full" v-if="dataLoaded">
      <template v-if="moneyflowGroups.size === 0">
        <div
          data-testid="search-moneyflows-empty"
          class="w-full text-center text-muted-foreground my-8"
        >
          {{ $t("General.noEntries") }}
        </div>
      </template>
      <template v-else>
        <div v-if="!desktop" class="w-full">
          <Accordion type="multiple" class="space-y-4">
            <SearchMoneyflowResultMobileGroup
              v-for="[index, moneyflowGroup] in moneyflowGroups"
              :key="index.toString()"
              :group-key="index.toString()"
              :moneyflow-group="moneyflowGroup"
              :col-booking-month="colBookingMonth"
              :col-booking-year="colBookingYear"
              :col-contractpartner="colContractpartner"
              :hide-contractpartner="searchContractpartnerId > 0"
            />
          </Accordion>
        </div>
        <div v-else class="w-full">
          <DivContentTable :alternate-row-background="false" class="w-full">
            <TableHeader>
              <TableRow>
                <TableHead class="table-head-cell w-12"></TableHead>

                <TableHead class="table-head-cell w-36" v-if="colBookingMonth">
                  {{ $t("Moneyflow.bookingMonth") }}
                </TableHead>

                <TableHead class="table-head-cell w-28" v-if="colBookingYear">
                  {{ $t("Moneyflow.bookingYear") }}
                </TableHead>

                <TableHead
                  class="table-head-cell w-48 !whitespace-normal"
                  v-if="colContractpartner"
                >
                  {{ $t("General.contractpartner") }}
                </TableHead>

                <TableHead class="table-head-cell w-28">
                  {{ $t("General.amount") }}
                </TableHead>

                <TableHead
                  class="font-bold text-foreground text-center !whitespace-normal"
                >
                  {{ $t("General.comment") }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SearchMoneyflowResultDesktopGroup
                v-for="[index, moneyflowGroup] in moneyflowGroups"
                :key="index.toString()"
                :moneyflow-group="moneyflowGroup"
                :col-booking-month="colBookingMonth"
                :col-booking-year="colBookingYear"
                :col-contractpartner="colContractpartner"
              />
            </TableBody>
          </DivContentTable>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useForm } from "vee-validate";
import { onMounted, provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { any, date, type ZodTypeAny } from "zod";

import ButtonSubmit from "@/components/common/ButtonSubmit.vue";
import DivContentTable from "@/components/common/DivContentTable.vue";
import DivError from "@/components/common/DivError.vue";
import InputDate from "@/components/common/InputDate.vue";
import InputStandard from "@/components/common/InputStandard.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import SelectContractpartner from "@/components/contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "@/components/postingaccount/SelectPostingAccount.vue";
import SearchMoneyflowResultDesktopGroup from "./elements/SearchMoneyflowResultDesktopGroup.vue";
import SearchMoneyflowResultMobileGroup from "./elements/SearchMoneyflowResultMobileGroup.vue";

import { toFixed } from "@/tools/math";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { getMonthName } from "@/tools/views/MonthName";
import { globErr } from "@/tools/views/ZodUtil";

import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import type { SelectBoxValue } from "@/model/SelectBoxValue";

import useDeleteMoneyflowModalStore from "@/components/moneyflow/DeleteMoneyflowModal.store";
import useEditMoneyflowModalStore from "@/components/moneyflow/EditMoneyflowModal.store";
import useListMoneyflowModalStore from "@/components/moneyflow/ListMoneyflowModal.store";
import useReceiptModalStore from "@/components/reports/ReceiptModal.store";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoneyflowRowActionsKey,
  type MoneyflowRowActions,
} from "@/model/CrudActions.ts";
import MoneyflowService from "@/service/MoneyflowService";
import { isDesktop } from "@/tools/views/IsDesktop";
import { ChevronDown, Search, SlidersHorizontal, Undo2 } from "lucide-vue-next";

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
const searchContractpartnerId = ref(0);

const mobileOptionsOpen = ref(false);
const desktop = isDesktop();
const { openDeleteMoneyflow } = useDeleteMoneyflowModalStore();
const { openEditMoneyflow } = useEditMoneyflowModalStore();
const { openListMoneyflow } = useListMoneyflowModalStore();
const { openListReceipt } = useReceiptModalStore();

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
  { immediate: true },
);

export type MoneyflowGroup = {
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
  searchContractpartnerId.value = 0;
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

const restartSearch = () => {
  searchMoneyflows();
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

          searchContractpartnerId.value = contractpartnerId.value;
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

const actions: MoneyflowRowActions = {
  list: (mmf: Moneyflow) =>
    MoneyflowService.fetchMoneyflow(mmf.id).then((freshMmf) => {
      openListMoneyflow(freshMmf, undefined, openListReceipt);
    }),
  edit: (mmf: Moneyflow) =>
    MoneyflowService.fetchMoneyflow(mmf.id).then((freshMmf) => {
      openEditMoneyflow(freshMmf, undefined, restartSearch, openListReceipt);
    }),
  delete: (mmf: Moneyflow) =>
    MoneyflowService.fetchMoneyflow(mmf.id).then((freshMmf) => {
      openDeleteMoneyflow(freshMmf, restartSearch);
    }),
  receipt: (id: number) => openListReceipt(id),
};

provide(MoneyflowRowActionsKey, actions);
</script>
