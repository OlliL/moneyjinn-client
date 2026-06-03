<template>
  <div class="fixed bottom-26 right-6 z-50 md:hidden">
    <Button
      :data-testid="dataTestid"
      type="button"
      class="button-with-icon h-12 w-12 p-0 rounded-full shadow-lg justify-center animate-in fade-in zoom-in duration-200"
      @click="emit('click')"
    >
      <Plus class="h-6 w-6" />
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-vue-next";

defineProps<{
  dataTestid: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>
