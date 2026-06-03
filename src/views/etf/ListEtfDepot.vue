<template>
  <ButtonMobileCreate
    data-testid="etf-flow-create"
    @click="createEtfFlow"
    v-if="dataLoaded"
  />

  <DeleteEtfFlowModalVue @etf-flow-deleted="etfFlowDeleted" ref="deleteModal" />
  <CreateEtfFlowModalVue
    @etf-flow-created="etfFlowCreated"
    @etf-flow-updated="etfFlowUpdated"
    ref="createModal"
  />
  <div class="custom-container space-y-6">
    <div class="text-center">
      <h4 class="text-2xl font-bold">{{ $t("General.etfDepot") }}</h4>
    </div>
    <DivError :server-errors="serverErrors" />

    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-24 md:items-end">
          <div class="col-span-1 md:col-span-16">
            <SelectStandard
              v-model="selectedEtfId"
              :validation-schema="schema.etfId"
              id="etf"
              :field-label="$t('General.selectEtf')"
              :select-box-values="getAsSelectBoxValues()"
            />
          </div>

          <div
            class="col-span-1 md:col-span-8 mt-3 md:mt-0 hidden md:block"
            v-if="dataLoaded"
          >
            <Button
              data-testid="etf-depot-create"
              type="button"
              @click="createEtfFlow"
              class="button-with-icon w-full md:w-auto"
            >
              <PlusSquare class="mr-2 icon-medium" />
              {{ $t("ETFFlow.newBooking") }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-6 right-6 z-50 md:hidden"
      v-if="dataLoaded && etfFlows.length"
    >
      <Sheet v-model:open="isMobileFilterOpen">
        <SheetTrigger as-child>
          <Button
            data-testid="etf-depot-mobile-filter-trigger"
            class="h-12 w-12 p-0 rounded-full shadow-lg"
          >
            <Filter class="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          data-testid="etf-depot-mobile-filter-sheet"
          side="bottom"
          class="h-[40vh] rounded-t-xl p-6 flex flex-col"
        >
          <SheetHeader class="text-left pb-4 border-b shrink-0">
            <SheetTitle>{{ $t("General.displayOptions") }}</SheetTitle>
            <SheetDescription class="sr-only">
              {{ $t("General.displayOptions") }}
            </SheetDescription>
          </SheetHeader>

          <div class="flex-1 overflow-y-auto space-y-4 py-4">
            <div class="flex items-center gap-3 pb-1.5">
              <Switch
                data-testid="etf-depot-mobile-effective-switch"
                id="etfDepotEffectiveMobile"
                :modelValue="isMobileEffectiveOnly"
                @update:model-value="setMobileEffectiveOnly"
              />
              <Label
                for="etfDepotEffectiveMobile"
                class="cursor-pointer text-sm font-medium select-none whitespace-nowrap"
              >
                {{ $t("ETFFlow.effective") }}
              </Label>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>

    <div class="flex justify-center" v-if="dataLoaded && etfFlows.length">
      <ListEtfDepotMobile
        :flows="mobileFlows"
        :etf-name="selectedEtf.name"
        :partial="partial"
        :is-effective-only="isMobileEffectiveOnly"
        @delete-etf-flow="deleteEtfFlow"
        @edit-etf-flow="editEtfFlow"
      />

      <ListEtfDepotDesktop
        :current-tab="currentTab"
        :etf-flows="etfFlows"
        :etf-effective-flows="etfEffectiveFlows"
        :selected-etf-id="selectedEtf.id"
        @update:current-tab="setCurrentTab"
        @delete-etf-flow="deleteEtfFlow"
        @edit-etf-flow="editEtfFlow"
      />
    </div>

    <ListEtfDepotEtfTable
      :etfSummary="etfSummary"
      v-if="dataLoaded && etfFlows.length"
    />

    <CalcEtfSaleForm
      :etf="selectedEtf"
      :etfSummary="etfSummary"
      :pieces="calcEtfSalePieces"
      v-if="dataLoaded && etfFlows.length"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonMobileCreate from "@/components/common/ButtonMobileCreate.vue";
import DivError from "@/components/common/DivError.vue";
import SelectStandard from "@/components/common/SelectStandard.vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { Etf } from "@/model/etf/Etf";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import router, { Routes } from "@/router";
import EtfService from "@/service/EtfService";
import { useEtfStore } from "@/stores/EtfStore";
import { handleBackendError } from "@/tools/views/HandleBackendError";
import { globErr } from "@/tools/views/ZodUtil";
import { Filter, PlusSquare } from "lucide-vue-next";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { number } from "zod";
import CalcEtfSaleForm from "./elements/CalcEtfSaleForm.vue";
import CreateEtfFlowModalVue from "./elements/CreateEtfFlowModal.vue";
import DeleteEtfFlowModalVue from "./elements/DeleteEtfFlowModal.vue";
import ListEtfDepotDesktop from "./elements/ListEtfDepotDesktop.vue";
import ListEtfDepotEtfTable from "./elements/ListEtfDepotEtfTable.vue";
import ListEtfDepotMobile from "./elements/ListEtfDepotMobile.vue";

const { t } = useI18n();

const serverErrors = ref(new Array<string>());

const schema = {
  etfId: number(globErr(t("ETFFlow.validation.etfId"))).gt(0),
};
const dataLoaded = ref(false);
const etfFlows = ref({} as Array<EtfFlow>);
const etfEffectiveFlows = ref({} as Array<EtfFlow>);
const etfSummary = ref({} as EtfSummary);
const selectedEtf = ref({} as Etf);
const selectedEtfId = ref(undefined as number | undefined);

const calcEtfSalePieces = ref(0 as number | undefined);
const currentTab = ref<"effective" | "all">("all");
const isMobileFilterOpen = ref(false);
const deleteModal = useTemplateRef<typeof DeleteEtfFlowModalVue>("deleteModal");
const createModal = useTemplateRef<typeof CreateEtfFlowModalVue>("createModal");

const { getAsSelectBoxValues, getFavoriteEtf, getEtf } = useEtfStore();

const props = withDefaults(
  defineProps<{
    etfId?: string;
  }>(),
  {
    etfId: undefined,
  },
);

onMounted(() => {
  const etfId: number | undefined = props.etfId ? +props.etfId : undefined;
  const favoriteEtf = getFavoriteEtf();
  if (etfId !== undefined) {
    selectedEtfId.value = etfId;
  } else if (favoriteEtf !== undefined) {
    selectedEtfId.value = favoriteEtf.id;
  }
});

const partial = computed(() => {
  return (
    100 -
    (selectedEtfId.value
      ? (getEtf(Number(selectedEtfId.value))?.partialTaxExemption ?? 0)
      : 0)
  );
});

const isMobileEffectiveOnly = computed(() => {
  return currentTab.value === "effective";
});

const mobileFlows = computed(() => {
  return isMobileEffectiveOnly.value ? etfEffectiveFlows.value : etfFlows.value;
});

const setMobileEffectiveOnly = (value: boolean) => {
  if (value && etfEffectiveFlows.value.length > 0) {
    currentTab.value = "effective";
    return;
  }
  currentTab.value = "all";
};

const setCurrentTab = (value: "effective" | "all") => {
  currentTab.value = value;
};

const loadData = (etfId: number) => {
  serverErrors.value = new Array<string>();
  dataLoaded.value = false;
  etfFlows.value = new Array<EtfFlow>();
  etfEffectiveFlows.value = new Array<EtfFlow>();

  EtfService.listEtfFlowsById(etfId)
    .then((etfDepot) => {
      handleServerResponse(etfDepot, etfId);
      routerPush();
    })
    .catch((backendError) => {
      handleBackendError(backendError, serverErrors);
      routerPush();
    });
};

const handleServerResponse = (etfDepot: EtfDepot, etfId: number) => {
  selectedEtf.value = getEtf(etfId) ?? ({} as Etf);

  etfSummary.value = etfDepot.etfSummary ?? ({} as EtfSummary);

  calcEtfSalePieces.value = etfDepot.calcEtfSalePieces;

  if (etfDepot.etfFlows) {
    etfFlows.value = etfDepot.etfFlows;
  }
  if (etfDepot.etfEffectiveFlows) {
    etfEffectiveFlows.value = etfDepot.etfEffectiveFlows;
  }

  currentTab.value = etfEffectiveFlows.value.length > 0 ? "effective" : "all";

  dataLoaded.value = true;
};

const deleteEtfFlow = (etfFlow: EtfFlow) => {
  deleteModal.value?._show(etfFlow, selectedEtf.value.name);
};
const etfFlowDeleted = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

const createEtfFlow = () => {
  createModal.value?._show(null, selectedEtfId.value);
};
const etfFlowCreated = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

const editEtfFlow = (etfFlow: EtfFlow) => {
  createModal.value?._show(etfFlow);
};
const etfFlowUpdated = (etfFlow: EtfFlow) => {
  loadData(etfFlow.etfId);
};

watch(
  selectedEtfId,
  (newVal) => {
    if (newVal === undefined) {
      dataLoaded.value = false;
    } else loadData(newVal);
  },
  { immediate: true },
);

const routerPush = () => {
  if ((selectedEtfId.value || "") != (props.etfId || "")) {
    router.push({
      name: Routes.ListEtfDepot,
      params: { etfId: selectedEtfId.value },
    });
  }
};
</script>
