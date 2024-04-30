<template>
  <ModalVue :title="title" ref="modalComponent">
    <template #body
      ><form @submit.prevent="createEtf" :id="'createEtfForm' + idSuffix">
        <div class="container-fluid">
          <DivError :server-errors="serverErrors" />
          <div class="row">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.name"
                :validation-schema="schema.name"
                :id="'name' + idSuffix"
                :field-label="$t('General.name')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.isin"
                :validation-schema="schema.isin"
                :id="'isin' + idSuffix"
                :field-label="$t('ETF.isin')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.wkn"
                :validation-schema="schema.wkn"
                :id="'wkn' + idSuffix"
                :field-label="$t('ETF.wkn')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.ticker"
                :validation-schema="schema.ticker"
                :id="'ticker' + idSuffix"
                :field-label="$t('ETF.ticker')"
              />
            </div>
          </div>
          <div class="row pt-2">
            <div class="col-xs-12">
              <InputStandard
                v-model="met.chartUrl"
                :validation-schema="schema.chartUrl"
                :id="'chartUrl' + idSuffix"
                :field-label="$t('ETF.chartUrl')"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="resetForm">
        {{ $t("General.reset") }}
      </button>
      <ButtonSubmit
        :button-label="$t('General.save')"
        :form-id="'createEtfForm' + idSuffix"
      />
    </template>
  </ModalVue>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { string, ZodType } from "zod";

import ButtonSubmit from "../ButtonSubmit.vue";
import DivError from "../DivError.vue";
import InputStandard from "../InputStandard.vue";
import ModalVue from "../Modal.vue";

import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";

import type { Etf } from "@/model/etf/Etf";
import CrudEtfControllerHandler from "@/handler/CrudEtfControllerHandler";

const { t } = useI18n();

defineProps({
  idSuffix: {
    type: String,
    default: "",
  },
});

const serverErrors = ref(new Array<string>());

const schema: Partial<{ [key in keyof Etf]: ZodType }> = {
  isin: string(globErr(t("ETF.validation.isin")))
    .min(1)
    .max(30, t("ETF.validation.length.isin")),
  name: string(globErr(t("ETF.validation.name")))
    .min(1)
    .max(30, t("ETF.validation.length.name")),
  wkn: string(globErr(t("ETF.validation.wkn")))
    .min(1)
    .max(30, t("ETF.validation.length.wkn")),
  ticker: string(globErr(t("ETF.validation.ticker")))
    .min(1)
    .max(30, t("ETF.validation.length.ticker")),
  chartUrl: string().max(100, t("ETF.validation.length.chartUrl")).optional(),
};

const met = ref({} as Etf);
const origMcp = ref({} as Etf | undefined);
const modalComponent = ref();
const emit = defineEmits(["etfCreated", "etfUpdated"]);

const { handleSubmit, values, setFieldTouched } = useForm();

const title = computed(() => {
  return origMcp.value === undefined
    ? t("ETF.title.create")
    : t("ETF.title.update");
});

const resetForm = () => {
  if (origMcp.value) {
    Object.assign(met.value, origMcp.value);
  } else {
    met.value = {} as Etf;
  }
  serverErrors.value = new Array<string>();
  Object.keys(values).forEach((field) => setFieldTouched(field, false));
};

const _show = async (_met?: Etf) => {
  origMcp.value = _met ?? undefined;
  resetForm();
  modalComponent.value._show();
};

const createEtf = handleSubmit(() => {
  serverErrors.value = new Array<string>();

  if (met.value.id > 0) {
    //update
    CrudEtfControllerHandler.updateEtf(met.value)
      .then(() => {
        modalComponent.value._hide();
        emit("etfUpdated", met.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  } else {
    //create
    CrudEtfControllerHandler.createEtf(met.value)
      .then((etf) => {
        met.value = etf;
        modalComponent.value._hide();
        emit("etfCreated", met.value);
      })
      .catch((backendError) => {
        handleBackendError(backendError, serverErrors);
      });
  }
});
defineExpose({ _show });
</script>
