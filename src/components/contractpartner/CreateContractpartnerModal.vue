<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body>
      <form
        @submit.prevent="createContractpartner"
        :id="'createContractpartnerForm' + idSuffix"
        class="space-y-6"
      >
        <DivError :server-errors="serverErrors" />

        <div class="form-section space-y-4">
          <InputStandard
            v-model="mcp.name"
            :validation-schema="schema.name"
            :id="'name' + idSuffix"
            :field-label="$t('General.name')"
          />
        </div>
        <div class="form-section space-y-4">
          <div
            class="flex items-center space-x-2 border-b border-border/40 pb-2"
          >
            <span class="form-section-title">
              {{ $t("Contractpartner.moneyflowDefaults") }}
            </span>
          </div>
          <InputStandard
            v-model="mcp.moneyflowComment"
            :validation-schema="schema.moneyflowComment"
            :id="'moneyflowComment' + idSuffix"
            :field-label="$t('General.comment')"
          />
          <SelectPostingAccount
            v-model="mcp.postingAccountId"
            :validation-schema="schema.postingAccountId"
            :id-suffix="idSuffix + 'CreateContractpartner'"
            :field-label="$t('General.postingAccount')"
          />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="form-section flex flex-col justify-between">
            <span
              class="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2"
            >
              {{ $t("Contractpartner.validityData") }}
            </span>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <InputDate
                v-model="mcp.validFrom"
                :validation-schema="schema.validFrom"
                :id="'validFrom' + idSuffix"
                :field-label="$t('General.validFrom')"
              />
              <InputDate
                v-model="mcp.validTil"
                :validation-schema="schema.validTil"
                :id="'validTil' + idSuffix"
                :field-label="$t('General.validTil')"
              />
            </div>
          </div>
        </div>

        <Collapsible class="rounded-sm border bg-muted/30 overflow-hidden">
          <CollapsibleTrigger
            class="flex items-center justify-between w-full p-4 hover:bg-muted/30 text-left transition-colors group"
          >
            <div class="flex items-center space-x-2">
              <span class="form-section-title">
                {{ $t("Contractpartner.adressData") }}
              </span>
            </div>
            <ChevronDown
              class="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </CollapsibleTrigger>

          <CollapsibleContent
            class="p-4 pt-0 space-y-3 border-t border-border/40 mt-3 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
          >
            <div class="grid grid-cols-3 gap-4 pt-3">
              <div class="col-span-2">
                <InputStandard
                  v-model="mcp.street"
                  :validation-schema="schema.street"
                  :id="'street' + idSuffix"
                  :field-label="$t('Contractpartner.street')"
                />
              </div>
              <div class="col-span-1">
                <InputStandard
                  v-model="mcp.country"
                  :validation-schema="schema.country"
                  :id="'country' + idSuffix"
                  :field-label="$t('Contractpartner.country')"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-1">
                <InputStandard
                  v-model="mcp.postcode"
                  :validation-schema="schema.postcode"
                  :id="'postcode' + idSuffix"
                  :field-label="$t('Contractpartner.postcode')"
                />
              </div>
              <div class="col-span-2">
                <InputStandard
                  v-model="mcp.town"
                  :validation-schema="schema.town"
                  :id="'town' + idSuffix"
                  :field-label="$t('Contractpartner.town')"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="button-with-icon"
        @click="resetForm"
      >
        <Undo2 class="h-4 w-4" />
        {{ $t("General.reset") }}
      </Button>

      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createContractpartnerForm' + idSuffix"
      >
        <template #icon><Save class="h-4 w-4" /></template>
      </ButtonSubmit>
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { ChevronDown, Save, Undo2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { coerce, date, number, string, ZodType } from "zod";
import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";
import Collapsible from "../ui/collapsible/Collapsible.vue";
import CollapsibleContent from "../ui/collapsible/CollapsibleContent.vue";
import CollapsibleTrigger from "../ui/collapsible/CollapsibleTrigger.vue";

const { t } = useI18n();

const props = defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Contractpartner]: ZodType }> = {
  name: string(globErr(t("Contractpartner.validation.name")))
    .min(1)
    .max(100, t("Contractpartner.validation.length.name")),
  moneyflowComment: string()
    .max(100, t("Contractpartner.validation.length.moneyflowComment"))
    .optional(),
  postingAccountId: number().optional(),
  street: string()
    .max(100, t("Contractpartner.validation.length.street"))
    .optional(),
  postcode: coerce
    .number(globErr(t("Contractpartner.validation.postcode")))
    .optional(),
  town: string()
    .max(100, t("Contractpartner.validation.length.town"))
    .optional(),
  country: string()
    .max(100, t("Contractpartner.validation.length.country"))
    .optional(),
  validFrom: date(globErr(t("General.validation.validFrom"))),
  validTil: date(globErr(t("General.validation.validTil"))),
};

const mcp = ref({} as Contractpartner);
const origMcp = ref({} as Contractpartner | undefined);
const modalComponent = useTemplateRef<typeof ModalVue>("modalComponent");
const emit = defineEmits(["contractpartnerCreated", "contractpartnerUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcp.value === undefined
    ? t("Contractpartner.title.create")
    : t("Contractpartner.title.update");
});

const resetForm = () => {
  if (origMcp.value) {
    mcp.value = structuredClone(toRaw(origMcp.value))!;
  } else {
    const beginningOfPreviousMonth = new Date();
    beginningOfPreviousMonth.setDate(1);
    beginningOfPreviousMonth.setHours(0, 0, 0, 0);
    beginningOfPreviousMonth.setMonth(beginningOfPreviousMonth.getMonth() - 1);
    mcp.value = {
      validFrom: beginningOfPreviousMonth,
      validTil: new Date("2999-12-31"),
    } as Contractpartner;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = (_mcp?: Contractpartner) => {
  origMcp.value = _mcp ?? undefined;
  resetForm();
  modalComponent.value?._show();
};

const createContractpartner = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  const serviceCall =
    mcp.value.id > 0
      ? ContractpartnerService.updateContractpartner(mcp.value)
      : ContractpartnerService.createContractpartner(mcp.value);

  serviceCall
    .then((result) => {
      const isUpdate = mcp.value.id > 0;
      if (!isUpdate) mcp.value = result as Contractpartner;

      modalComponent.value?._hide();
      emit(
        isUpdate ? "contractpartnerUpdated" : "contractpartnerCreated",
        mcp.value,
      );
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
    });
});

defineExpose({ _show });
</script>
