<template>
  <ModalDelete
    :title="$t('ETF.title.delete')"
    id-suffix="DeleteEtf"
    v-model:open="open"
    :delete-action="() => CrudEtfService.deleteEtf(etf.id)"
    :delete-success-action="() => onDone?.(etf)"
  >
    <template #details>
      <ModalDeleteRow :label="$t('General.name')" highlight-value>
        {{ etf.name }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.isin')">
        {{ etf.isin }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.wkn')">
        {{ etf.wkn }}
      </ModalDeleteRow>

      <ModalDeleteRow :label="$t('ETF.ticker')">
        {{ etf.ticker }}
      </ModalDeleteRow>
    </template>
  </ModalDelete>
</template>

<script lang="ts" setup>
import ModalDelete from "@/components/common/ModalDelete.vue";
import ModalDeleteRow from "@/components/common/ModalDeleteRow.vue";
import CrudEtfService from "@/service/CrudEtfService";
import { storeToRefs } from "pinia";
import { useDeleteEtfModalStore } from "./DeleteEtfModal.store";

const { open, entity: etf, onDone } = storeToRefs(useDeleteEtfModalStore());
</script>
