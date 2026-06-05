<script setup lang="ts">
import CreateCapitalsourceModal from "@/components/capitalsource/CreateCapitalsourceModal.vue";
import CreateContractpartnerModal from "@/components/contractpartner/CreateContractpartnerModal.vue";
import CreateMoneyflowQuickModal from "@/components/moneyflow/CreateMoneyflowQuickModal.vue";
import DeleteMoneyflowModal from "@/components/moneyflow/DeleteMoneyflowModal.vue";
import EditMonthlySettlementModal from "@/components/monthlysettlement/EditMonthlySettlementModal.vue";
import EditMoneyflowModal from "@/components/moneyflow/EditMoneyflowModal.vue";
import ListMoneyflowModal from "@/components/moneyflow/ListMoneyflowModal.vue";
import CreatePostingAccountModal from "@/components/postingaccount/CreatePostingAccountModal.vue";
import CreatePreDefMoneyflowModal from "@/components/predefmoneyflow/CreatePreDefMoneyflowModal.vue";
import ReceiptModal from "@/components/reports/ReceiptModal.vue";
</script>

<template>
  <CreateCapitalsourceModal />
  <CreateContractpartnerModal />
  <EditMonthlySettlementModal />
  <DeleteMoneyflowModal />
  <EditMoneyflowModal />
  <ListMoneyflowModal />
  <CreatePostingAccountModal />
  <CreatePreDefMoneyflowModal />
  <ReceiptModal />
  <CreateMoneyflowQuickModal />
</template>
