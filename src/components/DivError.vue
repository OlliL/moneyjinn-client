<template>
  <div v-if="serverErrors && serverErrors.length > 0" class="mb-4">
    <Alert
      v-for="(error, index) in serverErrors"
      :key="index"
      variant="destructive"
      class="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 mb-2"
    >
      <AlertCircleIcon />
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>
  </div>
</template>

<script lang="ts" setup>
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-vue-next";

defineProps({
  serverErrors: {
    type: Array<string>,
    required: false,
  },
});
</script>
