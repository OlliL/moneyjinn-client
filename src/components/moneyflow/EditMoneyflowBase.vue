<template>
  <DivError :server-errors="serverErrors" />
  <div class="row no-gutters flex-lg-nowrap mb-2">
    <div class="col-md-2 col-xs-12 mb-2">
      <InputDate
        v-model="mmf.bookingDate"
        :validation-schema="schema.bookingDate"
        :id="'bookingDate' + idSuffix"
        :field-label="$t('Moneyflow.bookingdate')"
      />
    </div>
    <div class="col-md-2 col-xs-12 mb-2">
      <InputDate
        v-model="mmf.invoiceDate"
        :validation-schema="schema.invoiceDate"
        :id="'invoiceDate' + idSuffix"
        :field-label="$t('Moneyflow.invoicedate')"
      />
    </div>
    <div class="col-md-4 col-xs-12 mb-2">
      <SelectContractpartner
        v-model="mmf.contractpartnerId"
        :validation-schema="schema.contractpartnerId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        :field-label="$t('General.contractpartner')"
        :validity-date="validityDate"
      />
    </div>

    <div class="col-md-4 col-xs-12 mb-2">
      <SelectCapitalsource
        v-model="mmf.capitalsourceId"
        :validation-schema="schema.capitalsourceId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        :field-label="$t('General.capitalsource')"
        :validity-date="validityDate"
      />
    </div>
  </div>

  <div class="row no-gutters flex-lg-nowrap mb-2">
    <div class="col-md-2 col-xs-12 mb-2">
      <InputStandard
        v-model="amount"
        :validation-schema="schema.amount"
        :id="'amount' + idSuffix"
        field-type="number"
        step="0.01"
        :field-label="$t('General.amount')"
        :focus="true"
      >
        <template #icon
          ><span class="input-group-text"
            ><i class="bi bi-currency-euro"></i></span
        ></template>
      </InputStandard>
    </div>
    <div class="col-md-7" v-show="!showMoneyflowFields"></div>
    <div class="col-md-4 col-xs-12 mb-2" v-show="showMoneyflowFields">
      <InputStandard
        v-model="mmf.comment"
        :validation-schema-ref="schema.comment"
        :id="'comment' + idSuffix"
        :field-label="$t('General.comment')"
        name="comment"
      />
    </div>
    <div class="col-md-3 col-xs-12 mb-2" v-show="showMoneyflowFields">
      <SelectPostingAccount
        v-model="mmf.postingAccountId"
        :validation-schema-ref="schema.postingAccountId"
        :id-suffix="'CreateMoneyflow' + idSuffix"
        :field-label="$t('General.postingAccount')"
      />
    </div>
    <div
      class="col-md-3 col-xs-12 mb-2 d-flex align-items-center justify-content-center"
    >
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'public' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="false"
        />
        <label class="btn btn-outline-success" :for="'public' + idSuffix"
          ><small> {{ $t("Moneyflow.public") }}</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="public-private"
          :id="'private' + idSuffix"
          autocomplete="off"
          v-model="mmf.private"
          :value="true"
        />
        <label class="btn btn-outline-danger" :for="'private' + idSuffix"
          ><small>{{ $t("Moneyflow.private") }}</small></label
        >
      </div>
      <div class="btn-group mx-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'once' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="false"
        />
        <label class="btn btn-outline-secondary" :for="'once' + idSuffix"
          ><small>{{ toggleTextOff }}</small></label
        >

        <input
          type="radio"
          class="btn-check"
          name="once-favorite"
          :id="'favorite' + idSuffix"
          autocomplete="off"
          v-model="saveAsPreDefMoneyflow"
          :value="true"
        />
        <label class="btn btn-outline-primary" :for="'favorite' + idSuffix"
          ><small>{{ toggleTextOn }}</small></label
        >
      </div>
    </div>
  </div>

  <div class="row no-gutters flex-lg-nowrap mb-4">
    <div class="col-12">
      <div class="card w-100 bg-light d-none d-lg-block">
        <div class="card-header text-start">
          <a
            data-bs-toggle="collapse"
            :href="'#collapseSplitEntries' + idSuffix"
            :id="'mseContainer' + idSuffix"
            ref="mseContainer"
            >{{ $t("Moneyflow.subbooking") }}</a
          >
        </div>
        <div class="collapse" :id="'collapseSplitEntries' + idSuffix">
          <div class="card-body">
            <EditMoneyflowBaseSplitEntryRowVue
              v-for="(mse, index) in mmf.moneyflowSplitEntries"
              ref="mseRow"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch, type PropType } from "vue";
import { useI18n } from "vue-i18n";
import { date, number, string } from "zod";

import DivError from "../DivError.vue";
import EditMoneyflowBaseSplitEntryRowVue from "@/components/moneyflow/EditMoneyflowBaseSplitEntryRow.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import SelectContractpartner from "../contractpartner/SelectContractpartner.vue";
import SelectCapitalsource from "../capitalsource/SelectCapitalsource.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

import { useCapitalsourceStore } from "@/stores/CapitalsourceStore";
import { useContractpartnerStore } from "@/stores/ContractpartnerStore";

import { amountSchema, globErr } from "@/tools/views/ZodUtil";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { toFixed } from "@/tools/math";

import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";

import MoneyflowControllerHandler from "@/handler/MoneyflowControllerHandler";
import ImportedMoneyflowControllerHandler from "@/handler/ImportedMoneyflowControllerHandler";

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
const mseRow = ref();
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
  () => props.mmfToEdit,
  (newVal, oldVal) => {
    if (newVal !== oldVal) resetForm();
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
  if (props.mmfToEdit && props.mmfToEdit.bookingDate) {
    Object.assign(mmf.value, props.mmfToEdit);

    amount.value = mmf.value.amount;

    // set correct defaults for imported moneyflows
    if (mmf.value.comment === undefined) mmf.value.comment = "";
    if (mmf.value.postingAccountId === undefined)
      mmf.value.postingAccountId = 0;

    originalMoneyflowSplitEntryIds.value = new Array<number>();
    if (props.fillContractpartnerDefaults && mmf.value.contractpartnerId > 0) {
      previousCommentSetByContractpartnerDefaults.value = mmf.value.comment;
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
      document.getElementById("collapseSplitEntries")?.classList.remove("show");
    } else {
      for (let mse of mmf.value.moneyflowSplitEntries) {
        originalMoneyflowSplitEntryIds.value.push(mse.id);
      }
      addNewMoneyflowSplitEntryRow();
      document.getElementById("collapseSplitEntries")?.classList.add("show");
    }
    toggleMoneyflowFieldsForMse();
  } else {
    amount.value = undefined;

    const bookingDate = new Date();
    bookingDate.setHours(0, 0, 0, 0);
    mmf.value.bookingDate = bookingDate;
    mmf.value.invoiceDate = undefined;
    mmf.value.contractpartnerId = 0;
    mmf.value.contractpartnerName = "";

    const capitalsources = capitalsourceStore
      .getBookableValidCapitalsources(bookingDate)
      .filter((mcs) => (mcs.state = CapitalsourceState.CACHE));

    if (capitalsources && capitalsources.length > 0) {
      const mcs = capitalsources[0];
      mmf.value.capitalsourceId = mcs.id;
      mmf.value.capitalsourceComment = mcs.comment;
    } else {
      mmf.value.capitalsourceId = 0;
      mmf.value.capitalsourceComment = "";
    }

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
  }
  serverErrors.value = new Array<string>();
  mseRemainderIsValid.value = undefined;

  saveAsPreDefMoneyflow.value = false;
  preDefMoneyflowId.value = 0;

  toggleTextOff.value = toggleTextOffNoPreDefMoneyflow.value;
  toggleTextOn.value = toggleTextOnNoPreDefMoneyflow.value;
};
/*
 * Moneyflow Split Entry handling
 */
const addNewMoneyflowSplitEntryRow = () => {
  if (mmf.value.moneyflowSplitEntries !== undefined) {
    const mse = mmf.value.moneyflowSplitEntries;
    const mseLength = mse.length;
    let newMseId = -1;
    if (mseLength > 0) {
      // existing MoneyflowSplitEntries have positive IDs, new created rows must always have negative IDs
      newMseId =
        Math.abs(mmf.value.moneyflowSplitEntries[mseLength - 1].id) * -1 - 1;
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
  if (mse !== undefined) {
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
  if (mse !== undefined) {
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
  if (mse !== undefined) {
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
    mmf.value.contractpartnerId = contractpartner.id;
    mmf.value.contractpartnerName = contractpartner.name;
    if (
      mmf.value.comment === previousCommentSetByContractpartnerDefaults.value
    ) {
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
  } else {
    mmf.value.contractpartnerId = 0;
    mmf.value.contractpartnerName = "";
    if (
      mmf.value.comment === previousCommentSetByContractpartnerDefaults.value
    ) {
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
  }
};

const selectPreDefMoneyflow = (
  preDefMoneyflow: PreDefMoneyflow | undefined,
) => {
  if (preDefMoneyflow === undefined) {
    resetForm();
  } else {
    if (preDefMoneyflow) {
      amount.value = preDefMoneyflow.amount;
      mmf.value.contractpartnerId = preDefMoneyflow.contractpartnerId;
      mmf.value.comment = preDefMoneyflow.comment;
      mmf.value.postingAccountId = preDefMoneyflow.postingAccountId;
      mmf.value.capitalsourceId = preDefMoneyflow.capitalsourceId;

      toggleTextOff.value = toggleTextOffPreDefMoneyflow.value;
      toggleTextOn.value = toggleTextOnPreDefMoneyflow.value;
      preDefMoneyflowId.value = preDefMoneyflow.id;
    }
  }
};

const prepareServerCall = (): boolean => {
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

const followUpServerCall = () => {
  if (mmf.value.moneyflowSplitEntries) {
    while (mmf.value.moneyflowSplitEntries.length < 2) {
      addNewMoneyflowSplitEntryRow();
    }
  }
};

const importImportedMoneyflow = async (
  mim: ImportedMoneyflow,
): Promise<Boolean> => {
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

    return ImportedMoneyflowControllerHandler.importImportedMoneyflow(
      importedMoneyflow,
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
  return Promise.resolve(false);
};
const deleteImportedMoneyflow = async (id: number): Promise<Boolean> => {
  return ImportedMoneyflowControllerHandler.deleteImportedMoneyflow(id)
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
    return MoneyflowControllerHandler.createMoneyflow(
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
  return Promise.resolve(false);
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

    return MoneyflowControllerHandler.updateMoneyflow(
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

defineExpose({
  createMoneyflow,
  updateMoneyflow,
  resetForm,
  importImportedMoneyflow,
  deleteImportedMoneyflow,
});
</script>
