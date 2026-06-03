<template>
  <Button variant="destructive" class="button-with-icon" @click="emit('click')">
    <Trash2 class="icon-medium" />
    {{ buttonLabel }}
  </Button>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";

defineProps<{
  buttonLabel: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>
