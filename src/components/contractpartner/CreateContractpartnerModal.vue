<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body>
      <form
        @submit.prevent="createContractpartner"
        :id="'createContractpartnerForm' + idSuffix"
        class="space-y-4"
      >
        <DivError :server-errors="serverErrors" />

        <div class="flex flex-col gap-4">
          <InputStandard
            v-model="mcp.name"
            :validation-schema="schema.name"
            :id="'name' + idSuffix"
            :field-label="$t('General.name')"
          />

          <InputStandard
            v-model="mcp.moneyflowComment"
            :validation-schema="schema.moneyflowComment"
            :id="'moneyflowComment' + idSuffix"
            :field-label="$t('Contractpartner.moneyflowComment')"
          />

          <SelectPostingAccount
            v-model="mcp.postingAccountId"
            :validation-schema="schema.postingAccountId"
            :id-suffix="idSuffix + 'CreateContractpartner'"
            :field-label="$t('General.postingAccount')"
          />

          <InputStandard
            v-model="mcp.street"
            :validation-schema="schema.street"
            :id="'street' + idSuffix"
            :field-label="$t('Contractpartner.street')"
          />

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

          <InputStandard
            v-model="mcp.country"
            :validation-schema="schema.country"
            :id="'country' + idSuffix"
            :field-label="$t('Contractpartner.country')"
          />

          <div class="grid grid-cols-2 gap-4">
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
      </form>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="secondary"
        class="flex items-center gap-2 px-6"
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
import { useForm } from "vee-validate";
import { computed, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { coerce, date, number, string, ZodType } from "zod";

import { Button } from "@/components/ui/button";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputDate from "../InputDate.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";
import SelectPostingAccount from "../postingaccount/SelectPostingAccount.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import ContractpartnerService from "@/service/ContractpartnerService";
import { Save, Undo2 } from "lucide-vue-next";

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
    Object.assign(mcp.value, origMcp.value);
  } else {
    mcp.value = {
      validFrom: new Date(),
      validTil: new Date("2999-12-31"),
    } as Contractpartner;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_mcp?: Contractpartner) => {
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
