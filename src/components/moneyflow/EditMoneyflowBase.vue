<template>
  <DivError :server-errors="serverErrors" />

  <div class="grid grid-cols-2 md:grid-cols-12 gap-4 mb-4">
    <div class="col-span-1 md:col-span-2">
      <InputDate
        v-model="mmf.bookingDate"
        :validation-schema="schema.bookingDate"
        :id="'bookingDate' + idSuffix"
        :field-label="$t('Moneyflow.bookingdate')"
      />
    </div>
    <div class="col-span-1 md:col-span-2">
      <InputDate
        v-model="mmf.invoiceDate"
        :validation-schema="schema.invoiceDate"
        :id="'invoiceDate' + idSuffix"
        :field-label="$t('Moneyflow.invoicedate')"
      />
    </div>
    <div class="col-span-2 md:col-span-4">
      <SelectContractpartner
        v-model="mmf.contractpartnerId"
        :validation-schema="schema.contractpartnerId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        :field-label="$t('General.contractpartner')"
        :validity-date="validityDate"
      />
    </div>
    <div class="col-span-2 md:col-span-4">
      <SelectCapitalsource
        v-model="mmf.capitalsourceId"
        :validation-schema="schema.capitalsourceId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        :field-label="$t('General.capitalsource')"
        :validity-date="validityDate"
      />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start mb-4">
    <div class="md:col-span-2">
      <InputStandard
        v-model="amount"
        :validation-schema="schema.amount"
        :id="'amount' + idSuffix"
        field-type="number"
        step="0.01"
        :field-label="$t('General.amount')"
        :focus="true"
      >
        <template #icon><Euro class="icon-small" /></template>
      </InputStandard>
    </div>

    <template v-if="showMoneyflowFields">
      <div
        class="md:col-span-10 flex flex-col md:flex-row items-start gap-4 w-full"
      >
        <div class="flex-1 w-full">
          <InputStandard
            v-model="mmf.comment"
            :validation-schema-ref="schema.comment"
            :id="'comment' + idSuffix"
            :field-label="$t('General.comment')"
            name="comment"
          />
        </div>

        <div class="w-full md:w-4/12 shrink-0">
          <SelectPostingAccount
            v-model="mmf.postingAccountId"
            :validation-schema-ref="schema.postingAccountId"
            :id-suffix="'CreateMoneyflow' + idSuffix"
            :field-label="$t('General.postingAccount')"
          />
        </div>

        <div class="shrink-0 w-full md:w-auto">
          <div class="grid gap-1.5 relative justify-items-start w-full">
            <Label
              for="toggles"
              class="text-left ml-1 text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ $t("Moneyflow.options") }}
            </Label>

            <div
              class="grid grid-cols-2 md:flex items-center gap-2 h-8 w-full md:w-auto"
              id="toggles"
            >
              <ToggleGroup
                type="single"
                class="border border-input bg-muted inline-flex h-8 rounded-md overflow-hidden p-0 items-stretch w-full md:w-auto"
                :model-value="mmf.private ? 'private' : 'public'"
                @update:model-value="
                  (val: any) => val && (mmf.private = val === 'private')
                "
              >
                <ToggleGroupItem
                  value="public"
                  class="text-xs font-medium h-full px-3 flex-1 md:flex-initial transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground border-r border-input last:border-r-0"
                >
                  {{ $t("Moneyflow.public") }}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="private"
                  class="text-xs font-medium h-full px-3 flex-1 md:flex-initial transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground"
                >
                  {{ $t("Moneyflow.private") }}
                </ToggleGroupItem>
              </ToggleGroup>

              <ToggleGroup
                type="single"
                class="border border-input bg-muted inline-flex h-8 rounded-md overflow-hidden p-0 items-stretch w-full md:w-auto"
                :model-value="saveAsPreDefMoneyflow ? 'favorite' : 'once'"
                @update:model-value="
                  (val: any) =>
                    val && (saveAsPreDefMoneyflow = val === 'favorite')
                "
              >
                <ToggleGroupItem
                  value="once"
                  class="text-xs font-medium h-full px-3 flex-1 md:flex-initial transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground border-r border-input last:border-r-0"
                >
                  {{ toggleTextOff }}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="favorite"
                  class="text-xs font-medium h-full px-3 flex-1 md:flex-initial transition-all rounded-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground border-r border-input last:border-r-0"
                >
                  {{ toggleTextOn }}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="md:col-span-10"></div>
  </div>

  <div class="w-full mb-4">
    <div class="rounded-sm border bg-muted/30 overflow-hidden">
      <div class="px-4 py-3 border-b text-left">
        <button
          type="button"
          class="text-sm font-medium text-primary hover:underline bg-transparent border-none p-0"
          :id="'mseContainer' + idSuffix"
          :data-testid="'subbookingToggle' + idSuffix"
          @click="isExpanded = !isExpanded"
        >
          {{ $t("Moneyflow.subbooking") }}
        </button>
      </div>

      <div
        v-show="isExpanded"
        :id="'collapseSplitEntries' + idSuffix"
        :data-testid="'collapseSplitEntries' + idSuffix"
        :class="[
          'transition-all animate-in fade-in duration-200 bg-white',
          isExpanded ? 'show' : 'collapse',
        ]"
      >
        <div class="p-4 !bg-muted/50">
          <EditMoneyflowBaseSplitEntryRowVue
            v-for="(mse, index) in mmf.moneyflowSplitEntries"
            :key="mse.id"
            :amount="mse.amount"
            :comment="mse.comment"
            :moneyflowComment="mmf.comment"
            :moneyflowPostingAccountId="mmf.postingAccountId"
            :posting-account-id="mse.postingAccountId"
            :is-last-row="index + 1 === mmf.moneyflowSplitEntries?.length"
            :index="index"
            :remainder="mseRemainder"
            :remainder-is-valid="mseRemainderIsValid"
            :id-suffix="idSuffix + '#' + mse.id"
            @delete-moneyflow-split-entry-row="onDeleteMoneyflowSplitEntryRow"
            @add-moneyflow-split-entry-row="onAddMoneyflowSplitEntryRow"
            @amount-changed="onMoneyflowSplitEntryRowAmountChanged"
            @comment-changed="onMoneyflowSplitEntryRowCommentChanged"
            @posting-account-id-changed="
              onMoneyflowSplitEntryRowPostingAccountIdChanged
            "
          />
          <div class="flex justify-start mt-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-testid="addMoneyflowSplitEntryRowButton"
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary transition-colors h-9 px-3 gap-2"
              @click="onAddMoneyflowSplitEntryRow"
            >
              <Plus class="icon-small shrink-0" />
              <span>{{ $t("Moneyflow.addPosition") }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EditMoneyflowBaseSplitEntryRowVue from "@/components/moneyflow/EditMoneyflowBaseSplitEntryRow.vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import MoneyflowService from "@/service/MoneyflowService";
import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { toFixed } from "@/tools/math";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { Euro, Plus } from "lucide-vue-next";
import { computed, onMounted, ref, toRaw, watch, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, string } from "zod";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import DivError from "../common/DivError.vue";
import InputDate from "../common/InputDate.vue";
import InputStandard from "../common/InputStandard.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

const isExpanded = ref(false);

const { t } = useI18n();

const schema = {
  amount: amountSchema(t("Moneyflow.validation.amount")),
  bookingDate: date(globErr(t("Moneyflow.validation.bookingDate"))),
  invoiceDate: date().optional(),
  contractpartnerId: number(
    globErr(t("Moneyflow.validation.contractpartnerId")),
  ).gt(0),
  comment: computed(() =>
    showMoneyflowFields.value
      ? string(globErr(t("Moneyflow.validation.comment")))
          .min(1)
          .max(100, t("Moneyflow.validation.length.comment"))
      : string().optional(),
  ),
  postingAccountId: computed(() =>
    showMoneyflowFields.value
      ? number(globErr(t("Moneyflow.validation.postingAccountId"))).gt(0)
      : number().optional(),
  ),
  capitalsourceId: number(globErr(t("General.validation.capitalsource"))).gt(0),
};

const serverErrors = ref(new Array<string>());
const mmf = ref({} as Moneyflow);
const amount = ref(undefined as number | undefined);
const previousCommentSetByContractpartnerDefaults = ref("");
const previousPostingAccountSetByContractpartnerDefaults = ref(0);
const preDefMoneyflowId = ref(0);
const saveAsPreDefMoneyflow = ref(false);
const toggleTextOffNoPreDefMoneyflow = ref(t("Moneyflow.once"));
const toggleTextOnNoPreDefMoneyflow = ref(t("Moneyflow.favorite"));
const toggleTextOffPreDefMoneyflow = ref(t("Moneyflow.keep"));
const toggleTextOnPreDefMoneyflow = ref(t("Moneyflow.renew"));
const toggleTextOff = ref("");
const toggleTextOn = ref("");
const mseRemainderIsValid = ref(undefined as boolean | undefined);
const showMoneyflowFields = ref(true);
const originalMoneyflowSplitEntryIds = ref(new Array<number>());
const contractpartnerStore = useContractpartnerStore();
const capitalsourceStore = useCapitalsourceStore();

const props = defineProps({
  mmfToEdit: {
    type: Object as PropType<Moneyflow>,
    required: false,
  },
  selectedPreDefMoneyflow: {
    type: Object as PropType<PreDefMoneyflow>,
    required: false,
  },
  idSuffix: {
    type: String,
    default: "",
  },
  fillContractpartnerDefaults: {
    type: Boolean,
    default: false,
  },
});
onMounted(() => {
  if (props.fillContractpartnerDefaults) resetForm();
});

watch(
  () => props.selectedPreDefMoneyflow,
  (newVal, oldVal) => {
    if (newVal !== oldVal) selectPreDefMoneyflow(newVal);
  },
);

watch(
  () => mmf.value.contractpartnerId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) onContractpartnerSelected(newVal);
  },
);

const formIsValid = computed(() => {
  const isValid = mseRemainderIsValid.value;
  if (isValid === null || isValid === undefined || isValid === true) {
    return true;
  }
  return false;
});

const validityDate = computed(() => {
  if (mmf.value.invoiceDate) {
    return mmf.value.invoiceDate;
  } else if (mmf.value.bookingDate) {
    return mmf.value.bookingDate;
  } else {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }
});
const mseRemainder = computed(() => {
  // avoid floating arithmetic problems by using fixed point arithmetics
  let remainder = 0;
  if (amount.value) {
    remainder = toFixed(amount.value, 2);
    if (mmf.value.moneyflowSplitEntries != undefined) {
      for (const mse of mmf.value.moneyflowSplitEntries) {
        if (mse.amount) remainder = toFixed(remainder - mse.amount, 2);
      }
    }
  }
  return remainder;
});

const resetForm = () => {
  if (props.mmfToEdit?.bookingDate) {
    resetEditForm();
  } else {
    resetCreateForm();
  }
  serverErrors.value = new Array<string>();
  mseRemainderIsValid.value = undefined;

  saveAsPreDefMoneyflow.value = false;
  preDefMoneyflowId.value = 0;

  toggleTextOff.value = toggleTextOffNoPreDefMoneyflow.value;
  toggleTextOn.value = toggleTextOnNoPreDefMoneyflow.value;
};

const resetEditForm = () => {
  mmf.value = structuredClone(toRaw(props.mmfToEdit))!;

  amount.value = mmf.value.amount;

  // set correct defaults for imported moneyflows
  if (mmf.value.comment === undefined) mmf.value.comment = "";
  if (mmf.value.postingAccountId === undefined) mmf.value.postingAccountId = 0;

  originalMoneyflowSplitEntryIds.value = new Array<number>();
  if (props.fillContractpartnerDefaults && mmf.value.contractpartnerId > 0) {
    if (mmf.value.comment === "")
      previousCommentSetByContractpartnerDefaults.value = mmf.value.comment;
    if (mmf.value.postingAccountId === 0)
      previousPostingAccountSetByContractpartnerDefaults.value =
        mmf.value.postingAccountId;

    onContractpartnerSelected(mmf.value.contractpartnerId);
  } else {
    previousCommentSetByContractpartnerDefaults.value = "";
    previousPostingAccountSetByContractpartnerDefaults.value = 0;
  }

  if (mmf.value.moneyflowSplitEntries == undefined) {
    mmf.value.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
    addNewMoneyflowSplitEntryRow();
    addNewMoneyflowSplitEntryRow();
    isExpanded.value = false;
  } else {
    for (let mse of mmf.value.moneyflowSplitEntries) {
      originalMoneyflowSplitEntryIds.value.push(mse.id);
    }
    addNewMoneyflowSplitEntryRow();
    isExpanded.value = true;
  }
  toggleMoneyflowFieldsForMse();
};

const setCapitalsourceForCreateMode = (date: Date) => {
  const mcs = capitalsourceStore
    .getBookableValidCapitalsources(date)
    .find((mcs) => mcs.state === CapitalsourceState.CASH);
  if (mcs) {
    mmf.value.capitalsourceId = mcs.id;
    mmf.value.capitalsourceComment = mcs.comment;
  } else {
    mmf.value.capitalsourceId = 0;
    mmf.value.capitalsourceComment = "";
  }
};

watch(
  () => capitalsourceStore.capitalsource,
  () => {
    // watch because websocket driven stores might get initialized too late
    // in this case, capitalsourceId is not set
    if (!mmf.value.capitalsourceId) {
      const bookingDate = new Date();
      bookingDate.setHours(0, 0, 0, 0);
      setCapitalsourceForCreateMode(bookingDate);
    }
  },
);

const resetCreateForm = () => {
  amount.value = undefined;

  const bookingDate = new Date();
  bookingDate.setHours(0, 0, 0, 0);
  mmf.value.bookingDate = bookingDate;
  mmf.value.invoiceDate = undefined;
  mmf.value.contractpartnerId = 0;
  mmf.value.contractpartnerName = "";

  setCapitalsourceForCreateMode(bookingDate);

  mmf.value.postingAccountId = 0;
  mmf.value.postingAccountName = "";
  mmf.value.comment = "";
  mmf.value.private = false;

  mmf.value.moneyflowSplitEntries = new Array<MoneyflowSplitEntry>();
  addNewMoneyflowSplitEntryRow();
  addNewMoneyflowSplitEntryRow();
  showMoneyflowFields.value = true;

  previousCommentSetByContractpartnerDefaults.value = "";
  previousPostingAccountSetByContractpartnerDefaults.value = 0;
};

/*
 * Moneyflow Split Entry handling
 */
const addNewMoneyflowSplitEntryRow = () => {
  if (mmf.value.moneyflowSplitEntries !== undefined) {
    const mse = mmf.value.moneyflowSplitEntries;
    const lastMse = mse[mse.length - 1];
    let newMseId = -1;
    if (lastMse) {
      // existing MoneyflowSplitEntries have positive IDs, new created rows must always have negative IDs
      newMseId = Math.abs(lastMse.id) * -1 - 1;
    }
    const newMse = {
      id: newMseId,
      moneyflowId: mmf.value.id,
      amount: 0,
      comment: "",
      postingAccountId: 0,
    } as MoneyflowSplitEntry;
    mse.push(newMse);
  }
};
const onDeleteMoneyflowSplitEntryRow = (index: number) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    if (mse.length === 2) {
      addNewMoneyflowSplitEntryRow();
    }
    mse.splice(index, 1);
    validateMseRemainder();
    toggleMoneyflowFieldsForMse();
  }
};
const onAddMoneyflowSplitEntryRow = () => {
  addNewMoneyflowSplitEntryRow();
};
const onMoneyflowSplitEntryRowAmountChanged = (
  index: number,
  amount: number,
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined && mse[index]) {
    mse[index]["amount"] = amount;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const onMoneyflowSplitEntryRowCommentChanged = (
  index: number,
  comment: string,
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined && mse[index]) {
    mse[index]["comment"] = comment;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const onMoneyflowSplitEntryRowPostingAccountIdChanged = (
  index: number,
  postingAccountId: number,
  postingAccountName: string,
) => {
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined && mse[index]) {
    mse[index]["postingAccountId"] = postingAccountId;
    mse[index]["postingAccountName"] = postingAccountName;
  }
  validateMseRemainder();
  toggleMoneyflowFieldsForMse();
};
const toggleMoneyflowFieldsForMse = () => {
  showMoneyflowFields.value = allMseRowsAreEmpty();
};
const allMseRowsAreEmpty = (): boolean => {
  let allMseRowsAreEmpty = true;
  const mse = mmf.value.moneyflowSplitEntries;
  if (mse !== undefined) {
    for (let entry of mse) {
      if (
        entry.amount !== 0 ||
        entry.comment != "" ||
        entry.postingAccountId !== 0
      ) {
        allMseRowsAreEmpty = false;
        break;
      }
    }
  }
  return allMseRowsAreEmpty;
};
const validateMseRemainder = () => {
  if (allMseRowsAreEmpty() || mseRemainder.value === 0) {
    mseRemainderIsValid.value = undefined;
  } else {
    mseRemainderIsValid.value = false;
  }
};
/*
 * Moneyflow handling
 */

const onContractpartnerSelected = (contractpartnerId: number) => {
  const contractpartner =
    contractpartnerStore.getContractpartner(contractpartnerId);
  if (contractpartner) {
    contractpartnerSelected(contractpartner);
  } else {
    noContractpartnerSelected();
  }
};

const contractpartnerSelected = (contractpartner: Contractpartner) => {
  mmf.value.contractpartnerId = contractpartner.id;
  mmf.value.contractpartnerName = contractpartner.name;
  if (mmf.value.comment === previousCommentSetByContractpartnerDefaults.value) {
    const mcpComment = contractpartner.moneyflowComment;
    if (mcpComment) {
      mmf.value.comment = mcpComment;
      previousCommentSetByContractpartnerDefaults.value = mcpComment;
    }
  }
  if (
    mmf.value.postingAccountId ===
    previousPostingAccountSetByContractpartnerDefaults.value
  ) {
    const mpaId = contractpartner.postingAccountId
      ? contractpartner.postingAccountId
      : 0;

    mmf.value.postingAccountId = mpaId;
    previousPostingAccountSetByContractpartnerDefaults.value = mpaId;
  }
};

const noContractpartnerSelected = () => {
  mmf.value.contractpartnerId = 0;
  mmf.value.contractpartnerName = "";
  if (mmf.value.comment === previousCommentSetByContractpartnerDefaults.value) {
    mmf.value.comment = "";
    previousCommentSetByContractpartnerDefaults.value = "";
  }
  if (
    mmf.value.postingAccountId ===
    previousPostingAccountSetByContractpartnerDefaults.value
  ) {
    mmf.value.postingAccountId = 0;
    previousPostingAccountSetByContractpartnerDefaults.value = 0;
  }
};

const selectPreDefMoneyflow = (
  preDefMoneyflow: PreDefMoneyflow | undefined,
) => {
  if (preDefMoneyflow === undefined) {
    resetForm();
  } else if (preDefMoneyflow) {
    amount.value = preDefMoneyflow.amount;

    // Determine what the contractpartnerId-watcher would auto-fill for comment/postingAccount.
    // By pre-setting previousComment/PostingAccount to those auto-fill values we ensure
    // the watcher guard ("only overwrite if the user hasn't changed the value") treats the
    // PreDefMoneyflow values as "manually entered" and does NOT overwrite them.
    const contractpartner = contractpartnerStore.getContractpartner(
      preDefMoneyflow.contractpartnerId,
    );
    previousCommentSetByContractpartnerDefaults.value =
      contractpartner?.moneyflowComment ?? "";
    previousPostingAccountSetByContractpartnerDefaults.value =
      contractpartner?.postingAccountId ?? 0;

    mmf.value.contractpartnerId = preDefMoneyflow.contractpartnerId;
    mmf.value.comment = preDefMoneyflow.comment;
    mmf.value.postingAccountId = preDefMoneyflow.postingAccountId;
    mmf.value.capitalsourceId = preDefMoneyflow.capitalsourceId;

    toggleTextOff.value = toggleTextOffPreDefMoneyflow.value;
    toggleTextOn.value = toggleTextOnPreDefMoneyflow.value;
    preDefMoneyflowId.value = preDefMoneyflow.id;
  }
};

const prepareServerCall = (): boolean => {
  prepareServerCallSplitEntries();

  if (formIsValid.value) {
    if (amount.value) mmf.value.amount = amount.value;
    // remove empty rows
    if (mmf.value.moneyflowSplitEntries) {
      mmf.value.moneyflowSplitEntries = mmf.value.moneyflowSplitEntries.filter(
        (mse) => mse.amount && mse.comment && mse.postingAccountId,
      );
    }
    return true;
  }
  return false;
};

const prepareServerCallSplitEntries = () => {
  validateMseRemainder();
  if (!allMseRowsAreEmpty() && mmf.value.moneyflowSplitEntries) {
    let mse = {} as MoneyflowSplitEntry;
    for (let filledMse of mmf.value.moneyflowSplitEntries) {
      if (filledMse.comment && filledMse.postingAccountId) {
        mse = filledMse;
        break;
      }
    }
    if (!mmf.value.comment) {
      mmf.value.comment = mse.comment;
    }
    if (!mmf.value.postingAccountId) {
      mmf.value.postingAccountId = mse.postingAccountId;
    }
  }
};

const followUpServerCall = () => {
  if (mmf.value.moneyflowSplitEntries) {
    while (mmf.value.moneyflowSplitEntries.length < 2) {
      addNewMoneyflowSplitEntryRow();
    }
  }
};

const importImportedMoneyflow = async (
  mim: ImportedMoneyflow,
): Promise<boolean> => {
  if (prepareServerCall()) {
    const importedMoneyflow: ImportedMoneyflow = {
      ...mmf.value,
      accountNumber: mim.accountNumber,
      bankCode: mim.bankCode,
      externalid: mim.externalid,
      name: mim.name,
      usage: mim.usage,
      accountNumberCapitalsource: mim.accountNumberCapitalsource,
      bankCodeCapitalsource: mim.bankCodeCapitalsource,
    };

    return ImportedMoneyflowService.importImportedMoneyflow(importedMoneyflow)
      .then(() => {
        followUpServerCall();
        return true;
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
        return false;
      });
  }
  return false;
};
const deleteImportedMoneyflow = async (id: number): Promise<boolean> => {
  return ImportedMoneyflowService.deleteImportedMoneyflow(id)
    .then(() => {
      return true;
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      return false;
    });
};
const createMoneyflow = async (): Promise<boolean> => {
  if (prepareServerCall()) {
    return MoneyflowService.createMoneyflow(
      mmf.value,
      preDefMoneyflowId.value,
      saveAsPreDefMoneyflow.value,
    )
      .then(() => {
        followUpServerCall();
        return true;
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
        return false;
      });
  }
  return false;
};
const updateMoneyflow = async (): Promise<Moneyflow | undefined> => {
  if (prepareServerCall()) {
    const createMses = new Array<MoneyflowSplitEntry>();
    const updateMses = new Array<MoneyflowSplitEntry>();
    const updateMseIds = new Array<number>();
    if (mmf.value.moneyflowSplitEntries) {
      for (let mse of mmf.value.moneyflowSplitEntries) {
        if (mse.id < 0) {
          createMses.push(mse);
        } else {
          updateMses.push(mse);
          updateMseIds.push(mse.id);
        }
      }
    }
    const deleteMseIds = originalMoneyflowSplitEntryIds.value.filter(
      (mseId) => !updateMseIds.includes(mseId),
    );

    return MoneyflowService.updateMoneyflow(
      mmf.value,
      createMses,
      updateMses,
      deleteMseIds,
    )
      .then((mmf) => {
        followUpServerCall();
        return mmf;
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
        return undefined;
      });
  }
  return undefined;
};

watch(
  () => props.mmfToEdit,
  (newVal, oldVal) => {
    if (newVal !== oldVal) resetForm();
  },
  { immediate: true },
);

defineExpose({
  createMoneyflow,
  updateMoneyflow,
  resetForm,
  importImportedMoneyflow,
  deleteImportedMoneyflow,
});
</script>
