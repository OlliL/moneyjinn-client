<template>
  <Button variant="destructive" class="button-with-icon" @click="emit('click')">
    <Trash2 class="icon-small" />
    {{ buttonLabel }}
  </Button>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";

defineProps({
  buttonLabel: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["click"]);
</script>
